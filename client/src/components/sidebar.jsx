import { Fragment, useContext, useEffect, useCallback } from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

import { AppContext } from "../context/appContext";

export const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const {
    socket,
    rooms,
    setRooms,
    currentRoom,
    setCurrentRoom,
    members,
    setMembers,
    privateMemberMsg,
    setPrivateMemberMsg,
  } = useContext(AppContext);

  // const getRooms = async () => {
  //   fetch("http://localhost:8084/api/v1/rooms")
  //     .then((res) => res.json())
  //     .then((data) => setRooms(data))
  //     .catch((err) => console.log(err));
  // };
  const getRooms = useCallback(async () => {
    fetch("http://localhost:8084/api/v1/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.log(err));
  }, [setRooms]);

  console.log({ rooms, members });

  // switch off before switching on
  // once on, it keeps sending a message or messages
  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  const joinRoom = useCallback(
    (room, isPublic = true) => {
      if (!user) return alert("please login first");
      socket.emit("join-room", room);
      setCurrentRoom(room);

      if (isPublic) {
        setPrivateMemberMsg(null);
      }
      // dispatch for notifications
    },
    [setCurrentRoom, setPrivateMemberMsg, socket, user]
  );

  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      getRooms();
      socket.emit("join-room", "general");
      socket.emit("new-user");
    }
  }, [user, socket, setCurrentRoom, getRooms, joinRoom]);

  if (!user) return <></>;

  return (
    <Fragment>
      <h2>Available rooms</h2>

      <ListGroup>
        {rooms.map((room, _i) => (
          <ListGroup.Item
            key={_i}
            onClick={() => joinRoom(room)}
            active={room === currentRoom}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {room} {currentRoom !== room && <span></span>}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h2>Members</h2>
      {members.map((member, i) => (
        <ListGroup.Item key={i} style={{ cursor: "pointer" }}>
          {member.name}
        </ListGroup.Item>
      ))}
    </Fragment>
  );
};
