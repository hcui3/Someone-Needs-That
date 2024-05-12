/* eslint-disable react/prop-types */

const Star = ({ top, left, duration, delay }) => (
  <div
    className="absolute w-[2px] h-[2px] rounded-[5px]"
    style={{
      animation: `twinkle ${duration}s linear ${delay}s infinite`,
      top: `${top}px`,
      left: `${left}px`,
    }}
  ></div>
);

export default Star;
