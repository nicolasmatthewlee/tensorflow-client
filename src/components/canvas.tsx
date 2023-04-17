import { useState } from "react";
import CanvasBlock from "./canvas-block";

const Canvas = ({ mousedown }: { mousedown: boolean }) => {
  const n = 28;

  const [canvas, setCanvas] = useState<boolean[][]>(
    new Array(n).fill(new Array(n).fill(false))
  );

  const updateCanvas = (row: number, col: number, value = true) => {
    if (mousedown) {
      let nextCanvas = canvas.map((r) => r.slice());
      nextCanvas[row][col] = true;
      setCanvas(nextCanvas);
    }
  };

  return (
    <div className="border-[2px] border-black rounded">
      {canvas.map((r, row) => (
        <div className="flex" key={`row-${row}`}>
          {r.map((filled, col) => (
            <CanvasBlock
              handleMouseEnter={() => updateCanvas(row, col, true)}
              filled={filled}
              key={`block-${row}-${col}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Canvas;
