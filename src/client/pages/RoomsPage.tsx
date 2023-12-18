import axios, { AxiosError } from 'axios';
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
			const resp = await axios.get<Array<Room>>(Endpoints.Rooms.FETCH_ROOMS);
			this.setState({ rooms: resp.data, isRefreshing: false });
		} catch (error) {
			console.error(error);
			let fallbackRooms: Room[] = [];
			if (axios.isAxiosError(error)) {
				//if 404 then 99% API is not ready yet. Fill with test data
				//TODO: Remove when API is ready
				if (error.request?.status === 404 ?? false) {
					fallbackRooms = [
						{
							guid: '000',
							playerCount: 1,
							maxPlayerCount: 2,
							roomName: 'API 404 fallback room. For testing while API is not ready',
							players: [{ guid: '111', nickname: 'XxXProKillerXxX' }]
						}
					];
				}
			}
			this.setState({
				isRefreshing: false,
				rooms: fallbackRooms
			});
		}
	};

	createRoom = async () => {
		const roomName = prompt('Enter room name');

		if (roomName === null) return;

		const room: Room = {
			roomName: roomName,
			maxPlayerCount: 2,
			guid: '',
			players: [],
			playerCount: 0
		};

		try {
			//const resp = await axios.post<Room>(Endpoints.Rooms.CREATE_ROOM, room);
			//const newRoom = resp.data;
			this.joinRoom('111');
		} catch (err) {
			alert("Error. Couldn't create room. Check console for details");
			console.error(err);
		}
	};

	joinRoom = (roomGuid: string) => {
		this.props.navigate(`/room/${roomGuid}`);
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
