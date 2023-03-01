type States = {
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function escapeRenameHabitInput({
  setInInput,
}: States) {
  setInInput(false);
}
