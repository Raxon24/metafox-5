import { useContext } from 'react';
import StepContext from './Context';

export default function useStepNavigate() {
  const [, dispatch] = useContext(StepContext);

  return [() => dispatch({ type: 'next' }), () => dispatch({ type: 'back' })];
}
