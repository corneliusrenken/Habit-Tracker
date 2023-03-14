import React from 'react';

type Props = {
  selectedIndex: number;
  options: string[];
  className?: string;
};

export default function Select({ selectedIndex, options, className }: Props) {
  const classNamePrefix = className || 'select';

  return (
    <div
      className={classNamePrefix}
    >
      {options.map((option, index) => {
        let buttonClassName = `${classNamePrefix}-option`;

        if (index === selectedIndex) buttonClassName += ' selected';

        return (
          <button
            className={buttonClassName}
            type="button"
            key={option}
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
