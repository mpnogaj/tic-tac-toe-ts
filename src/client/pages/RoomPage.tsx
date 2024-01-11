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
			players: new Map<string, Player>()
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
					players: playersMap
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
				<div>
					<p>Connection closed. You might have passed wrong room id</p>
					<a href="/rooms">Back to list</a>
				</div>
			);
		}

		if (this.state.connectionClosed || this.state.error !== undefined) {
			const error = this.state.error ?? 'Invalid room guid';
			return (
				<div>
					<p>Connection closed. Error: {error}</p>
					<a href="/rooms">Back to list</a>
				</div>
			);
		}

		if (this.state.gameStarted && this.startingPlayer !== undefined) {
			return (
				<div>
					<h1>Game started</h1>
					<GameComponent
						startingPlayer={this.startingPlayer}
						socket={this.socket}
						roomGuid={this.props.params.roomGuid!}
					/>
				</div>
			);
		} else {
			return (
				<div>
					<h1>Room: {this.props.params.roomGuid}</h1>
					<h2>Waiting for players to join</h2>
					<h2>Players:</h2>
					<div>
						<ul>
							{Array.from(this.state.players.values()).map(player => {
								return <li key={player.guid}>{player.nickname}</li>;
							})}
						</ul>
					</div>
				</div>
			);
		}
	}
}

export default paramsHOC(RoomPage);
