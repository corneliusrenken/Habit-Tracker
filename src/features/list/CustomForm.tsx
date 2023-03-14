/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  active: boolean;
  activeOnClick?: boolean;
  setActive: (active: boolean) => void;
  placeholder: string;
  initialValue?: string;
  getInputValidationError?: (input: string) => string;
  onSubmit: (input: string) => void;
  classNameBeforeAppend: string;
  placeholderClassAppendOverwrite?: string,
  errorClassAppendOverwrite?: string,
  formClassAppendOverwrite?: string,
  inputClassAppendOverwrite?: string,
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
  classNameBeforeAppend,
  placeholderClassAppendOverwrite = undefined,
  errorClassAppendOverwrite = undefined,
  formClassAppendOverwrite = undefined,
  inputClassAppendOverwrite = undefined,
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
    const classNameAppend = placeholderClassAppendOverwrite || 'placeholder';

    return (
      <div
        className={`${classNameBeforeAppend}-${classNameAppend}`}
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
    const classNameAppend = errorClassAppendOverwrite || 'error';

    return (
      <div
        className={`${classNameBeforeAppend}-${classNameAppend}`}
      >
        {error}
      </div>
    );
  }

  const formClassNameAppend = formClassAppendOverwrite || 'form';
  const inputClassNameAppend = inputClassAppendOverwrite || 'input';

  return (
    <form
      className={`${classNameBeforeAppend}-${formClassNameAppend}`}
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
        className={`${classNameBeforeAppend}-${inputClassNameAppend}`}
        spellCheck={false}
        ref={inputRef}
        type="text"
        value={input}
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
  placeholderClassAppendOverwrite: undefined,
  errorClassAppendOverwrite: undefined,
  formClassAppendOverwrite: undefined,
  inputClassAppendOverwrite: undefined,
};
