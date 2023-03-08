import { JsxShape } from '@metafox/framework/types';

export interface StepShape {
  title: string;
  id: string;
  content: JsxShape;
}

export interface State {
  activeStep: number;
  activeId?: string;
  data: { steps: StepShape[] };
}

export interface StepsProps {
  data: {
    steps: StepShape[];
  };
}
