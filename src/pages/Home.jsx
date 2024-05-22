import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Home.module.scss";
import Header from "./components/Header";

function Home() {
  const [isFirstDropdownOpen, setIsFirstDropdownOpen] = useState(false);
  const [isSecondDropdownOpen, setIsSecondDropdownOpen] = useState(false);
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [randomNumber, setRandomNumber] = useState(null);
  const firstDropdownRef = useRef(null);
  const secondDropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      firstDropdownRef.current &&
      !firstDropdownRef.current.contains(event.target)
    ) {
      setIsFirstDropdownOpen(false);
    }
    if (
      secondDropdownRef.current &&
      !secondDropdownRef.current.contains(event.target)
    ) {
      setIsSecondDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGenerateRandomNumber = () => {
    const min = parseInt(minValue);
    const max = parseInt(maxValue);
    if (!isNaN(min) && !isNaN(max) && min <= max) {
      const random = Math.floor(Math.random() * (max - min + 1)) + min;
      setRandomNumber(random);
    } else {
      alert("Please enter valid min and max values.");
    }
  };

  return (
    <div>
      <div className={style.mainWrapper}>
        <Header />
        <div className={style.mainContainer}>
          <div className={style.header}>
            <p>Classic Random</p>
          </div>
          <div className={style.inputWrapper}>
            <div className={style.leftSide}>
              <p>min</p>
              <input
                type="text"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
              />
            </div>
            <div className={style.rightSide}>
              <p>max</p>
              <input
                type="text"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
              />
            </div>
          </div>
          <div className={style.btnContainer}>
            <div className={style.btnBG}>
              <button className={style.button} onClick={handleGenerateRandomNumber}>
                <div className={style.triangle}></div>
              </button>
            </div>
          </div>
          <div className={style.outputWrapper}>
            <div className={style.output}>
              {randomNumber !== null && <p>{randomNumber}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
