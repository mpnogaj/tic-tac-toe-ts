import axios from 'axios';
import React from 'react';
import { io } from 'socket.io-client';

import Player from '../../common/types/dto/player';
import Room from '../../common/types/dto/room';
import { empty } from '../../common/types/other';
import GameComponent from '../components/GameComponent';
import {
	ParamsComponent,
	ParamsComponentProps,
	paramsHOC
} from '../components/hoc/ParamsComponent';
import Endpoints from '../endpoints';

type RoomPageState = {
	isLoading: boolean;
	connectionClosed: boolean;
	error: string | undefined;
	gameStarted: boolean;
	players: Map<string, Player>;
	roomName: string;
};

type RoomPageParams = {
	roomGuid: string;
};

class RoomPage extends ParamsComponent<empty, RoomPageParams, RoomPageState> {
	startingPlayer: Player | undefined;
	socket: ReturnType<typeof io>;
	constructor(props: ParamsComponentProps<empty, RoomPageParams>) {
		super(props);
		this.state = {
			isLoading: true,
			connectionClosed: false,
			error: undefined,
			gameStarted: false,
			players: new Map<string, Player>(),
			roomName: ''
		};

		this.startingPlayer = undefined;

		this.socket = io({
			autoConnect: false
		});

		this.socket.on('NotifyPlayerJoined', (player: Player) => {
			this.setState({
				...this.state,
				players: new Map(this.state.players.set(player.guid, player))
			});
		});
		this.socket.on('NotifyPlayerLeft', (playerGuid: string) => {
			if (this.state.gameStarted) return;
			this.state.players.delete(playerGuid);
			this.setState({
				...this.state,
				players: new Map(this.state.players)
			});
		});
		this.socket.on('NotifyGameStarted', (startingPlayer: Player) => {
			console.log(startingPlayer);
			this.startingPlayer = startingPlayer;
			this.setState({
				...this.state,
				gameStarted: true
			});
		});
		this.socket.on('disconnect', () => {
			this.setState({ ...this.state, connectionClosed: true });
		});
	}

	async componentDidMount(): Promise<void> {
		if (this.socket.disconnected) {
			try {
				this.socket.connect();
				this.socket.emit('join', this.props.params.roomGuid);
				const resp = await axios.get<Room>(`${Endpoints.FetchRooms}`, {
					params: { guid: this.props.params.roomGuid }
				});
				const room = resp.data;
				const playersMap = new Map(room.players.map(x => [x.guid, x]));

				this.setState({
					...this.state,
					isLoading: false,
					error: undefined,
					players: playersMap,
					roomName: room.roomName
				});
			} catch (err) {
				let errMsg = '';
				if (err instanceof Error) {
					errMsg = err.message;
				} else {
					errMsg = 'Unknown error';
				}
				this.setState({ ...this.state, isLoading: false, error: errMsg });
			}
		}
	}

	componentWillUnmount(): void {
		if (this.socket.connected) {
			this.socket.disconnect();
		}
	}

	render(): React.ReactNode {
		if (this.state.isLoading) {
			return <div>Connecting...</div>;
		}

		if (this.state.connectionClosed) {
			return (
				<div className="container d-flex">
					<div className="mt-3 mx-auto alert alert-danger d-inline-block" role="alert">
						<div className="text-center">
							Connection closed. You might have passed wrong room id.{' '}
							<a href="/rooms">Go back to room list</a>
						</div>
					</div>
				</div>
			);
		}

		if (this.state.connectionClosed || this.state.error !== undefined) {
			const error = this.state.error ?? 'Invalid room guid';
			return (
				<div className="container d-flex">
					<div className="mt-3 mx-auto alert alert-danger d-inline-block" role="alert">
						<div className="text-center">
							Connection closed. Error: {error}. <a href="/rooms">Go back to room list</a>
						</div>
					</div>
				</div>
			);
		}

		if (this.state.gameStarted && this.startingPlayer !== undefined) {
			return (
				<GameComponent
					startingPlayer={this.startingPlayer}
					socket={this.socket}
					roomGuid={this.props.params.roomGuid!}
				/>
			);
		} else {
			return (
				<div className="container">
					<h1>Room: {this.state.roomName}</h1>
					<h4>Room code: {this.props.params.roomGuid}</h4>
					<h2>Players:</h2>
					<div className="mt-3 mb-3">
						<ul className="list-group d-inline-flex">
							{Array.from(this.state.players.values()).map(player => {
								return (
									<li
										className="list-group-item d-flex justify-content-between align-items-center"
										key={player.guid}
									>
										{player.nickname}
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			);
		}
	}
}

export default paramsHOC(RoomPage);
