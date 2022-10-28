import React from 'react';
import Dates from './Dates';
import TransitionManager from './TransitionManager';

function App() {
  return (
    <TransitionManager
      dates={<Dates dates={[5, 6, 7, 8, 9, 10, 11]} />}
    />
  );
}

export default App;
