export default class PseudoUseState<T> {
  value: T;

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  setState(newValue: T | ((prev: T) => T)) {
    if (newValue instanceof Function) {
      this.value = newValue(this.value);
    } else {
      this.value = newValue;
    }
  }
}
