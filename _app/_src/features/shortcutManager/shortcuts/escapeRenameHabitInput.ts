import scrollSelectedIndexIntoView from '../helpers/scrollSelectedIndexIntoView';

type States = {
  selectedIndex: number | null;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function escapeRenameHabitInput({
  selectedIndex,
  setInInput,
}: States) {
  setInInput(false);
  if (selectedIndex !== null) scrollSelectedIndexIntoView(selectedIndex, { behavior: 'instant' });
}
