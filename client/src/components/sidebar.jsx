import { Fragment } from "react";
import { ListGroup } from "react-bootstrap";

export const Sidebar = () => {
  const rooms = ["first room", "second room", "third room"];
  return (
    <Fragment>
      <h2>Available rooms</h2>

      <ListGroup>
        {rooms.map((room, _i) => (
          <ListGroup.Item key={_i}>{room}</ListGroup.Item>
        ))}
      </ListGroup>
      <h2>Members</h2>
    </Fragment>
  );
};
