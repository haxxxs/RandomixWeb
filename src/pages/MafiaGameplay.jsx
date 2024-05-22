import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import style from "./MafiaGameplay.module.scss";

function MafiaGameplay() {
  const [players, setPlayers] = useState([]);
  const [phase, setPhase] = useState("day");
  const [killedPlayerIndex, setKilledPlayerIndex] = useState(null);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(null);
  const [discussionTimer, setDiscussionTimer] = useState(60);
  const [isDiscussionStarted, setIsDiscussionStarted] = useState(false);
  const [isFirstKillDone, setIsFirstKillDone] = useState(false);
  const [nominatedPlayers, setNominatedPlayers] = useState([]);
  const [votes, setVotes] = useState([]);
  const [winner, setWinner] = useState(null); 

  const navigate = useNavigate(); 

  useEffect(() => {
    initializePlayers();
  }, []);

  useEffect(() => {
    let interval;
    if (phase === "discussion" && discussionTimer > 0) {
      interval = setInterval(() => {
        setDiscussionTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (phase === "discussion" && discussionTimer === 0) {
      handleNextSpeaker();
    }
    return () => clearInterval(interval);
  }, [phase, discussionTimer]);

  const initializePlayers = () => {
    const savedPlayers = JSON.parse(localStorage.getItem("playerNames")) || [];
    const savedRoles = JSON.parse(localStorage.getItem("roles")) || [];

    if (savedPlayers.length !== savedRoles.length) {
      console.error("Error: Number of roles does not match number of players");
      return;
    }

    const initialPlayers = savedPlayers.map((name, index) => ({
      name,
      alive: true,
      role: savedRoles[index], 
    }));

    setPlayers(initialPlayers);
    setVotes(new Array(savedPlayers.length).fill(0));
    console.log("Players initialized: ", initialPlayers); 
  };

  const handleKillPlayer = (index) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].alive = false;
    setPlayers(updatedPlayers);
    setPhase("day");
    setKilledPlayerIndex(index);
    setIsDiscussionStarted(false);
    setIsFirstKillDone(true);
    checkGameEnd(updatedPlayers);
  };

  const handleNightPhase = () => {
    if (players.some((player) => player.alive)) {
      setPhase("night");
      setKilledPlayerIndex(null);
      setIsDiscussionStarted(false);
    } else {
      setPhase("discussion");
      setCurrentSpeakerIndex(0);
      setDiscussionTimer(60);
      setIsDiscussionStarted(true);
    }
  };

  const handleDiscussion = () => {
    setPhase("discussion");
    setCurrentSpeakerIndex(getNextLivingPlayerIndex(-1));
    setDiscussionTimer(60); 
    setIsDiscussionStarted(true);
    setNominatedPlayers([]); 
  };

  const handleStartDiscussion = () => {
    handleDiscussion();
  };

  const handleNextSpeaker = () => {
    const nextIndex = getNextLivingPlayerIndex(currentSpeakerIndex);
    if (nextIndex !== null) {
      setCurrentSpeakerIndex(nextIndex);
      setDiscussionTimer(60); 
    } else {
      setPhase("voting");
    }
  };

  const handleNominatePlayer = (index) => {
    if (!nominatedPlayers.includes(index)) {
      setNominatedPlayers([...nominatedPlayers, index]);
    } else {
      setNominatedPlayers(nominatedPlayers.filter((i) => i !== index));
    }
  };

  const handleVoteChange = (index, value) => {
    const updatedVotes = [...votes];
    updatedVotes[index] = parseInt(value, 10);
    setVotes(updatedVotes);
  };

  const handleVotingEnd = () => {
    const maxVotes = Math.max(...votes);
    const playerToEliminate = votes.indexOf(maxVotes);

    const totalVotes = votes.reduce((acc, curr) => acc + curr, 0);

    if (playerToEliminate >= 0 && totalVotes > 0) {
      handleKillPlayer(playerToEliminate);
      checkGameEnd([...players]);
    }
    setPhase("day");
  };

  const getNextLivingPlayerIndex = (currentIndex) => {
    for (let i = currentIndex + 1; i < players.length; i++) {
      if (players[i].alive) {
        return i;
      }
    }
    return null;
  };

  const checkGameEnd = (updatedPlayers) => {
    const alivePlayers = updatedPlayers.filter((player) => player.alive);
    const mafias = alivePlayers.filter(
      (player) => player.role === "Мафия"
    ).length;
    const citizens = alivePlayers.filter(
      (player) => player.role === "Мирный житель"
    ).length;

    console.log("Alive players: ", alivePlayers);
    console.log("Number of mafias: ", mafias);
    console.log("Number of citizens: ", citizens);

    if (mafias === 0) {
      setWinner("Мирные жители победили!");
    } else if (mafias > citizens) {
      setWinner("Мафия победила!");
    } else if (citizens === mafias && phase === "voting") {
      setWinner("Мафия победила!");
    }
  };

  const renderPlayerList = () => {
    return players.map((player, index) => (
      <div className={style.playerCard} key={index}>
        <p className={!player.alive ? style.deadPlayer : ""}>
          {player.alive ? player.name : <s>{player.name}</s>}
        </p>
        {phase === "night" && player.alive && (
          <button
            className={style.killButton}
            onClick={() => handleKillPlayer(index)}
          >
            Убить
          </button>
        )}
        {phase === "discussion" && player.alive && (
          <label>
            <input
              type="checkbox"
              checked={nominatedPlayers.includes(index)}
              onChange={() => handleNominatePlayer(index)}
            />
            Выставить на голосование
          </label>
        )}
        {phase === "voting" && nominatedPlayers.includes(index) && (
          <label>
            Голоса:
            <input
              type="number"
              min="0"
              value={votes[index]}
              onChange={(e) => handleVoteChange(index, e.target.value)}
            />
          </label>
        )}
      </div>
    ));
  };

  if (winner) {
    return (
      <div className={style.winnerWrapper}>
        <div className={style.winnerContainer}>
          <p>{winner}</p>
          <button onClick={() => navigate("/")}>
            Перейти на главную страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={style.mainWrapper}>
      <div className={style.mainContainer}>
        <div className={style.phaseInfo}>
          <p>
            Фаза:{" "}
            {phase === "day"
              ? "День"
              : phase === "night"
              ? "Ночь"
              : phase === "discussion"
              ? "Обсуждение"
              : "Голосование"}
          </p>
          {phase === "day" && isFirstKillDone && !isDiscussionStarted && (
            <button className={style.descBtn} onClick={handleStartDiscussion}>
              Начать обсуждение
            </button>
          )}
          {phase === "day" && (
            <button className={style.sleepBtn} onClick={handleNightPhase}>
              Город засыпает
            </button>
          )}
        </div>
        <div className={style.playerList}>{renderPlayerList()}</div>
        {phase === "discussion" && (
          <div className={style.timer}>
            <p>Время на обсуждение: {discussionTimer} сек</p>
            <p>Сейчас говорит: {players[currentSpeakerIndex]?.name}</p>
            <button onClick={handleNextSpeaker}>Завершить речь</button>
          </div>
        )}
        {phase === "voting" && (
          <div>
            <button onClick={handleVotingEnd}>Завершить голосование</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MafiaGameplay;
