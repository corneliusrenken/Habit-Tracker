/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import './icon.css';
import {
  hiddenPath, moreOptionsPath, movePath, renamePath, shownPath, trashPath,
} from './iconPaths';

// https://icons.radix-ui.com/

const iconPaths = {
  move: movePath,
  'more options': moreOptionsPath,
  shown: shownPath,
  hidden: hiddenPath,
  rename: renamePath,
  trash: trashPath,
};

type IconProps = {
  icon: keyof typeof iconPaths;
  onClick?: Function;
  classes?: string[];
};

export default function Icon({ icon, onClick, classes }: IconProps) {
  return (
    <div
      className={`icon${classes ? ` ${classes.join(' ')}` : ''}`}
      onClick={onClick ? (e) => onClick(e) : undefined}
    >
      <svg
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
    </div>
  );
}

Icon.defaultProps = {
  onClick: undefined,
  classes: undefined,
};
