import React, { PropTypes as Types } from 'react';
import { Message } from 'retranslate';

import FundExchangeRow from './fundExchangeRow';
import './ExactFundSelector.scss';

function createSelectionChangeHandler(index, selections, onSelect) {
  return newSelection =>
    onSelect([...selections.slice(0, index), newSelection, ...selections.slice(index + 1)]);
}

const ExactFundSelector = ({ selections, sourceFunds, targetFunds, onSelect }) => (
  <div>
    <div className="row mt-4">
      <div className="col-5">
        <b><Message>select.sources.select.some.source</Message></b>
      </div>
      <div className="col">
        <b><Message>select.sources.select.some.percentage</Message></b>
      </div>
      <div className="col-5">
        <b><Message>select.sources.select.some.target</Message></b>
      </div>
    </div>
    {
      selections.map((selection, index) => (
        <FundExchangeRow
          key={index} // eslint-disable-line react/no-array-index-key
          selection={selection}
          sourceFunds={sourceFunds}
          targetFunds={targetFunds}
          onChange={createSelectionChangeHandler(index, selections, onSelect)}
        />
      ))
    }
    <div className="mt-4">
      <small><Message>select.sources.select.some.cost</Message></small>
    </div>
  </div>
);

const noop = () => null;

ExactFundSelector.defaultProps = {
  selections: [],
  sourceFunds: [],
  targetFunds: [],
  onSelect: noop,
};

ExactFundSelector.propTypes = {
  selections: Types.arrayOf(Types.shape({})),
  sourceFunds: Types.arrayOf(Types.shape({})),
  targetFunds: Types.arrayOf(Types.shape({})),
  onSelect: Types.func,
};

export default ExactFundSelector;
