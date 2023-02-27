import { ForwardedRef, useEffect, useRef } from 'react';

// This hook's use case is similar to React.ForwardRef, which can be either object ref or callback ref.
// Purpose of this hook is to add nullability when forwarding refs.
/* Example use case:
  const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    (props, ref) => {
     const forwardedRef = useForwardRef<HTMLInputElement>(ref);
     // do something here
    }
   );
*/
export const useForwardRef = <T>(ref: ForwardedRef<T>, initialValue: any = null) => {
  const targetRef = useRef<T>(initialValue);

  useEffect(() => {
    if (!ref) return;

    if (typeof ref === 'function') {
      ref(targetRef.current);
    } else {
      ref.current = targetRef.current;
    }
  }, [ref]);

  return targetRef;
};
