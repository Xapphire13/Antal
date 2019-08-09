import React, { useState, useEffect } from 'react';
import path from 'path';
import { ipcRenderer } from 'electron'; // eslint-disable-line
import fs from 'fs';
import { promisify } from 'util';
import { KondoDirectory } from '../test';
import FolderVisualization from './FolderVisualization';
import Breadcrumbs from './Breadcrumbs';
import { withStyles, WithStylesProps } from './themes/withStyles';
import SideBar from './SideBar';
import WindowControls from './WindowControls';
import Spacing from './Spacing';

const readFile = promisify(fs.readFile);
const generateNew = false;

type AppProps = WithStylesProps;

export function BareApp({ css, styles }: AppProps) {
  const [selectedDir, setSelectedDir] = useState<KondoDirectory>();
  const [dirPath, setDirPath] = useState<string>('/');

  const onDirectorySelected = (newDir: KondoDirectory, newDirPath: string) => {
    setSelectedDir(newDir);
    setDirPath(newDirPath);
  };

  useEffect(() => {
    async function LoadScanResults() {
      let cachedPath = path.join(process.env.HOME || '', 'kondo-backup');

      if (generateNew || !cachedPath) {
        const scanResultsPath = new Promise<string>(res => {
          ipcRenderer.once('scan-complete', (_ev: any, args: any) => res(args));
        });
        ipcRenderer.send('scan-disk');

        cachedPath = await scanResultsPath;
      }

      const rootDirectory: KondoDirectory = JSON.parse(
        await readFile(cachedPath, { encoding: 'utf8' })
      );

      setSelectedDir(rootDirectory);
    }

    if (!selectedDir) {
      LoadScanResults();
    }
  });

  return (
    <div {...css(styles.app)}>
      <div {...css(styles.windowControls)}>
        <WindowControls />
      </div>
      <div {...css(styles.breadcrumbs)}>
        <Spacing vertical={1}>
          <Breadcrumbs path={dirPath} onSelect={setDirPath} />
        </Spacing>
      </div>
      {selectedDir && (
        <FolderVisualization
          directory={selectedDir}
          onDirectorySelected={onDirectorySelected}
          dirPath={dirPath}
        />
      )}
      <div {...css(styles.sideBar)}>
        <SideBar selectedDirPath={dirPath} />
      </div>
    </div>
  );
}

export default withStyles(({ color }) => ({
  app: {
    background: color.darkGray,
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  breadcrumbs: {
    position: 'absolute',
    display: 'inline-block',
    width: 'calc(100% - 150px)'
  },
  sideBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: 150,
    background: color.darkGray
  },
  windowControls: {
    display: 'inline-block',
    height: 44,
    paddingTop: 12
  }
}))(BareApp);
