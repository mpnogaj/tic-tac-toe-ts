import axios from 'axios';
import React from 'react';

import Room from '../../common/types/dto/room';
import { empty } from '../../common/types/other';
import RoomComponent from '../components/RoomComponent';
import { NavComponent, NavComponentProps, navHOC } from '../components/hoc/NavComponent';
import Endpoints from '../endpoints';

interface ILoginPageState {
	isRefreshing: boolean;
	rooms: Room[];
	roomName: string;
}

class RoomsPage extends NavComponent<empty, ILoginPageState> {
	constructor(props: NavComponentProps<empty>) {
		super(props);

		this.state = {
			isRefreshing: false,
			rooms: [],
			roomName: ''
		};
	}

	componentDidMount(): void {
		this.fetchRooms();
	}

	fetchRooms = async () => {
		console.log('Refreshing rooms');

		try {
			this.setState({ isRefreshing: true });
			const resp = await axios.get<Array<Room>>(Endpoints.FetchRooms);
			this.setState({ rooms: resp.data, isRefreshing: false });
		} catch (error) {
			console.error(error);
		}
	};

	createRoom = async () => {
		const roomName = this.state.roomName;

		if (roomName === '') return;

		const room: Room = {
			roomName: roomName,
			maxPlayerCount: 2,
			guid: '00000000-0000-0000-0000-000000000000',
			players: []
		};

		try {
			const resp = await axios.post<Room>(Endpoints.CreateRoom, room);
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
			//???
			//await axios.post(`${Endpoints.Rooms}/${roomGuid}`);
			this.props.navigate(`/room/${roomGuid}`);
		} catch (err) {
			console.error(err);
		}
	};

	logoutHandler = async () => {
		try {
			await axios.post(Endpoints.Logout);
			this.props.navigate('/login');
		} catch (err) {
			console.error(err);
		}
	};

	render(): React.ReactNode {
		return (
			<div className="container">
				<div className="row mt-3">
					<div className="col">
						<h1>Tic Tac Toe</h1>
					</div>
					<div className="col-auto">
						<button className="btn btn-primary" onClick={async () => await this.logoutHandler()}>
							Logout
						</button>
					</div>
				</div>

				<h2>Rooms</h2>
				<div className="row">
					<div className="col-auto">
						<button
							className="btn btn-primary"
							data-bs-toggle="modal"
							data-bs-target="#createRoomModal"
						>
							Create room
						</button>
					</div>
					<div className="col-auto">
						<button
							disabled={this.state.isRefreshing}
							className="btn btn-primary"
							onClick={async () => {
								await this.fetchRooms();
							}}
						>
							{this.state.isRefreshing ? 'Refreshing...' : 'Refresh'}
						</button>
					</div>
				</div>
				<div>
					{this.state.rooms.map(room => {
						return (
							<RoomComponent
								room={room}
								joinRoomCallback={async room => {
									await this.joinRoom(room.guid);
								}}
								key={room.guid}
							/>
						);
					})}
				</div>

				<div
					className="modal fade"
					id="createRoomModal"
					tabIndex={-1}
					role="dialog"
					aria-labelledby="createRoomModalLabel"
					aria-hidden="true"
				>
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLabel">
									Create room
								</h5>
								<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<form>
									<div className="form-group">
										<label>Room name: </label>
										<input
											className="form-control"
											type="text"
											value={this.state.roomName}
											onInput={e => {
												this.setState({ roomName: e.currentTarget.value });
											}}
										/>
									</div>
								</form>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
									Close
								</button>
								<button
									type="button"
									className="btn btn-primary"
									data-bs-dismiss="modal"
									disabled={this.state.roomName === ''}
									onClick={async () => {
										await this.createRoom();
									}}
								>
									Create room
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default navHOC(RoomsPage);
