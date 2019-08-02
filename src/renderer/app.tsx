import React, { useState } from 'react';
import { ipcRenderer } from 'electron'; // eslint-disable-line
import * as PIXI from 'pixi.js';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import PixiCanvas, { OnStageReadyParams } from './pixi-canvas';
import { KondoDirectory, KondoType } from '../test';

const readFile = promisify(fs.readFile);
const readDir = promisify(fs.readdir);
const MIN_WIDTH = Math.PI / 180;
const generateNew = true;

function getColor(type: KondoType) {
  switch (type) {
    case KondoType.Audio:
      return 0xff0000;
    case KondoType.Document:
      return 0x00ff00;
    case KondoType.Image:
      return 0x0000ff;
    case KondoType.SourceCode:
      return 0x0ff000;
    case KondoType.Video:
      return 0x000ff0;
    case KondoType.ApplicationFile:
      return 0xf0f000;
    case KondoType.Archive:
      return 0x00f0f0;
    case KondoType.Other:
    default:
      return 0x777777;
  }
}

export default function App() {
  const [selectedDir, setSelectedDir] = useState<KondoDirectory>();
  const [selectedDirPath, setSelectedDirPath] = useState<string>('/');

  const onStageReady = (params: OnStageReadyParams) =>
    onRender({
      ...params,
      selectedDir,
      setSelectedDir,
      selectedDirPath,
      setSelectedDirPath
    });

  return (
    <div style={{ background: '#21252B', width: '100%', height: '100%' }}>
      <PixiCanvas onStageReady={onStageReady} />
    </div>
  );
}

async function onRender({
  height,
  stage,
  width,
  selectedDir,
  setSelectedDir,
  selectedDirPath,
  setSelectedDirPath
}: OnStageReadyParams & {
  selectedDir?: KondoDirectory;
  setSelectedDir: (dir: KondoDirectory) => void;
  selectedDirPath: string;
  setSelectedDirPath: (path: string) => void;
}) {
  if (!selectedDir) {
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
  } else {
    const centerX = width / 2;
    const centerY = height / 2;

    renderDirectory({
      centerX,
      centerY,
      directory: selectedDir,
      minAngle: 0,
      maxAngle: 2 * Math.PI,
      shellNumber: 1,
      stage,
      dirPath: selectedDirPath,
      onSelect: (dir, dirPath) => {
        setSelectedDir(dir);
        setSelectedDirPath(dirPath);
      }
    });
  }
}

function renderDirectory({
  directory,
  centerX,
  centerY,
  minAngle,
  maxAngle,
  shellNumber,
  stage,
  dirPath,
  onSelect
}: {
  directory: KondoDirectory;
  centerX: number;
  centerY: number;
  minAngle: number;
  maxAngle: number;
  shellNumber: number;
  stage: PIXI.Container;
  dirPath: string;
  onSelect: (dir: KondoDirectory, dirPath: string) => void;
}) {
  let startAngle = minAngle;
  const angleWidth = maxAngle - minAngle;
  let smallFilesSize = 0;

  // Render directories
  for (const childDir of directory.children) {
    if (childDir.size === 0) continue;

    const percentage = childDir.size / directory.size;
    const endAngle = startAngle + angleWidth * percentage;
    const childWidth = endAngle - startAngle;

    if (childWidth >= MIN_WIDTH) {
      const arc = createArc({
        centerX,
        centerY,
        innerRadius: 10 + shellNumber * 25,
        size: 25,
        startAngle,
        endAngle,
        color: getColor(childDir.type)
      });

      arc.interactive = true;
      arc.addListener('pointerover', async () => {
        console.log(childDir);
        console.log(
          (await readDir(path.join(dirPath, childDir.path), {
            withFileTypes: true
          }))
            .filter(dirEnt => dirEnt.isFile())
            .map(dirEnt => dirEnt.name)
        );
      });
      arc.addListener('pointertap', () =>
        onSelect(childDir, path.join(dirPath, childDir.path))
      );
      stage.addChild(arc);

      renderDirectory({
        centerX,
        centerY,
        directory: childDir,
        minAngle: startAngle,
        maxAngle: endAngle,
        shellNumber: shellNumber + 1,
        stage,
        dirPath: path.join(dirPath, childDir.path),
        onSelect
      });

      startAngle = endAngle;
    } else {
      smallFilesSize += childDir.size;
    }
  }

  // Render other files
  Object.keys(KondoType)
    // eslint-disable-next-line no-restricted-globals
    .filter((key: any) => !isNaN(key))
    .map(Number)
    .forEach((type: KondoType) => {
      const filesPercentage =
        directory.childrenFileSizes[type] / directory.size;
      const filesEndAngle = startAngle + angleWidth * filesPercentage;
      const filesArc = createArc({
        centerX,
        centerY,
        innerRadius: 10 + shellNumber * 25,
        size: 5,
        startAngle,
        endAngle: filesEndAngle,
        color: getColor(type)
      });

      stage.addChild(filesArc);
      startAngle = filesEndAngle;
    });

  // Render small files
  const smallFilesPercentage = smallFilesSize / directory.size;
  const smallFilesEndAngle = startAngle + angleWidth * smallFilesPercentage;
  const smallFilesArc = createArc({
    centerX,
    centerY,
    innerRadius: 10 + shellNumber * 25,
    size: 5,
    startAngle,
    endAngle: smallFilesEndAngle,
    color: 0x444444
  });

  stage.addChild(smallFilesArc);
}

function createArc({
  centerX,
  centerY,
  innerRadius,
  size,
  startAngle,
  endAngle,
  color
}: {
  centerX: number;
  centerY: number;
  innerRadius: number;
  size: number;
  startAngle: number;
  endAngle: number;
  color: number;
}) {
  const outerRadius = innerRadius + size;
  const borderThickness = 0.5;
  const calcX = (radius: number, angle: number) =>
    centerX + radius * Math.cos(angle);
  const calcY = (radius: number, angle: number) =>
    centerY + radius * Math.sin(angle);

  return new PIXI.Graphics()
    .lineStyle(borderThickness, 0x000000)
    .moveTo(calcX(innerRadius, startAngle), calcY(innerRadius, startAngle))
    .beginFill(color)
    .lineTo(calcX(outerRadius, startAngle), calcY(outerRadius, startAngle))
    .arc(centerX, centerY, outerRadius, startAngle, endAngle)
    .lineTo(calcX(innerRadius, endAngle), calcY(innerRadius, endAngle))
    .arc(centerX, centerY, innerRadius, endAngle, startAngle, true)
    .endFill();
}
