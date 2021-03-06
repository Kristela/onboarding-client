import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router';
import { Message } from 'retranslate';

import { Loader } from '../../common';
import PensionFundTable from './pensionFundTable';
import { SelectSources } from './SelectSources';

describe('Select sources step', () => {
  let component;

  beforeEach(() => {
    component = shallow(<SelectSources />);
  });

  it('renders a loader when loading pension funds', () => {
    component.setProps({ loadingSourceFunds: true });
    expect(component.find(Loader).length).toBe(1);
    expect(component.get(0)).toEqual(<Loader className="align-middle" />);
  });

  it('does not render a loader when pension funds loaded', () => {
    component.setProps({ loadingSourceFunds: false });
    expect(component.find(Loader).length).toBe(0);
  });

  it('renders a title', () => {
    expect(component.contains(<Message>select.sources.current.status</Message>)).toBe(true);
  });

  it('renders a pension funds table with given funds', () => {
    const sourceFunds = [{ iAmAFund: true }, { iAmAlsoAFund: true }];
    component.setProps({ sourceFunds });
    expect(component.contains(<PensionFundTable funds={sourceFunds} />)).toBe(true);
  });

  it('renders a link to the next step', () => {
    expect(component.contains(
      <Link className="btn btn-primary mt-5" to="/steps/select-target-fund">
        <Message>steps.next</Message>
      </Link>,
    )).toBe(true);
  });

  // TODO: write tests once selectExchangeSources supports selecting parts of funds.
});
