import axios from 'axios';
import React from 'react';

import Room from '../../common/types/dto/room';
import RoomComponent from '../components/RoomComponent';
import { NavComponent, NavComponentProps, navHOC } from '../components/hoc/NavComponent';
import Endpoints from '../endpoints';
import { empty } from '../types/other';

interface ILoginPageState {
	isRefreshing: boolean;
	rooms: Room[];
}

class RoomsPage extends NavComponent<empty, ILoginPageState> {
	constructor(props: NavComponentProps<empty>) {
		super(props);

		this.state = {
			isRefreshing: false,
			rooms: []
		};
	}

	componentDidMount(): void {
		this.fetchRooms();
	}

	fetchRooms = async () => {
		console.log('Refreshing rooms');

		try {
			this.setState({ isRefreshing: true });
			const resp = await axios.get<Array<Room>>(Endpoints.Rooms);
			this.setState({ rooms: resp.data, isRefreshing: false });
		} catch (error) {
			console.error(error);
		}
	};

	createRoom = async () => {
		const roomName = prompt('Enter room name');

		if (roomName === null) return;

		const room: Room = {
			roomName: roomName,
			maxPlayerCount: 2,
			guid: '00000000-0000-0000-0000-000000000000',
			players: []
		};

		try {
			const resp = await axios.post<Room>(Endpoints.Rooms, room);
			const newRoom = resp.data;
			console.log(newRoom);
			this.props.navigate(`/room/${newRoom.guid}`);
		} catch (err) {
			alert("Error. Couldn't create room. Check console for details");
			console.error(err);
		}
	};

	joinRoom = async (roomGuid: string) => {
		try {
			await axios.post(`${Endpoints.Rooms}/${roomGuid}`);
			this.props.navigate(`/room/${roomGuid}`);
		} catch (err) {
			console.error(err);
		}
	};

	render(): React.ReactNode {
		return (
			<div>
				<h1>Rooms</h1>
				<div>
					{!this.state.isRefreshing ? (
						<a
							onClick={() => {
								this.fetchRooms();
							}}
						>
							Refresh
						</a>
					) : (
						<span>Refreshing...</span>
					)}
					<span> | </span>
					<a
						onClick={async () => {
							await this.createRoom();
						}}
					>
						Create room
					</a>
				</div>
				<div>
					{this.state.rooms.map(room => {
						return (
							<RoomComponent
								room={room}
								joinRoomCallback={room => {
									this.joinRoom(room.guid);
								}}
								key={room.guid}
							/>
						);
					})}
				</div>
			</div>
		);
	}
}

export default navHOC(RoomsPage);
