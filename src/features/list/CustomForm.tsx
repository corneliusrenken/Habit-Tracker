/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';

type Props = {
  active: boolean;
  activeOnClick?: boolean;
  setActive: (active: boolean) => void;
  placeholder: string;
  initialValue?: string;
  getInputValidationError?: (input: string) => string;
  onSubmit: (input: string) => void;
  containerClass?: string;
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
  containerClass = undefined,
}: Props) {
  const [error, setError] = useState('');
  const [input, setInput] = useState(initialValue);

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

      setTimeout(clearError, 4000);

      return () => {
        window.removeEventListener('click', clearError);
        window.removeEventListener('keydown', clearError);
      };
    }
  }, [error]);

  if (!active) {
    return (
      <div
        className={containerClass}
        onClick={!activeOnClick ? undefined : () => {
          if (activeOnClick) {
            setActive(true);
          }
        }}
      >
        <div>{placeholder}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={containerClass}
      >
        <div style={{ color: 'red' }}>{error}</div>
      </div>
    );
  }

  return (
    <form
      className={containerClass}
      onSubmit={(e) => {
        e.preventDefault();
        const validationError = getInputValidationError(input);
        if (!validationError) {
          setInput(initialValue);
          onSubmit(input);
        } else {
          setError(validationError);
        }
      }}
    >
      <input
        autoFocus
        type="text"
        value={input}
        onChange={(e) => { setInput(e.target.value); }}
        onBlur={() => {
          setInput(initialValue);
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
  containerClass: undefined,
};
