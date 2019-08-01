import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';

export type OnStageReadyParams = {
  stage: PIXI.Container;
  width: number;
  height: number;
};

export type PixiCanvasProps = {
  onStageReady: (params: OnStageReadyParams) => void;
};

export default function PixiCanvas({ onStageReady }: PixiCanvasProps) {
  const divElement = useRef<HTMLDivElement>();
  useEffect(() => {
    if (divElement.current) {
      const pixiApp = new PIXI.Application({
        transparent: true,
        antialias: true,
        resizeTo: divElement.current,
        resolution: 2,
        autoDensity: true
      });
      divElement.current.appendChild(pixiApp.view);

      onStageReady({
        stage: pixiApp.stage,
        height: pixiApp.view.clientHeight,
        width: pixiApp.view.clientWidth
      });
    }
  });

  return (
    <div style={{ width: '100%', height: '100%' }} ref={divElement as any} />
  );
}
