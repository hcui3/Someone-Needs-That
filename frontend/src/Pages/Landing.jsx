/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Star from "../Components/Star";

const Landing = () => {
  const isLoggedIn = localStorage.getItem("auth-token");
  const ref = useRef(null);
  const [stars, setStars] = useState([]);
  const numStars = 160;

  const generateStars = () => {
    const starsArray = [];
    if (ref.current) {
      const containerHeight = ref.current.clientHeight;
      const containerWidth = ref.current.clientWidth;
      for (let i = 0; i < numStars; i++) {
        const top = Math.random() * containerHeight - 300;
        const left = Math.random() * containerWidth;
        const duration = Math.random() * 5 + 5;
        const delay = Math.random() * 1 + 1;
        starsArray.push(<Star key={i} top={top} left={left} duration={duration} delay={delay} />);
      }
    }
    return starsArray;
  };

  useEffect(() => {
    const handleResize = () => {
      setStars(generateStars());
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <main
        ref={ref}
        className="homescreen m-0 flex flex-col w-screen justify-center bg-gray-800 h-screen text-gray-100 font-abhaya-libre overflow-hidden"
      >
        <div className="container mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center relative z-10">
          <div className="sm:w-1/2 xl:w-3/6 flex flex-col items-start py-24 sm:py-0 ml-16">
            <h1 className="text-8xl xl:text-10xl font-abhaya-libre text-green-500 font-bold leading-none tracking-wider">Snt</h1>
            <h2 className="text-xl xl:text-4xl font-abhaya-libre text-green-500 uppercase font-semibold leading-none -mt-2 mb-6 tracking-tighter">
              Someone Needs That
            </h2>
            <p className="xl:text-xl tracking-wider text-gray-100 font-abhaya-libre">
              Snt is a straightforward marketplace for buying and selling used items. Join us in making sustainable living effortless and accessible.
            </p>
            <Link to={isLoggedIn ? "/all" : "/login"}>
              <button className="font-fira-sans font-medium text-white sm:font-xl uppercase py-2 px-5 sm:py-3 sm:px-6 rounded-lg shadow-lg bg-green-900 hover:bg-green-800 mt-8 sm:mt-16">
                Go Shopping
              </button>
            </Link>
          </div>
          {stars}
        </div>
      </main>
    </>
  );
};

export default Landing;
