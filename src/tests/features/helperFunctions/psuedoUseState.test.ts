import PseudoUseState from './pseudoUseState';

test('the setState function accepts a value of the same type as the initial state value, and updates the state inside the array', () => {
  const initialState = 'hello';
  const state = new PseudoUseState(initialState);
  expect(state.value).toBe(initialState);
  state.setState('new value');
  expect(state.value).toBe('new value');
  state.setState('another new value');
  expect(state.value).toBe('another new value');
});

test('the setState function accepts a function, to which it passes the previous state as the first argument, and updates the state value based on the passed function', () => {
  const initialState = 'hello';
  const state = new PseudoUseState(initialState);
  expect(state.value).toBe(initialState);
  state.setState((prev) => `${prev} world`);
  expect(state.value).toBe('hello world');
  state.setState((prev) => `${prev} again!`);
  expect(state.value).toBe('hello world again!');
});
