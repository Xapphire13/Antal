import React, { useState, useEffect } from 'react';
import fs from 'fs';
import { promisify } from 'util';
import Text from './Text';
import { withStyles, WithStylesProps } from './themes/withStyles';
import Spacing from './Spacing';

const readDir = promisify(fs.readdir);

export type SideBarProps = {
  selectedDirPath: string;
} & WithStylesProps;

export function BareSideBar({
  selectedDirPath,
  css,
  styles,
  theme
}: SideBarProps) {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    async function readFilesInDirectory() {
      const dir = await readDir(selectedDirPath, { withFileTypes: true });
      setFiles(dir.filter(entry => entry.isFile()).map(file => file.name));
    }

    readFilesInDirectory();
  }, [selectedDirPath]);

  return (
    <div {...css(styles.sideBar)}>
      <Spacing horizontal={1} vertical={1}>
        {files.map((file, index) => (
          <Text key={+index} color={theme.color.white}>
            {file}
          </Text>
        ))}
      </Spacing>
    </div>
  );
}

export default withStyles(() => ({
  sideBar: {
    width: '100%',
    height: '100%',
    overflowY: 'scroll'
  }
}))(BareSideBar);
