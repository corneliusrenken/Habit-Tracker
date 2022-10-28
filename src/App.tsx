import React from 'react';
import Dates from './Dates';
import Days from './Days';
import TransitionManager from './TransitionManager';

function App() {
  return (
    <TransitionManager
      dates={<Dates dates={[5, 6, 7, 8, 9, 10, 11]} todaysIndex={1} />}
      days={<Days />}
    />
  );
}

export default App;
