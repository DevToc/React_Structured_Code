import styled from '@emotion/styled';

const SkipNavLinkStyled = styled.a`
  user-select: none;
  border: 0;
  height: 1px;
  width: 1px;
  margin: -1px;
  outline: transparent solid 2px;
  outline-offset: 2px;
  overflow: hidden;
  position: absolute;
  clip: rect(0 0 0 0);
  z-index: var(--vg-zIndices-skipLinks);
  border-radius: var(--vg-radii-md);
  font-weight: var(--vg-fontWeights-semibold);

  &:focus {
    position: fixed;
    top: 1.5rem;
    left: 1.5rem;
    clip: auto;
    width: auto;
    height: auto;
    padding: var(--vg-sizes-4);
    background: var(--vg-colors-white);
    box-shadow: var(--vg-shadows-outline);
  }
`;

interface SkipNavLinkProps {
  children: React.ReactNode;
  id?: string;
  ['data-testid']?: string;
}
// TODO: temporary replace with @chakra-ui/skip-nav once upgraded to Chakra 2
export const SkipNavLink = ({ children, id, ...props }: SkipNavLinkProps) => {
  const testId = props['data-testid'];

  return (
    <SkipNavLinkStyled data-testid={testId} href={`#${id}`}>
      {children}
    </SkipNavLinkStyled>
  );
};
