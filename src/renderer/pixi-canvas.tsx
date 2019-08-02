import React, { useRef, useEffect, useState } from 'react';
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
  const [pixiApp, setPixiApp] = useState<PIXI.Application>();
  const divElement = useRef<HTMLDivElement>();
  useEffect(() => {
    if (pixiApp) {
      pixiApp.stage.removeChildren();
      onStageReady({
        stage: pixiApp.stage,
        height: pixiApp.view.clientHeight,
        width: pixiApp.view.clientWidth
      });
    } else if (divElement.current) {
      const newPixiApp = new PIXI.Application({
        transparent: true,
        antialias: true,
        resizeTo: divElement.current,
        resolution: 2,
        autoDensity: true,
        clearBeforeRender: true
      });
      divElement.current.appendChild(newPixiApp.view);

      setPixiApp(newPixiApp);
    }
  });

  return (
    <div style={{ width: '100%', height: '100%' }} ref={divElement as any} />
  );
}
