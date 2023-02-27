import React from 'react';
import { forwardRef, ReactElement, ReactNode } from 'react';
import styled from '@emotion/styled';

const LinkButtonStyled = styled.a`
  padding: 8px 15px;
  font-size: var(--vg-fontSizes-sm);
  border-radius: var(--vg-radii-md);
  margin: 4px;
  transition: all 0.12s;
  font-weight: var(--vg-fontWeights-medium);
  color: var(--vg-colors-black);

  &:hover {
    cursor: pointer;
    color: var(--vg-colors-brand-500);
    background-color: var(--vg-colors-brand-100);
  }
  &:focus {
    outline: 1px solid var(--vg-colors-brand-500);
  }
`;

interface LinkButtonProps {
  children: ReactNode;
  href: string;
  target?: string;
}

export const LinkButton = forwardRef<HTMLAnchorElement, React.PropsWithChildren<LinkButtonProps>>(
  ({ children, href, target }: LinkButtonProps, ref): ReactElement => (
    <LinkButtonStyled ref={ref} href={href} tabIndex={0} target={target} data-testid='link-button'>
      {children}
    </LinkButtonStyled>
  ),
);
