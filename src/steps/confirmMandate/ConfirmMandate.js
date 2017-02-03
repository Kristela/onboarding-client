import React, { PropTypes as Types } from 'react';
import { bindActionCreators } from 'redux';
import { Message } from 'retranslate';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { Loader } from '../../common';

import { signMandate } from '../../exchange/actions';

import './ConfirmMandate.scss';

// TODO: write tests after demo
const ConfirmMandate = ({ user, loadingUser, exchange, onSignMandate }) => {
  if (loadingUser || exchange.loadingSourceFunds || exchange.loadingTargetFunds) {
    return <Loader className="align-middle" />;
  }
  return (
    <div className="px-col">
      <Message>confirm.mandate.me</Message><b>{user.firstName} {user.lastName}</b>
      <Message>confirm.mandate.idcode</Message><b>{user.personalCode}</b>
      <Message>confirm.mandate.change.mandate</Message>
      {
        exchange.transferFutureCapital ? (
          <div className="mt-4">
            <Message>confirm.mandate.transfer.pension</Message>
            <b className="highlight">
              <Message>
                {`target.funds.${exchange.selectedTargetFund.isin}.title.into`}
              </Message>
            </b>.
          </div>
        ) : ''
      }
      {
        exchange.sourceSelection.map(fund => (
          <div className="mt-4">
            <Message>confirm.mandate.switch</Message>
            <b>
              {
                fund.percentage === 1 ?
                  <Message>confirm.mandate.amounts.all</Message> :
                  `${fund.percentage * 100}%`
              }
            </b>
            <Message>confirm.mandate.under.my.control</Message>
            <b>{fund.name}</b>
            <Message>confirm.mandate.shares</Message>
            <b className="highlight">
              <Message>
                {`target.funds.${exchange.selectedTargetFund.isin}.title`}
              </Message>
            </b>
            <Message>confirm.mandate.for.shares</Message>
          </div>
        ))
      }
      <div className="mt-5">
        <button
          className="btn btn-primary mr-2"
          onClick={() => onSignMandate({
            fundTransferExchanges: exchange.sourceSelection.map(fund => ({
              percent: fund.percentage * 100,
              sourceFundIsin: fund.isin,
              targetFundIsin: exchange.selectedTargetFund.isin,
            })),
            futureContributionFundIsin: exchange.transferFutureCapital ?
              exchange.selectedTargetFund.isin : null,
          })}
        >
          <Message>confirm.mandate.sign</Message>
        </button>
        <Link className="btn btn-secondary" to="/steps/transfer-future-capital">
          <Message>steps.previous</Message>
        </Link>
      </div>
    </div>
  );
};

const noop = () => null;

ConfirmMandate.defaultProps = {
  user: {},
  loadingUser: false,
  exchange: {
    loadingSourceFunds: false,
    loadingTargetFunds: false,
    transferFutureCapital: true,
    sourceSelection: [],
    selectedTargetFund: {},
  },
  onSignMandate: noop,
};

ConfirmMandate.propTypes = {
  user: Types.shape({}),
  loadingUser: Types.bool,
  exchange: Types.shape({
    loadingSourceFunds: Types.bool,
    loadingTargetFunds: Types.bool,
    transferFutureCapital: Types.bool,
    sourceSelection: Types.arrayOf(Types.shape({})),
    selectedTargetFund: Types.shape({ isin: Types.string }),
  }).isRequired,
  onSignMandate: Types.func,
};

const mapStateToProps = state => ({
  user: state.login.user,
  loadingUser: state.login.loadingUser,
  exchange: state.exchange,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onSignMandate: signMandate,
}, dispatch);

const connectToRedux = connect(mapStateToProps, mapDispatchToProps);

export default connectToRedux(ConfirmMandate);