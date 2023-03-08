import React from 'react';
import { StepContent, StepLabel, Step, Stepper } from '@mui/material';
import { useGlobal } from '@metafox/framework';
import { StepsProps } from './types';
import reducerFunction from './reducerFunction';
import StepContext from './Context';

export default function VerticalSteps({ data: _data }: StepsProps) {
  const { jsxBackend } = useGlobal();

  const reducer = React.useReducer(reducerFunction, {
    activeStep: 0,
    activeId: _data.steps[0].id,
    data: _data
  });

  const [{ data, activeStep }] = reducer;

  if (!data?.steps) return null;

  return (
    <StepContext.Provider value={reducer}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {data.steps.map(step => {
          return (
            <Step key={step.id}>
              <StepLabel>{step.title}</StepLabel>
              <StepContent>{jsxBackend.render(step.content)}</StepContent>
            </Step>
          );
        })}
      </Stepper>
    </StepContext.Provider>
  );
}
