import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';

function createArc(centerX: number, centerY: number, innerRadius: number, size: number, startAngle: number, endAngle: number) {
  const outerRadius = innerRadius + size;
  const borderThickness = 0.5;
  const calcX = (radius: number, angle: number) => centerX + radius * Math.cos(angle);
  const calcY = (radius: number, angle: number) => centerY + radius * Math.sin(angle);

  return new PIXI.Graphics()
    .lineStyle(borderThickness, 0x000000)
    .moveTo(calcX(innerRadius, startAngle), calcY(innerRadius, startAngle))
    .beginFill(0xFF0000)
    .lineTo(calcX(outerRadius, startAngle), calcY(outerRadius, startAngle))
    .arc(centerX, centerY, outerRadius, startAngle, endAngle)
    .lineTo(calcX(innerRadius, endAngle), calcY(innerRadius, endAngle))
    .arc(centerX, centerY, innerRadius, endAngle, startAngle, true)
    .endFill();
}

export default function PixiCanvas() {
  const divElement = useRef<HTMLDivElement>();
  useEffect(() => {
    if (divElement.current) {
      const pixiApp = new PIXI.Application({
        transparent: true,
        antialias: true,
        resizeTo: divElement.current,
        resolution: 2,
        autoDensity: true,
      });
      divElement.current.appendChild(pixiApp.view);

      const widths = [0.5, 0.5, 0.25, 0.75].map(value => Math.PI * value);
      const centerX = pixiApp.view.clientWidth / 2;
      const centerY = pixiApp.view.clientHeight / 2;

      const arcs: PIXI.Graphics[] = [];
      widths.reduce((startPos, width) => {
        arcs.push(createArc(centerX, centerY, 20, 20, startPos, startPos + width));

        return startPos + width;
      }, 0);

      arcs.forEach(arc => pixiApp.stage.addChild(arc));

      const widths2 = [0.2, 0.3, 0.1, 0.4, 0.2, 0.05, 0.5, 0.1, 0.15].map(value => Math.PI * value);

      const arcs2: PIXI.Graphics[] = [];
      widths2.reduce((startPos, width) => {
        arcs2.push(createArc(centerX, centerY, 40, 20, startPos, startPos + width));

        return startPos + width;
      }, 0);

      arcs2.forEach(arc => pixiApp.stage.addChild(arc));
    }
  });

  return <div style={{ width: 300, height: 300 }} ref={divElement as any} />;
}
