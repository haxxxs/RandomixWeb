import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Stack from "./pages/Stack";
import Mafia from "./pages/Mafia";
import MafiaGame from "./pages/mafiaGame";
import MafiaGameplay from "./pages/MafiaGameplay";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stack" element={<Stack />} />
        <Route path="/mafia" element={<Mafia/>}/>
        <Route path="/mafiaGame" element={<MafiaGame/>}/>
        <Route path="/mafiaGameplayPage" element={<MafiaGameplay/>}/>
      </Routes>
    </Router>
  );
}

export default App;
