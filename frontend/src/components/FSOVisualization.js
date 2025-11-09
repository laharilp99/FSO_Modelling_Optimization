import React, { useEffect, useRef } from 'react';

const FSOVisualization = ({ guppyPositions, effectiveStress, foodSource, simulationMetrics }) => {
  const canvasRef = useRef(null);
  const width = 800, height = 600;

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(34,197,94,0.4)';
    ctx.beginPath();
    ctx.arc(foodSource.x, foodSource.y, 40, 0, 2 * Math.PI);
    ctx.fill();

    guppyPositions.forEach((g) => {
      const r = Math.round(effectiveStress * 255);
      const b = Math.round((1 - effectiveStress) * 255);
      ctx.fillStyle = `rgb(${r},100,${b})`;
      ctx.beginPath();
      ctx.arc(g.x, g.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [guppyPositions, effectiveStress, foodSource, simulationMetrics]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full lg:h-[600px] h-[300px] rounded-lg shadow-xl border border-slate-700"
    />
  );
};

export default FSOVisualization;
