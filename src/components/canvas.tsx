import { useState } from "react";
import CanvasBlock from "./canvas-block";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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

  const eraseCanvas = () => {
    setCanvas(new Array(n).fill(new Array(n).fill(false)));
  };

  return (
    <div className="flex flex-col space-y-[10px]">
      <div className="border-[2px] border-gray-300 rounded">
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
      <div className="flex gap-x-[10px]">
        <button
          onClick={handleSubmit}
          className="flex-1 border-[2px] border-emerald-500 text-emerald-500 bg-emerald-50 px-[10px] py-[2px] font-bold rounded
            hover:bg-emerald-100"
        >
          submit
        </button>
        <button
          className="border-[2px] border-red-500 bg-red-50 px-[10px] py-[2px] font-bold rounded
            hover:bg-red-100"
          onClick={eraseCanvas}
        >
          <FontAwesomeIcon className="text-red-500" icon={faTrash} />
        </button>
      </div>
      {prediction && <h3>predicted value: {prediction}</h3>}
    </div>
  );
};

export default Canvas;
