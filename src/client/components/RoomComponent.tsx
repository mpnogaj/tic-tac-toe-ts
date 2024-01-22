import React from 'react';

import Room from '../../common/types/dto/room';

type RoomComponentProps = {
	room: Room;
	joinRoomCallback: (room: Room) => void;
};

const RoomComponent = ({ room, joinRoomCallback }: RoomComponentProps): React.ReactNode => {
	return (
		<div className="card mt-4 mb-4">
			<div className="card-body">
				<h5 className="card-title">
					{room.roomName} - {room.players.length}/{room.maxPlayerCount}
				</h5>
				<h6 className="card-subtitle mb-2 text-muted">Room code: {room.guid}</h6>
				<ul className="">
					{room.players.map(player => {
						return (
							<li className="" key={player.guid}>
								{player.nickname}
							</li>
						);
					})}
				</ul>
				<a className="btn btn-primary" onClick={() => joinRoomCallback(room)}>
					Join
				</a>
			</div>
		</div>
	);
};

export default RoomComponent;
