type MutuallyExclusiveUnion<Obj extends object> = {
  [SelectedKey in keyof Obj]: { [Key in SelectedKey]: Obj[Key] } &
  { [OtherKeys in keyof Omit<Obj, SelectedKey>]?: undefined };
}[keyof Obj];

export default MutuallyExclusiveUnion;
