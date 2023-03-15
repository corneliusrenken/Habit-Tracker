import React from 'react';

type Props<T> = {
  className?: string;
  options: T[];
  selectedOption: T;
  setSelectedOption: (option: T) => void;
};

export default function Select<T extends string>({
  className,
  options,
  selectedOption,
  setSelectedOption,
}: Props<T>) {
  const classNamePrefix = className || 'select';

  return (
    <div
      className={classNamePrefix}
    >
      {options.map((option) => {
        let buttonClassName = `${classNamePrefix}-option`;

        if (option === selectedOption) buttonClassName += ' selected';

        return (
          <button
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
  className: undefined,
};
