import React from 'react';

import Room from '../../common/types/dto/room';

type RoomComponentProps = {
	room: Room;
	joinRoomCallback: (room: Room) => void;
};

const RoomComponent = ({ room, joinRoomCallback }: RoomComponentProps): React.ReactNode => {
	return (
		<div style={{ border: '2px solid' }}>
			<div>
				<span>{room.guid}</span>
			</div>
			<div>
				<span>{room.roomName}</span>
			</div>
			<div>
				<span>
					{room.players.length}/{room.maxPlayerCount}
				</span>
			</div>
			<div>
				<ul>
					{room.players.map(player => {
						return <li key={player.guid}>{player.nickname}</li>;
					})}
				</ul>
			</div>
			<div>
				<a onClick={() => joinRoomCallback(room)}>Join</a>
			</div>
		</div>
	);
};

export default RoomComponent;
