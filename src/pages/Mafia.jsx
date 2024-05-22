import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import style from "./Mafia.module.scss";
import { useNavigate } from "react-router";
import Header from "./components/Header";

function Mafia() {
  const [playerCount, setPlayerCount] = useState(0);
  const [rolesCount, setRolesCount] = useState({
    mafia: 0,
    civilian: 0,
    doctor: 0,
    sheriff: 0,
    prostitute: 0,
    maniac: 0,
    godfather: 0,
  });
  const [playerNames, setPlayerNames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const generateRoles = () => {
    const { mafia, civilian, doctor, sheriff, prostitute, maniac, godfather } =
      rolesCount;
    let roleArray = [];
    for (let i = 0; i < mafia; i++) roleArray.push("Мафия");
    for (let i = 0; i < civilian; i++) roleArray.push("Мирный житель");
    for (let i = 0; i < doctor; i++) roleArray.push("Доктор");
    for (let i = 0; i < sheriff; i++) roleArray.push("Шериф");
    for (let i = 0; i < prostitute; i++) roleArray.push("Путана");
    for (let i = 0; i < maniac; i++) roleArray.push("Маньяк");
    for (let i = 0; i < godfather; i++) roleArray.push("Дон мафии");
    return roleArray;
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleGenerateRoles = () => {
    if (playerCount <= 0) {
      alert("Количество игроков должно быть больше 0");
      return;
    }
    const roles = generateRoles();
    if (roles.length !== playerCount) {
      alert("Количество ролей должно быть равно количеству игроков");
      return;
    }
    const shuffledRoles = shuffleArray(roles);
    localStorage.setItem("roles", JSON.stringify(shuffledRoles));
    localStorage.setItem("playerNames", JSON.stringify(playerNames));
    navigate("/mafiaGame");
  };

  const handlePlayerCountChange = (count) => {
    setPlayerCount(count);
    setPlayerNames(Array(count).fill(""));
    setRolesCount({ ...rolesCount, civilian: count - rolesCount.mafia });
  };

  const handleMafiaCountChange = (count) => {
    setRolesCount({
      ...rolesCount,
      mafia: count,
      civilian: playerCount - count,
    });
  };

  const handleRolesCountChange = (event, role) => {
    setRolesCount({ ...rolesCount, [role]: parseInt(event.target.value) });
  };

  const handlePlayerNameChange = (event, index) => {
    const newNames = [...playerNames];
    newNames[index] = event.target.value;
    setPlayerNames(newNames);
  };

  const handleSwipe = (direction) => {
    if (direction === "left" && currentIndex < playerCount - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "right" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className={style.mainWrapper}>
      <Header />
      <div className={style.mainContainer}>
        <div className={style.header}>
          <p>Игра "Мафия"</p>
        </div>
        <div className={style.inputWrapper}>
          <p>Количество игроков</p>
          <div className={style.playerCountSelector}>
            {[...Array(12).keys()].map((i) => (
              <button
                key={i + 1}
                className={`${style.selectorButton} ${
                  playerCount === i + 1 ? style.selected : ""
                }`}
                onClick={() => handlePlayerCountChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className={style.mafiaCountSelector}>
            <p>Количество мафии:</p>

            {[...Array(Math.floor(playerCount/3)).keys()].map((i) => (
              <button
                key={i + 1}
                className={`${style.selectorButton} ${
                  rolesCount.mafia === i + 1 ? style.selected : ""
                }`}
                onClick={() => handleMafiaCountChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <div className={style.civilianCount}>
              <p>Мирные жители: {rolesCount.civilian}</p>
            </div>
          </div>

          <div {...swipeHandlers} className={style.swipeContainer}>
            <div className={style.playerNameInputWrapper}>
              <p>{`Игрок ${currentIndex + 1}:`}</p>
              <input
                type="text"
                value={playerNames[currentIndex] || ""}
                onChange={(e) => handlePlayerNameChange(e, currentIndex)}
                placeholder="Введите имя"
              />
            </div>
          </div>
        </div>
        <div className={style.btnContainer}>
          <div className={style.btnBG}>
            <button className={style.button} onClick={handleGenerateRoles}>
              {/* <div className={style.triangle}></div> */}
              Начать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mafia;