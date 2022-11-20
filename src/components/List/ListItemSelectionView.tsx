import React from 'react';
import { Habit } from '../../globalTypes';
import Icon from '../Icon/Icon';
import './list.css';
import ListItem from './ListItem';

type Props = {
  habit: Habit;
  selected: boolean;
  active: boolean;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
};

function ListItemSelectionView({
  habit, selected, active, setActiveIndex,
}: Props) {
  const { order } = habit;

  return (
    <ListItem
      habit={habit}
      content={(
        <>
          {selected && (
            <div
              className="horizontal-icons-container"
            >
              <Icon icon="move" />
              <Icon
                icon="more options"
                onClick={() => {
                  if (active) {
                    setActiveIndex(undefined);
                  } else {
                    setActiveIndex(order);
                  }
                }}
                classes={active ? ['selected'] : undefined}
              />
            </div>
          )}
          {active && (
            <div className="vertical-icons-container">
              <Icon icon="shown" />
              <Icon icon="rename" />
              <Icon icon="trash" />
            </div>
          )}
        </>
      )}
    />
  );
}

export default ListItemSelectionView;
