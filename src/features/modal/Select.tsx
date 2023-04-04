import React from 'react';

type Props<T> = {
  options: T[];
  disableTabIndex?: boolean;
  selectedOption: T;
  setSelectedOption: (option: T) => void;
};

export default function Select<T extends string>({
  options,
  disableTabIndex,
  selectedOption,
  setSelectedOption,
}: Props<T>) {
  return (
    <div
      className="select-input"
    >
      {options.map((option) => {
        let buttonClassName = 'option';
        if (option === selectedOption) buttonClassName += ' selected';

        return (
          <button
            tabIndex={disableTabIndex || option === selectedOption ? -1 : undefined}
            className={buttonClassName}
            type="button"
            key={option}
            onClick={option === selectedOption ? undefined : () => setSelectedOption(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

Select.defaultProps = {
  disableTabIndex: undefined,
};
