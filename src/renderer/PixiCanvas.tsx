import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { throttle } from 'throttle-debounce';

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
    let dX = 0;
    let dY = 0;
    let zoom = 1;

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
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        clearBeforeRender: true,
        powerPreference: 'low-power'
      });
      divElement.current.appendChild(newPixiApp.view);

      const render = throttle(1000 / 20, () => {
        newPixiApp.stage.setTransform(dX, dY, zoom, zoom);
      });

      newPixiApp.view.addEventListener('wheel', ev => {
        ev.preventDefault();

        if (ev.getModifierState('Meta')) {
          const previousZoom = zoom;
          zoom += ev.deltaY / 500;
          if (zoom < 0.1) {
            zoom = 0.1;
          }
          if (zoom > 4) {
            zoom = 4;
          }

          const ratio = zoom / previousZoom;
          const localPoint = newPixiApp.stage.localTransform.applyInverse(
            new PIXI.Point(ev.clientX, ev.clientY)
          );
          const mX = localPoint.x; // ev.clientX;
          const mY = localPoint.y; // ev.clientY;
          dX -= ratio * (ratio * mX - mX);
          dY -= ratio * (ratio * mY - mY);
        } else {
          dX -= ev.deltaX;
          dY -= ev.deltaY;
        }

        render();
      });

      setPixiApp(newPixiApp);
    }
  });

  return (
    <div style={{ width: '100%', height: '100%' }} ref={divElement as any} />
  );
}
