// need to disable strict mode in main index.tsx file to check this accurrately

const dependencyHistory: any = [];

// eslint-disable-next-line import/prefer-default-export
export function recordDependencies(dependenciesObject: any) {
  dependencyHistory.push(dependenciesObject);
  // this is mainly there to ensure you turned off strict mode and
  // are accurately comparing dependencies
  console.log(dependencyHistory.length);

  if (dependencyHistory.length > 1) {
    const prevDependencies = dependencyHistory[dependencyHistory.length - 2];
    const currentDependencies = dependencyHistory[dependencyHistory.length - 1];

    const keys = Object.keys(currentDependencies);

    const changedProperties: string[] = [];

    keys.forEach((key) => {
      const prevValue = prevDependencies[key];
      const currentValue = currentDependencies[key];
      if (prevValue !== currentValue) {
        changedProperties.push(key);
        // console.log(`value at ${key} changed from`, prevValue, 'to', currentValue);
      }
    });

    console.log('changed properties:', changedProperties);
  }
}
