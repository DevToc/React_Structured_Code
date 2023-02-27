import { useEffect } from 'react';

// component for modifying / appending elements to the document head
export const Head = ({ title }: { title: string }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
};
