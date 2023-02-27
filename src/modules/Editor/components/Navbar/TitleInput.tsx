import { ReactElement, KeyboardEvent, ChangeEvent, useState, useRef, useEffect, memo } from 'react';

import { Input } from 'modules/common/components/Input/Input';

const TITLE_PLACEHOLDER = 'Document Title';

interface TitleInputProps {
  title: string;
  onSubmit: Function;
}

export const TitleInput = memo(({ title, onSubmit }: TitleInputProps): ReactElement => {
  const [documentTitle, setDocumentTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (title) {
      setDocumentTitle(title);
    }
  }, [title]);

  /**
   * Trigger title update when hitting Enter
   */
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.key || e.code;

    if (key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  /**
   * Submit the title.
   * Triggered when hitting Enter key or on blur.
   */
  const handleOnSubmit = () => {
    if (!documentTitle) {
      setDocumentTitle(title);
      return;
    }

    onSubmit(documentTitle);
  };

  /**
   * Triggered on input change
   */
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value || '');
  };

  return (
    <Input
      value={documentTitle}
      onBlur={handleOnSubmit}
      onChange={onInputChange}
      variant={'outline'}
      size={'sm'}
      placeholder={TITLE_PLACEHOLDER}
      ref={inputRef}
      width={200}
      onKeyDown={onKeyDown}
      data-testid={'infographtitle-input'}
      textOverflow={'ellipsis'}
    />
  );
});
