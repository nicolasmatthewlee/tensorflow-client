import { useEffect, useState } from "react";
import Canvas from "./components/canvas";

const App = () => {
  const [mousedown, setMousedown] = useState<boolean>(false);

  const handleMousedown = () => {
    setMousedown(true);
  };
  const handleMouseup = () => {
    setMousedown(false);
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMousedown);
    return () => window.removeEventListener("mousedown", handleMousedown);
  }, []);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseup);
    return () => window.removeEventListener("mouseup", handleMouseup);
  }, []);

  return (
    <div className="p-[30px] flex flex-col space-y-[30px] items-center">
      <h1>click and drag to draw a number</h1>
      <Canvas mousedown={mousedown} />
    </div>
  );
};

export default App;
