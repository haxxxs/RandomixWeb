import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Header.module.scss";

function Header() {
  const [isFirstDropdownOpen, setIsFirstDropdownOpen] = useState(false);
  const [isSecondDropdownOpen, setIsSecondDropdownOpen] = useState(false);
  const firstDropdownRef = useRef(null);
  const secondDropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleFirstDropdown = () => {
    setIsFirstDropdownOpen(!isFirstDropdownOpen);
    setIsSecondDropdownOpen(false);
  };

  const toggleSecondDropdown = () => {
    setIsSecondDropdownOpen(!isSecondDropdownOpen);
    setIsFirstDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (
      firstDropdownRef.current && !firstDropdownRef.current.contains(event.target)
    ) {
      setIsFirstDropdownOpen(false);
    }
    if (
      secondDropdownRef.current && !secondDropdownRef.current.contains(event.target)
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

  const navigateToStack = () => {
    navigate("/stack");
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const navigateToMafia = () => {
    navigate("/mafia")
  }

  return (
    <header>
      <div className={style.logoWrapper}>
        <img src="/imgs/logo.png" alt="logo" />
      </div>
      <div className={style.headerContentWrapper}>
        <div ref={firstDropdownRef}>
          <div className={style.headerToggle} onClick={toggleFirstDropdown}>
            Menu
          </div>
          <div
            className={`${style.headerContent} ${
              isFirstDropdownOpen ? style.show : ""
            }`}
          >
            <div className={style.classicRand} onClick={navigateToHome}>
              <p>Classic</p>
            </div>
            <div className={style.stackRand} onClick={navigateToStack}>
              <p>Stack</p>
            </div>
          </div>
        </div>
        <div ref={secondDropdownRef}>
          <div className={style.headerToggle} onClick={toggleSecondDropdown}>
            Игры
          </div>
          <div
            className={`${style.headerContent} ${
              isSecondDropdownOpen ? style.show : ""
            }`}
          >
            <div className={style.gameOption} onClick={navigateToMafia}>
              <p>Мафия</p>
            </div>
            <div className={style.gameOption}>
              <p>Листочки</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
