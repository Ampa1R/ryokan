import { Button as UIButton } from '../ui/button';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ButtonProps {}

export function Button(props: ButtonProps) {
  return <UIButton>Hello button</UIButton>;
}

export default Button;
