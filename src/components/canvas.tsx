import { useState } from "react";
import CanvasBlock from "./canvas-block";

const Canvas = ({ mousedown }: { mousedown: boolean }) => {
  const n = 28;
  const [prediction, setPrediction] = useState<number | null>(null);

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

  const handleSubmit = () => {
    const getPrediction = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/model/predict",
          {
            method: "post",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(canvas),
          }
        );
        const responseJSON = await response.json();
        setPrediction(responseJSON);
      } catch (e) {
        console.log(e);
      }
    };
    getPrediction();
  };

  return (
    <div className="flex flex-col space-y-[10px]">
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
      <button
        onClick={handleSubmit}
        className="border-[2px] border-black px-[10px] py-[2px] font-bold rounded
        hover:bg-gray-100"
      >
        send
      </button>
      {prediction && <h3>predicted value: {prediction}</h3>}
    </div>
  );
};

export default Canvas;
