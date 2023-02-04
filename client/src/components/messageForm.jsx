import { Fragment, useState, useContext, useEffect, useRef } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

import "./message-form.css";
import { AppContext } from "../context/appContext";

export const MessageForm = () => {
  const user = useSelector((state) => state.user);
  const messageEndRef = useRef(null);
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

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // socket.off("room-messages").on("room-messages", (roomMessages) => {
  //   console.log(roomMessages);
  //   setMessages(roomMessages);
  // });

  useEffect(() => {
    socket.off("room-messages").on("room-messages", (roomMessages) => {
      console.log(roomMessages);
      setMessages(roomMessages);
    });
  }, [socket, setMessages, handleSubmit]);

  // socket.on("room-messages", (roomMessages) => {
  //   console.log(roomMessages);
  //   setMessages(roomMessages);
  // });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  console.log(messages);

  return (
    <Fragment>
      <div className="messages-output">
        {user && !privateMemberMsg?._id && (
          <div className="alert alert-info">
            You are in the {currentRoom} room
          </div>
        )}
        {user && privateMemberMsg?._id && (
          <div className="alert alert-info conversation-info">
            <span>
              Your conversation with {privateMemberMsg.name}
              <img
                src={privateMemberMsg.picture}
                alt=""
                className="conversation-profile-pic"
              />
            </span>
          </div>
        )}
        {!user && <div className="alert alert-danger">Please login</div>}

        {user &&
          messages.map(({ _id: date, messagesByDate }, _i) => (
            <div key={_i}>
              <p className="alert alert-info text-center message-date-indicator">
                {date}
              </p>
              {messagesByDate?.map(({ content, time, from }, _i) => (
                <div
                  key={_i}
                  className={
                    from.email === user?.email ? "message" : "incoming-message"
                  }
                >
                  {/* <p>{content}</p> */}
                  <div className="message-inner">
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={from?.picture}
                        alt=""
                        style={{
                          width: 35,
                          height: 35,
                          objectFit: "cover",
                          borderRadius: "50%",
                          marginRight: 10,
                        }}
                      />
                      <p className="message-sender">
                        {from._id === user?._id ? "You" : from.name}
                      </p>
                    </div>

                    <p className="message-content">{content}</p>
                    <p className="message-timestamp-left">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}

        <div ref={messageEndRef} />
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
