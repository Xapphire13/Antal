import React from 'react';
import { ipcRenderer } from 'electron'; // eslint-disable-line
import * as PIXI from 'pixi.js';
import fs from 'fs';
import { promisify } from 'util';
import PixiCanvas, { OnStageReadyParams } from './pixi-canvas';
import { KondoDirectory } from '../test';

const readFile = promisify(fs.readFile);
const MIN_WIDTH = Math.PI / 180;

export default function App() {
  return (
    <div style={{ background: '#21252B', width: '100%', height: '100%' }}>
      <PixiCanvas onStageReady={onStageReady} />
    </div>
  );
}

async function onStageReady({ height, stage, width }: OnStageReadyParams) {
  let cachedPath =
    '/private/var/folders/40/ypqwl1k15k9_bt895bsdb6200000gn/T/16e7d10901581825e225b20726a96226.';

  if (!cachedPath) {
    const scanResultsPath = new Promise<string>(res => {
      ipcRenderer.once('scan-complete', (_ev: any, args: any) => res(args));
    });
    ipcRenderer.send('scan-disk');

    cachedPath = await scanResultsPath;
  }

  const rootDirectory: KondoDirectory = JSON.parse(
    await readFile(cachedPath, { encoding: 'utf8' })
  );

  const centerX = width / 2;
  const centerY = height / 2;

  renderDirectory({
    centerX,
    centerY,
    directory: rootDirectory,
    minAngle: 0,
    maxAngle: 2 * Math.PI,
    shellNumber: 1,
    stage
  });
}

function renderDirectory({
  directory,
  centerX,
  centerY,
  minAngle,
  maxAngle,
  shellNumber,
  stage
}: {
  directory: KondoDirectory;
  centerX: number;
  centerY: number;
  minAngle: number;
  maxAngle: number;
  shellNumber: number;
  stage: PIXI.Container;
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
        innerRadius: shellNumber * 20,
        size: 20,
        startAngle,
        endAngle,
        color: 0xff1111
      });

      stage.addChild(arc);

      renderDirectory({
        centerX,
        centerY,
        directory: childDir,
        minAngle: startAngle,
        maxAngle: endAngle,
        shellNumber: shellNumber + 1,
        stage
      });

      startAngle = endAngle;
    } else {
      smallFilesSize += childDir.size;
    }
  }

  // Render other files
  const otherFilesPercentage =
    directory.childrenFileSizes.other / directory.size;
  const otherFilesEndAngle = startAngle + angleWidth * otherFilesPercentage;
  const otherFilesArc = createArc({
    centerX,
    centerY,
    innerRadius: shellNumber * 20,
    size: 20,
    startAngle,
    endAngle: otherFilesEndAngle,
    color: 0x999999
  });

  stage.addChild(otherFilesArc);
  startAngle = otherFilesEndAngle;

  // Render small files
  const smallFilesPercentage = smallFilesSize / directory.size;
  const smallFilesEndAngle = startAngle + angleWidth * smallFilesPercentage;
  const smallFilesArc = createArc({
    centerX,
    centerY,
    innerRadius: shellNumber * 20,
    size: 20,
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
