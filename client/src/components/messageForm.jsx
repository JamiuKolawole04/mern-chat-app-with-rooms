import { Fragment } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

import "./message-form.css";

export const MessageForm = () => {
  const user = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
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
