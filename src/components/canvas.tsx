import { useState } from "react";
import CanvasBlock from "./canvas-block";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Canvas = ({ mousedown, save }: { mousedown: boolean; save: boolean }) => {
  const n = 28;
  const [response, setResponse] = useState<number | "loading" | null | "saved">(
    null
  );
  const [responseError, setResponseError] = useState<string | null>(null);

  const [canvas, setCanvas] = useState<boolean[][]>(
    new Array(n).fill(new Array(n).fill(false))
  );
  const [label, setLabel] = useState<number>(0);

  const updateCanvas = (row: number, col: number, value = true) => {
    if (mousedown) {
      let nextCanvas = canvas.map((r) => r.slice());
      nextCanvas[row][col] = true;
      if (row + 1 < n) nextCanvas[row + 1][col] = true;
      if (row - 1 >= 0) nextCanvas[row - 1][col] = true;
      if (col + 1 < n) nextCanvas[row][col + 1] = true;
      if (col - 1 >= 0) nextCanvas[row][col - 1] = true;
      setCanvas(nextCanvas);
      setResponse(null);
    }
  };

  const handleSubmit = () => {
    const getResponse = async () => {
      setResponseError(null);
      setResponse("loading");
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
        setResponse(responseJSON);
      } catch (e) {
        setResponseError("An unknown error occurred. Please try again.");
        setResponse(null);
      }
    };
    getResponse();
  };

  const handleSave = () => {
    const saveImage = async () => {
      setResponseError(null);
      setResponse("loading");
      try {
        const response = await fetch("http://127.0.0.1:5000/api/model/save", {
          method: "post",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ image: canvas, label: label }),
        });
        const responseJSON = await response.json();

        setResponse(responseJSON);
      } catch (e) {
        setResponseError("An unknown error occurred. Please try again.");
        setResponse(null);
      }
    };
    saveImage();
  };

  const eraseCanvas = () => {
    setCanvas(new Array(n).fill(new Array(n).fill(false)));
    setResponse(null);
  };

  return (
    <div className="flex flex-col space-y-[10px] items-center">
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
        {save && (
          <input
            className="w-[35px]"
            placeholder="0"
            type="number"
            min="0"
            max="9"
            onChange={(e) => setLabel(+e.target.value)}
          />
        )}
        {save ? (
          <button
            onClick={handleSave}
            className="flex-1 border-[2px] border-gray-500 text-gray-500 bg-gray-50 px-[10px] py-[2px] font-bold rounded
            hover:bg-gray-100"
          >
            {response === "loading" ? (
              <>
                <div
                  className="mr-[5px] inline-block h-[12px] w-[12px] animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                />
                loading...
              </>
            ) : (
              "save"
            )}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex-1 border-[2px] border-emerald-500 text-emerald-500 bg-emerald-50 px-[10px] py-[2px] font-bold rounded
            hover:bg-emerald-100"
          >
            {response === "loading" ? (
              <>
                <div
                  className="mr-[5px] inline-block h-[12px] w-[12px] animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                />
                loading...
              </>
            ) : (
              "submit"
            )}
          </button>
        )}

        <button
          className="border-[2px] border-red-500 bg-red-50 px-[10px] py-[2px] font-bold rounded
            hover:bg-red-100"
          onClick={eraseCanvas}
        >
          <FontAwesomeIcon className="text-red-500" icon={faTrash} />
        </button>
      </div>
      {response && response !== "loading" ? (
        response === "saved" ? (
          <h3>{response}!</h3>
        ) : (
          <h3>predicted value: {response}</h3>
        )
      ) : null}
      {responseError && <h3 className="text-red-500">{responseError}</h3>}
    </div>
  );
};

export default Canvas;
