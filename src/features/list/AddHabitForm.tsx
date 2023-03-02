import React from 'react';
import { Habit } from '../../globalTypes';
import CustomForm from './CustomForm';

type Props = {
  habits: Habit[];
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  addHabit: (name: string) => void;
};

export default function AddHabitForm({
  habits,
  selectedIndex,
  setSelectedIndex,
  addHabit,
  inInput,
  setInInput,
}: Props) {
  // const [habitInput, setHabitInput] = useState('');
  // const habitInputRef = useRef<HTMLInputElement>(null);

  const selectedForm = selectedIndex === habits.length;

  // development
  // development
  // development
  if (selectedForm && !inInput) {
    throw new Error('inInput should never be false when form is selected');
  }

  return (
    <CustomForm
      active={selectedForm}
      activeOnClick
      setActive={(active) => {
        if (active) {
          setSelectedIndex(habits.length);
          setInInput(true);
        } else {
          setSelectedIndex(habits.length !== 0 ? habits.length - 1 : null);
          setInInput(false);
        }
      }}
      placeholder="add habit"
      initialValue=""
      getInputValidationError={(name) => {
        if (habits.some((habit) => habit.name === name)) {
          return 'A habit with that name already exists';
        }
        return '';
      }}
      onSubmit={(name) => {
        addHabit(name);
        setInInput(false);
      }}
    />
  );

  // useEffect(() => {
  //   if (selectedForm) {
  //     habitInputRef.current?.focus();
  //   } else {
  //     habitInputRef.current?.blur();
  //   }
  // }, [selectedForm]);

  // let formClassName = '';
  // if (selectedForm) formClassName += 'selected';

  // return (
  //   <form
  //     className={formClassName}
  //     style={{ top: `${habits.length * 50}px` }}
  //     onSubmit={(e) => {
  //       e.preventDefault();
  //       const trimmedHabitInput = habitInput.trim();
  //       const validation = isValidHabitName(trimmedHabitInput, { habits });
  //       if (validation === true) {
  //         addHabit(trimmedHabitInput);
  //         setHabitInput('');
  //       } else {
  //         console.error(validation); // eslint-disable-line no-console
  //       }
  //     }}
  //   >
  //     <input
  //       tabIndex={disableTabIndex ? -1 : undefined}
  //       ref={habitInputRef}
  //       type="text"
  //       placeholder="add habit"
  //       value={habitInput}
  //       onFocus={() => {
  //         // if shortcut is used, these states are already set
  //         if (selectedForm) return;
  //         setInInput(true);
  //         setSelectedIndex(habits.length);
  //       }}
  //       onBlur={() => {
  //         setHabitInput('');

  //         // if shortcut is used, these states are already set
  //         if (!selectedForm) return;
  //         setInInput(false);
  //         if (habits.length === 0) {
  //           setSelectedIndex(null);
  //         } else {
  //           setSelectedIndex(habits.length - 1);
  //         }
  //       }}
  //       onChange={(e) => setHabitInput(e.target.value)}
  //     />
  //   </form>
  // );
}
