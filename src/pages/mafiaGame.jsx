import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./MafiaGame.module.scss";
import Header from "./components/Header";

function MafiaGame() {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const roles = JSON.parse(localStorage.getItem("roles")) || [];
  const playerNames = JSON.parse(localStorage.getItem("playerNames")) || [];
  const navigate = useNavigate();

  const handleNextPlayer = () => {
    if (currentPlayer < roles.length - 1) {
      setShowRole(false);
      setCurrentPlayer(currentPlayer + 1);
    } else {
      navigate("/mafiaGameplayPage"); 
    }
  };

  const revealRole = () => {
    setShowRole(true);
  };

  return (
    <div className={style.mainWrapper}>
      <div className={style.mainContainer}>
        <div className={style.roleCard}>
          <p>{`Игрок ${playerNames[currentPlayer]}, нажмите чтобы узнать свою роль`}</p>
          {showRole ? (
            <div>
              <p>{roles[currentPlayer]}</p>
              <button onClick={handleNextPlayer}>
                {currentPlayer < roles.length - 1
                  ? "Нажмите чтобы передать право следующему игроку"
                  : "Перейти на страницу с игрой"}
              </button>
            </div>
          ) : (
            <button onClick={revealRole}>Нажмите чтобы узнать свою роль</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MafiaGame;
