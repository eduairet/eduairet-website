import { ReactNode, memo } from 'react';

interface IProps {
  children: ReactNode;
}

function BodyWrapper({ children }: IProps) {
  return <body>{children}</body>;
}

export default memo(BodyWrapper);
