//import * as signalR from '@microsoft/signalr';
//import { HubConnection, HubConnectionState } from '@microsoft/signalr';
//import axios from 'axios';
import React from 'react';

import Player from '../../common/types/dto/player';
//import Room from '../../common/types/dto/room';
import GameComponent from '../components/GameComponent';
import {
	ParamsComponent,
	ParamsComponentProps,
	paramsHOC
} from '../components/hoc/ParamsComponent';
//import Endpoints from '../endpoints';
import { empty } from '../types/other';

type RoomPageState = {
	isLoading: boolean;
	connectionClosed: boolean;
	error: string | undefined;
	gameStarted: boolean;
	playersReady: Map<string, boolean>;
	players: Map<string, Player>;
};

type RoomPageParams = {
	roomGuid: string;
};

class RoomPage extends ParamsComponent<empty, RoomPageParams, RoomPageState> {
	//connection: HubConnection;

	startingPlayer: Player | undefined;

	constructor(props: ParamsComponentProps<empty, RoomPageParams>) {
		super(props);
		this.state = {
			isLoading: true,
			connectionClosed: false,
			error: undefined,
			gameStarted: false,
			playersReady: new Map<string, boolean>(),
			players: new Map<string, Player>()
		};

		this.startingPlayer = undefined;
		/*this.connection = new signalR.HubConnectionBuilder()
			.withUrl(`${Base}/game?room=${props.params.roomGuid}`)
			.build();

		this.connection.on('NotifyToggleReady', (guid: string, ready: boolean) => {
			this.setState({
				...this.state,
				playersReady: new Map(this.state.playersReady.set(guid, ready))
			});
		});
		this.connection.on('NotifyGameStarted', (player: Player) => {
			this.startingPlayer = player;
			this.setState({ ...this.state, gameStarted: true });
		});
		this.connection.on('NotifyPlayerJoined', (player: Player) => {
			this.setState({
				...this.state,
				players: new Map(this.state.players.set(player.guid, player))
			});
		});
		this.connection.onclose(() => {
			this.setState({ connectionClosed: true });
		});
		this.connection.on('NotifyPlayerLeft', playerGuid => {
			if (this.state.gameStarted) return;
			this.state.players.delete(playerGuid);
			this.state.playersReady.delete(playerGuid);

			this.setState({
				...this.state,
				players: new Map(this.state.players),
				playersReady: new Map(this.state.playersReady)
			});
		});*/
	}

	async componentDidMount(): Promise<void> {
		/*if (this.connection.state === HubConnectionState.Disconnected) {
			try {
				const res = await this.connection.start();

				console.log(res);

				const resp = await axios.get<Room>(`${Endpoints.Rooms}/${this.props.params.roomGuid}`);
				const room = resp.data;
				const playersMap = new Map(room.players.map(x => [x.guid, x]));

				const readyMap = new Map(
					Object.keys(room.readyDict).map(key => {
						return [key, room.readyDict[key]];
					})
				);

				this.setState({
					...this.state,
					isLoading: false,
					error: undefined,
					players: playersMap,
					playersReady: readyMap
				});
			} catch (err) {
				this.setState({ ...this.state, isLoading: false, error: err });
			}
		}*/
	}

	componentWillUnmount(): void {
		/*if (this.connection.state === HubConnectionState.Connected) {
			//fire and forget
			this.connection.stop().then().catch();
		}*/
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
					<GameComponent startingPlayer={this.startingPlayer} />
				</div>
			);
		} else {
			return (
				<div>
					<h1>Room: {this.props.params.roomGuid}</h1>
					<h2>Players:</h2>
					<div>
						<ul>
							{Array.from(this.state.players.values()).map(player => {
								const isReady = this.state.playersReady.get(player.guid) ?? false;
								return (
									<li key={player.guid}>
										{player.nickname} - {isReady ? 'Ready' : 'Not ready'}
									</li>
								);
							})}
						</ul>
					</div>

					<a
						onClick={async () => {
							//await this.connection.invoke('ToggleReady');
							console.log('toggle ready');
						}}
					>
						Toggle ready
					</a>
				</div>
			);
		}
	}
}

export default paramsHOC(RoomPage);
