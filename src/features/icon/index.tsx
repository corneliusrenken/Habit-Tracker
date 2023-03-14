import React from 'react';
import iconPaths from './iconPaths';

type Props = {
  icon: keyof typeof iconPaths;
  className?: string;
};

export default function Icon({ icon, className }: Props) {
  return (
    <svg
      className={className || 'icon'}
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={iconPaths[icon]}
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

Icon.defaultProps = {
  className: undefined,
};
