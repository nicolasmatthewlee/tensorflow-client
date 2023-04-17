const CanvasBlock = ({
  filled,
  handleMouseEnter,
}: {
  filled: boolean;
  handleMouseEnter: React.MouseEventHandler<HTMLDivElement>;
}) => {
  const length = "10px";

  return (
    <div
      className={"" + (filled ? " bg-black" : "")}
      onMouseEnter={handleMouseEnter}
      style={{
        minWidth: length,
        minHeight: length,
        width: length,
        height: length,
      }}
    ></div>
  );
};

export default CanvasBlock;
