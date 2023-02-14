type States = {
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function escapeCreateHabitInput(states: States) {
  const {
    setInInput,
  } = states;

  setInInput(false);
}
