import { Fragment, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import { Signup, Login, Home, Chat } from "./pages";
import "./App.css";
import { Navigation } from "./components";
import { AppContext, socket } from "./context/appContext";

function App() {
  const user = useSelector((state) => state.user);

  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});

  return (
    <AppContext.Provider
      value={{
        socket,
        rooms,
        setRooms,
        currentRoom,
        setCurrentRoom,
        members,
        setMembers,
        messages,
        setMessages,
        privateMemberMsg,
        setPrivateMemberMsg,
        newMessages,
        setNewMessages,
      }}
    >
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
    </AppContext.Provider>
  );
}

export default App;
