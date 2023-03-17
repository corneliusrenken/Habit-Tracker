import overwriteMutuallyDefinedValues from '../../../features/common/overwriteMutuallyDefinedValues';

test('defined values from the source are overwritten on the target', () => {
  const target = { a: 1, b: 2, c: 3 };
  const source = { a: 4, b: 5 };

  const newTarget = overwriteMutuallyDefinedValues(target, source);

  expect(newTarget).toEqual({ a: 4, b: 5, c: 3 });
});

test('if the source contains undefined as a value, the target is not overwritten at that property', () => {
  const target = { a: 1, b: 2, c: 3 };
  const source = { a: 4, b: undefined };

  const newTarget = overwriteMutuallyDefinedValues(target, source);

  expect(newTarget).toEqual({ a: 4, b: 2, c: 3 });
});

test('if the source contains a property that is not on the target, the target doesn\'t obtain a value at that property', () => {
  const target = { a: 1, b: 2, c: 3 };
  const source = { a: 4, b: 5, d: 6 };

  const newTarget = overwriteMutuallyDefinedValues(target, source);

  expect(newTarget).toEqual({ a: 4, b: 5, c: 3 });
});

test('if the target contains a property with undefined as it\'s value, the source can override it', () => {
  const target: { a: number, b: number | undefined, c: number } = { a: 1, b: undefined, c: 3 };
  const source = { a: 4, b: 5 };

  const newTarget = overwriteMutuallyDefinedValues(target, source);

  expect(newTarget).toEqual({ a: 4, b: 5, c: 3 });
});
