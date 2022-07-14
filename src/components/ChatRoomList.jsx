import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Loader, Nav } from 'rsuite';
import { useRooms } from '../context/rooms.context';
import RoomItem from './RoomItem';

const ChatRoomList = ({ aboveElementHeight }) => {
  const rooms = useRooms();
  const location = useLocation();
  return (
    <div className="h-100">
      <Nav
        appearance="subtle"
        vertical
        reversed
        className="overflow-y-scroll custom-scroll"
        style={{
          height: `calc(100% - ${aboveElementHeight}px)`,
        }}
        activeKey={location.pathname}
      >
        {!rooms && (
          <Loader center vertical content="Loading" speed="low" size="md" />
        )}
        {rooms &&
          rooms.length > 0 &&
          rooms.map(room => {
            return (
              <Nav.Item
                componentClass={Link}
                to={`/chat/${room.id}`}
                key={room.id}
                eventKey={`/chat/${room.id}`}
              >
                <RoomItem room={room} />
              </Nav.Item>
            );
          })}
      </Nav>
    </div>
  );
};

export default ChatRoomList;
