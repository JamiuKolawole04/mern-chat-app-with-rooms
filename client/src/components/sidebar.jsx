import { Fragment, useContext, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

import { AppContext } from "../context/appContext";

export const Sidebar = () => {
  const roomsClientSide = ["first room", "second room", "third room"];

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

  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      getRooms();
      socket.emit("join-room", "general");
      socket.emit("new-user");
    }
  }, [setCurrentRoom, socket, user]);

  // switch off before switching on
  // once on, it keeps sending a message or messages
  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  const getRooms = async () => {
    fetch("http://localhost:8084/api/v1/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  };
  console.log({ rooms, members });

  if (!user) return <></>;

  return (
    <Fragment>
      <h2>Available rooms</h2>

      <ListGroup>
        {rooms.map((room, _i) => (
          <ListGroup.Item key={_i}>{room}</ListGroup.Item>
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
