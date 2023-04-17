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
    window.addEventListener("keydown", handleMousedown);
    return () => window.removeEventListener("keydown", handleMousedown);
  }, []);

  useEffect(() => {
    window.addEventListener("keyup", handleMouseup);
    return () => window.removeEventListener("keyup", handleMouseup);
  }, []);

  return (
    <div className="p-[30px] flex flex-col space-y-[30px] items-center">
      <h1>hold d or k and drag to draw a number</h1>
      <Canvas mousedown={mousedown} />
    </div>
  );
};

export default App;
