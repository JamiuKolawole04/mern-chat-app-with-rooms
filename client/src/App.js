import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import { Signup, Login, Home, Chat } from "./pages";
import "./App.css";
import { Navigation } from "./components";

function App() {
  const user = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        {!user && (
          <Fragment>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Fragment>
        )}

        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
