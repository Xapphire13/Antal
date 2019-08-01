import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron'; // eslint-disable-line
import PixiCanvas from './pixi-canvas';

export default function App() {
  useEffect(() => {
    const scanResults = new Promise(res => {
      ipcRenderer.once('scan-complete', (_ev: any, args: any) => res(args));
    });
    ipcRenderer.send('scan-disk');
    scanResults.then(console.log);
  });

  return (
    <div>
      <PixiCanvas />
    </div>
  );
}
