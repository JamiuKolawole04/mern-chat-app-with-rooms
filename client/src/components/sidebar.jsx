import { Fragment } from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

export const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const rooms = ["first room", "second room", "third room"];

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
    </Fragment>
  );
};
