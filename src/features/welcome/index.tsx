import React from 'react'
import Keybind from '../settingsModal/Keybind';
import { View } from '../../globalTypes';

type Props = {
  hidden: boolean;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  view: View;
}

export default function Welcome({ hidden, setHidden, view }: Props) {
  return (
    <div className={`welcome ${hidden ? 'hidden' : ''}`}>
      <div className='heading'><b>Welcome to my Habit Tracker Demo!</b></div>
      <div>This app was designed with keyboard navigation in mind. Start exploring by pressing:</div>
      <div className='keybind-list'>
        <Keybind className='keybind' keydownCode='KeyT' />
        <div className='keybind-descriptor'>
          Today view
          {view.name === 'today' && <span className='current'> (active)</span>}
        </div>
        <Keybind className='keybind' keydownCode='KeyH' />
        <div className='keybind-descriptor'>
          History view
          {view.name === 'history' && <span className='current'> (active)</span>}
        </div>
        <Keybind className='keybind' keydownCode='KeyE' />
        <div className='keybind-descriptor'>
          Edit view
          {view.name === 'selection' && <span className='current'> (active)</span>}
        </div>
      </div>
      <div>For a full list of keyboard shortcuts, press the cog wheel in the bottom right corner</div>
      <a href="https://github.com/corneliusrenken/twice#readme">GitHub Repo</a>
    </div>
  )
}
