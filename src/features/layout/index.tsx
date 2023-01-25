import React from 'react';
import { View } from '../../globalTypes';
import './layout.css';

type Props = {
  options: {
    marginHeight: string;
    maxBodyHeight: string;
  }
  view: View;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Layout({ options, view }: Props) {
  return (
    <div className="layout-container">
      <div
        style={{
          backgroundColor: 'lime',
          width: '350px',
          height: '500px',
        }}
      >
        Occurrences
      </div>
      <div
        style={{
          backgroundColor: 'yellow',
          width: '350px',
          height: '50px',
        }}
      >
        Days
      </div>
      <div
        style={{
          backgroundColor: 'aqua',
          width: '350px',
          height: '50px',
        }}
      >
        Dates
      </div>
      <div
        style={{
          backgroundColor: 'red',
          width: '350px',
          height: '200px',
        }}
      >
        Habits
      </div>
    </div>
  );
}
