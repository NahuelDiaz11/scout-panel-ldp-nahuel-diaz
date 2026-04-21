"use client";
import { useEffect, useRef } from "react";

const DEFAULT_W = 880;
const DEFAULT_H = 480;

export interface HeatmapFieldProps {
  grid: number[][] | null | undefined;
  width?: number;
  height?: number;
  className?: string;
}

function createColorMapPalette(): Uint8ClampedArray {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  
  const grad = ctx.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0.00, "rgba(0, 0, 0, 0)");     
  grad.addColorStop(0.25, "rgba(0, 0, 0, 0)");     
  grad.addColorStop(0.45, "rgba(0, 100, 0, 0.6)");   
  grad.addColorStop(0.65, "rgba(0, 224, 148, 0.9)"); 
  grad.addColorStop(0.85, "rgba(245, 166, 35, 1)");  
  grad.addColorStop(1.00, "rgba(232, 64, 64, 1)");   

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 1);
  return ctx.getImageData(0, 0, 256, 1).data;
}

export default function HeatmapField({
  grid,
  width = DEFAULT_W,
  height = DEFAULT_H,
  className = "",
}: HeatmapFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const W = width;
    const H = height;
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2);
    
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const PX = Math.round(W * 0.054);
    const PY = Math.round(H * 0.042);
    const FW = W - 2 * PX;
    const FH = H - 2 * PY;

    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#121212"; 
    ctx.fillRect(PX, PY, FW, FH);

    const STRIPE_COUNT = 10;
    for (let i = 0; i < STRIPE_COUNT; i++) {
      ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.03)";
      ctx.fillRect(PX + (i * FW) / STRIPE_COUNT, PY, FW / STRIPE_COUNT, FH);
    }

    if (grid && grid.length === 5 && grid[0]?.length === 5) {
      
      const off = document.createElement("canvas");
      off.width = W; 
      off.height = H;
      const oc = off.getContext("2d", { willReadFrequently: true })!;
      
      const cellW = FW / 5;
      const cellH = FH / 5;
      const blobR = Math.min(cellW, cellH) * 1.3; 

      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          const val = grid[row]?.[col] ?? 0;
          if (val < 2) continue;

          const pointsToGenerate = Math.round(val * 6); 

          for (let p = 0; p < pointsToGenerate; p++) {
            const cellCenterX = PX + (4 - row + 0.5) * cellW; 
            const cellCenterY = PY + (col + 0.5) * cellH;

            const rx = (Math.random() - 0.5) * cellW * 1.4; 
            const ry = (Math.random() - 0.5) * cellH * 1.4;
            const bx = cellCenterX + rx;
            const by = cellCenterY + ry;

            const finalR = blobR * (0.4 + Math.random() * 0.6);

            const g = oc.createRadialGradient(bx, by, 0, bx, by, finalR);
            
            g.addColorStop(0, `rgba(0, 0, 0, 0.02)`); 
            g.addColorStop(1, "rgba(0, 0, 0, 0)");

            oc.fillStyle = g;
            oc.beginPath();
            oc.arc(bx, by, finalR, 0, Math.PI * 2);
            oc.fill();
          }
        }
      }

      const imgData = oc.getImageData(0, 0, W, H);
      const pixels = imgData.data;
      const palette = createColorMapPalette();

      for (let i = 0; i < pixels.length; i += 4) {
        const alphaAccumulated = pixels[i + 3]; 
        const paletteOffset = alphaAccumulated * 4;

        pixels[i] = palette[paletteOffset];         // R
        pixels[i + 1] = palette[paletteOffset + 1]; // G
        pixels[i + 2] = palette[paletteOffset + 2]; // B
        pixels[i + 3] = palette[paletteOffset + 3]; // A
      }

      oc.putImageData(imgData, 0, 0);

      ctx.save();
      ctx.beginPath();
      ctx.rect(PX, PY, FW, FH); 
      ctx.clip();
      ctx.drawImage(off, 0, 0); 
      ctx.restore();
    }

    ctx.strokeStyle = "rgba(255,255,255,0.4)"; 
    ctx.lineWidth = Math.max(1, W / 420); 
    ctx.lineJoin = "round";

    ctx.strokeRect(PX, PY, FW, FH);

    ctx.beginPath();
    ctx.moveTo(PX + FW / 2, PY);
    ctx.lineTo(PX + FW / 2, PY + FH);
    ctx.stroke();

    const cr = Math.min(FW, FH) * 0.13;
    ctx.beginPath();
    ctx.arc(PX + FW / 2, PY + FH / 2, cr, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.arc(PX + FW / 2, PY + FH / 2, Math.max(2, W / 210), 0, Math.PI * 2);
    ctx.fill();

    const paW = FW * 0.15;
    const paH = FH * 0.44;
    ctx.strokeRect(PX, PY + (FH - paH) / 2, paW, paH);
    ctx.strokeRect(PX + FW - paW, PY + (FH - paH) / 2, paW, paH);

    const gaW = FW * 0.055;
    const gaH = FH * 0.22;
    ctx.strokeRect(PX, PY + (FH - gaH) / 2, gaW, gaH);
    ctx.strokeRect(PX + FW - gaW, PY + (FH - gaH) / 2, gaW, gaH);

    const goalH = FH * 0.125;
    const goalD = Math.max(6, W * 0.015);
    ctx.strokeRect(PX - goalD, PY + (FH - goalH) / 2, goalD, goalH);
    ctx.strokeRect(PX + FW, PY + (FH - goalH) / 2, goalD, goalH);

    for (const sx of [PX + paW * 0.68, PX + FW - paW * 0.68]) {
      ctx.beginPath();
      ctx.arc(sx, PY + FH / 2, Math.max(1.5, W / 280), 0, Math.PI * 2);
      ctx.fill();
    }

    const spotOffsetL = PX + paW * 0.68;
    const spotOffsetR = PX + FW - paW * 0.68;
    const dR = cr * 0.82;

    ctx.save();
    ctx.beginPath();
    ctx.rect(PX + paW, PY, FW, FH);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(spotOffsetL, PY + FH / 2, dR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.rect(PX, PY, FW - paW, FH); 
    ctx.clip();
    ctx.beginPath();
    ctx.arc(spotOffsetR, PY + FH / 2, dR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    const corrR = Math.max(5, W * 0.012);
    const corners: [number, number, number, number][] = [
      [PX, PY, 0, Math.PI / 2],
      [PX + FW, PY, Math.PI / 2, Math.PI],
      [PX + FW, PY + FH, Math.PI, (3 * Math.PI) / 2],
      [PX, PY + FH, (3 * Math.PI) / 2, 2 * Math.PI],
    ];
    for (const [cx, cy, sa, ea] of corners) {
      ctx.beginPath();
      ctx.arc(cx, cy, corrR, sa, ea);
      ctx.stroke();
    }
  }, [grid, width, height]);

  const hasGrid = grid && grid.length === 5 && (grid[0]?.length ?? 0) === 5;

  if (!hasGrid) {
    return (
      <div className={`rounded-xl border border-border/50 bg-[#121212] px-4 py-10 text-center ${className}`}>
        <p className="text-base text-muted">No tiene mapa de calor para esta temporada.</p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-border/60 bg-[#121212] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${className}`}>
      <div className="p-2 sm:p-4">
        <div className="mx-auto overflow-hidden rounded-lg shadow-[0_16px_48px_rgba(0,0,0,0.38)] ring-1 ring-black/45" style={{ maxWidth: width }}>
          <canvas ref={canvasRef} width={width} height={height} className="block h-auto w-full" />
        </div>
      </div>
    </div>
  );
}