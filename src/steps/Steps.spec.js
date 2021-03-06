import React from 'react';
import { Message } from 'retranslate';
import { shallow } from 'enzyme';

import { Steps } from './Steps';
import StepTitle from './stepTitle';

describe('Steps', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Steps />);
  });

  it('renders the step given to it as step content', () => {
    const children = <div id="test-step">I am a test step</div>;
    component.setProps({ children });
    expect(component.contains(children)).toBe(true);
  });

  it('renders the title of the step given to it as active', () => {
    component.setProps({ stepName: 'select-target-fund' });
    expect(component.contains(
      <StepTitle active number={2}>
        <Message>steps.select-target-fund</Message>
      </StepTitle>,
    )).toBe(true);
  });

  it('renders the titles of the steps before the given step as completed steps', () => {
    component.setProps({ stepName: 'transfer-future-capital' });
    expect(component.contains(
      <StepTitle completed number={1}>
        <Message>steps.select-sources</Message>
      </StepTitle>,
    )).toBe(true);
    expect(component.contains(
      <StepTitle completed number={2}>
        <Message>steps.select-target-fund</Message>
      </StepTitle>,
    )).toBe(true);
  });

  it('renders the titles of the steps after the given step', () => {
    component.setProps({ stepName: 'select-target-fund' });
    expect(component.contains(
      <StepTitle number={3}>
        <Message>steps.transfer-future-capital</Message>
      </StepTitle>,
    )).toBe(true);
    expect(component.contains(
      <StepTitle number={4}>
        <Message>steps.confirm-mandate</Message>
      </StepTitle>,
    )).toBe(true);
  });

  it('renders an intro with the user\'s name if they are on the first step', () => {
    const name = 'name';
    component.setProps({ stepName: 'select-target-fund', userFirstName: name }); // not first step
    expect(component.contains(<Message params={{ name }}>steps.welcome</Message>)).toBe(false);
    expect(component.contains(<Message>steps.intro</Message>)).toBe(false);
    component.setProps({ stepName: 'select-sources' }); // first step
    expect(component.contains(<Message params={{ name }}>steps.welcome</Message>)).toBe(true);
    expect(component.contains(<Message>steps.intro</Message>)).toBe(true);
  });

  it('renders a vertical line in the bottom for all but the last step', () => {
    [
      'select-sources',
      'select-target-fund',
      'transfer-future-capital',
    ].forEach((stepName) => {
      component.setProps({ stepName });
      expect(component.contains(<hr className="mb-4" />)).toBe(true);
    });

    component.setProps({ stepName: 'confirm-mandate' });
    expect(component.contains(<hr className="mb-4" />)).toBe(false);
  });
});
