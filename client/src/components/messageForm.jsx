import { Fragment, useState, useContext } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

import "./message-form.css";
import { AppContext } from "../context/appContext";

export const MessageForm = () => {
  const user = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const { socket, currentRoom, messages, setMessages, privateMemberMsg } =
    useContext(AppContext);

  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  };

  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    console.log(roomMessages);
    setMessages(roomMessages);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate);
    setMessage("");
  };

  return (
    <Fragment>
      <div className="messages-output">
        {!user && <div className="alert alert-danger">Please login</div>}
      </div>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Your message"
                disabled={!user ? true : false}
                value={message}
                onChange={({ target }) => setMessage(target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              variant="primary"
              type="submit"
              style={{ width: "100%", backgroundColor: "orange" }}
              disabled={!user ? true : false}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};
