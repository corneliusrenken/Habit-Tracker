/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
import getElementsDistanceFromListBounds from '../common/getElementsDistanceFromListBounds';

type Props = {
  active: boolean;
  activeOnClick?: boolean;
  setActive: (active: boolean) => void;
  placeholder: string;
  initialValue?: string;
  getInputValidationError?: (input: string) => string;
  onSubmit: (input: string) => void;
  placeholderClassOverwrite?: string,
  errorClassOverwrite?: string,
  formClassOverwrite?: string,
  inputClassOverwrite?: string,
};

/**
 * @param getInputValidationError - return error message or empty string
 */
export default function CustomForm({
  active,
  activeOnClick = false,
  setActive,
  placeholder,
  initialValue = '',
  getInputValidationError = () => '',
  onSubmit,
  placeholderClassOverwrite = undefined,
  errorClassOverwrite = undefined,
  formClassOverwrite = undefined,
  inputClassOverwrite = undefined,
}: Props) {
  const [error, setError] = useState('');
  const [input, setInput] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (active && !error && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [active, error]);

  useEffect(() => {
    if (!active) setInput(initialValue);
  }, [active, initialValue]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (error) {
      const clearError = () => {
        window.removeEventListener('click', clearError);
        window.removeEventListener('keydown', clearError);
        setError('');
      };

      window.addEventListener('click', clearError);
      window.addEventListener('keydown', clearError);

      const timeoutId = setTimeout(clearError, 4000);

      return () => {
        window.removeEventListener('click', clearError);
        window.removeEventListener('keydown', clearError);
        clearTimeout(timeoutId);
      };
    }
  }, [error]);

  if (!active) {
    const placeholderClassName = placeholderClassOverwrite || 'placeholder';

    return (
      <div
        className={placeholderClassName}
        onClick={!activeOnClick ? undefined : () => {
          if (activeOnClick) {
            setActive(true);
          }
        }}
      >
        {placeholder}
      </div>
    );
  }

  if (error) {
    const errorClassName = errorClassOverwrite || 'error';

    return (
      <div
        className={errorClassName}
      >
        {error}
      </div>
    );
  }

  const formClassName = formClassOverwrite || 'form';
  const inputClassName = inputClassOverwrite || 'input';

  return (
    <form
      className={formClassName}
      onSubmit={(e) => {
        e.preventDefault();
        const validationError = getInputValidationError(input);
        if (!validationError) {
          onSubmit(input);
        } else {
          setError(validationError);
        }
      }}
    >
      <input
        className={inputClassName}
        spellCheck={false}
        ref={inputRef}
        type="text"
        value={input}
        onKeyDown={(e) => {
          const inputElement = e.target as HTMLInputElement;
          const formElement = inputElement.parentElement as HTMLFormElement;
          const bounds = formElement.getBoundingClientRect();
          const distance = getElementsDistanceFromListBounds(bounds);
          window.scrollBy(0, distance);
        }}
        onChange={(e) => { setInput(e.target.value); }}
        placeholder={placeholder}
        onBlur={(e) => {
          e.target.focus({ preventScroll: true });
          setActive(false);
        }}
      />
    </form>
  );
}

CustomForm.defaultProps = {
  activeOnClick: false,
  initialValue: '',
  getInputValidationError: () => '',
  placeholderClassOverwrite: undefined,
  errorClassOverwrite: undefined,
  formClassOverwrite: undefined,
  inputClassOverwrite: undefined,
};
