import React, { useState } from "react";
import Header from "./components/Header";
import style from "./Stack.module.scss";

function Stack() {
  const [blocks, setBlocks] = useState([]);

  const generateRandomNumber = () => {
    const min = parseInt(document.getElementById("min").value);
    const max = parseInt(document.getElementById("max").value);

    if (isNaN(min) || isNaN(max) || min >= max) {
      alert("Please enter valid min and max values.");
      return;
    }

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    setBlocks((prevBlocks) => [...prevBlocks, randomNumber]);
  };

  return (
    <div>
      <div className={style.mainWrapper}>
        <Header />
        <div className={style.mainContainer}>
          <div className={style.header}>
            <p>Stack Random</p>
          </div>
          <div className={style.inputWrapper}>
            <div className={style.leftSide}>
              <p>min</p>
              <input id="min" type="text" />
            </div>
            <div className={style.rightSide}>
              <p>max</p>
              <input id="max" type="text" />
            </div>
          </div>
          <div className={style.btnContainer}>
            <div className={style.btnBG}>
              <button className={style.button} onClick={generateRandomNumber}>
                <div className={style.triangle}></div>
              </button>
            </div>
          </div>
          <div className={style.outputWrapper}>
            <div className={style.output}>
              {blocks.map((number, index) => (
                <div key={index} className={style.block}>
                  {number}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stack;
