type States = {
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function escapeRenameHabitInput(states: States) {
  const {
    setInInput,
  } = states;

  setInInput(false);
}
