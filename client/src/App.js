import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Signup, Login, Home, Chat } from "./pages";
import "./App.css";
import { Navigation } from "./components";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
