type NonUnderscored<T> = {
  [K in keyof T as string extends K ? never : K extends `_${string}` ? never : K]: T[K];
};

export default NonUnderscored;
