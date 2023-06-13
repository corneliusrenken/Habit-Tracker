export default function overwriteMutuallyDefinedValues<S>(target: S, source: Partial<S>): S {
  const targetCopy = JSON.parse(JSON.stringify(target));

  let keys = Object.keys(source) as (keyof Partial<S>)[];
  keys = keys.filter((key) => source[key] !== undefined && Object.hasOwnProperty.call(target, key));
  keys.forEach((key) => {
    targetCopy[key] = source[key];
  });

  return targetCopy;
}
