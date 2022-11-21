import React, { useState } from 'react';
import { Habit } from '../../globalTypes';
import Icon from '../Icon/Icon';
import './list.css';
import ListItem from './ListItem';

type Props = {
  habit: Habit;
  selected: boolean;
  active: boolean;
  toggleVisible: Function;
  renameHabit: (name: string) => void;
  removeHabit: (id: number) => void;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
};

function ListItemSelectionView({
  habit,
  selected,
  active,
  toggleVisible,
  renameHabit,
  removeHabit,
  setActiveIndex,
}: Props) {
  const { name, order, visible } = habit;
  const [renaming, setRenaming] = useState(false);
  const [renamingInput, setRenamingInput] = useState('');

  function startRenaming() {
    setRenamingInput(name);
    setRenaming(true);
  }

  function endRenaming() {
    renameHabit(renamingInput);
    setRenaming(false);
  }

  return (
    <ListItem
      habit={habit}
      content={(
        <>
          {!renaming ? (
            <div className={`name${!visible ? ' greyed-out' : ''}`}>{name}</div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                endRenaming();
              }}
            >
              <input
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                onBlur={() => endRenaming()}
                onChange={(e) => setRenamingInput(e.target.value)}
                value={renamingInput}
              />
            </form>
          )}
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
                classes={active ? ['greyed-out'] : undefined}
              />
            </div>
          )}
          {active && (
            <div className="vertical-icons-container">
              {(visible
                ? <Icon icon="shown" onClick={toggleVisible} />
                : <Icon icon="hidden" classes={['greyed-out']} onClick={toggleVisible} />
              )}
              <Icon
                icon="rename"
                classes={renaming ? ['greyed-out'] : undefined}
                onClick={() => {
                  if (!renaming) {
                    startRenaming();
                  } else {
                    endRenaming();
                  }
                }}
              />
              <Icon icon="trash" onClick={removeHabit} />
            </div>
          )}
        </>
      )}
    />
  );
}

export default ListItemSelectionView;
