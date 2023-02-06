import { Fragment, useContext, useEffect, useCallback } from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { AppContext } from "../context/appContext";
import {
  addNotifications,
  resetNotifications,
} from "../redux/features/userSlice";
import "./sidenav.css";

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
  const dispatch = useDispatch();

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
      socket.emit("join-room", room, currentRoom);
      setCurrentRoom(room);

      if (isPublic) {
        setPrivateMemberMsg(null);
      }
      // dispatch for notifications
      dispatch(resetNotifications(room));
    },
    [setCurrentRoom, setPrivateMemberMsg, socket, user, dispatch, currentRoom]
  );

  socket.off("notifications").on("notifications", (room) => {
    // only have notifications if you are not in the room
    if (currentRoom !== room) {
      dispatch(addNotifications(room));
    }
  });

  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      getRooms();
      socket.emit("join-room", "general");
      socket.emit("new-user");
    }
  }, [user, socket, setCurrentRoom, getRooms]);

  const orderIds = (id1, id2) => {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  };

  const handlePrivateMemberMessage = (member) => {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  };

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
            {room}
            {currentRoom !== room && (
              <span className="badge round-pill bg-primary">
                {user.newMessages[room]}
              </span>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h2>Members</h2>
      {members.map((member, i) => (
        <ListGroup.Item
          key={i}
          style={{ cursor: "pointer" }}
          active={privateMemberMsg?._id === member?._id}
          onClick={() => handlePrivateMemberMessage(member)}
          disabled={member._id === user._id}
        >
          <Row>
            <Col xs={2} className="member-status">
              <img src={member.picture} alt="" className="member-status-img" />
              {member.status === "online" ? (
                <i className="fas fa-circle sidebar-online-status"></i>
              ) : (
                <i className="fas fa-circle sidebar-offline-status"></i>
              )}
            </Col>
            <Col xs={9}>
              {member.name}
              {member._id === user?._id && "(You)"}
              {member.status === "offline" && "(offline)"}
            </Col>
            <Col xs={1}>
              <span className="badge rounded-pill bg-primary">
                {user?.newMessages[orderIds(member._id, user?._id)]}
              </span>
            </Col>
          </Row>
        </ListGroup.Item>
      ))}
    </Fragment>
  );
};
