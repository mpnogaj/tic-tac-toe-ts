import React from 'react';

import GameComponent from '../components/GameComponent';
//import { io } from 'socket.io-client';
import {
	ParamsComponent,
	ParamsComponentProps,
	paramsHOC
} from '../components/hoc/ParamsComponent';
import { empty } from '../types/other';

type RoomPageState = {
	gameStarted: boolean;
};

type RoomPageParams = {
	roomGuid: string;
};

class RoomPage extends ParamsComponent<empty, RoomPageParams, RoomPageState> {
	//readonly socket;
	aliveIntervalId: ReturnType<typeof setInterval> | undefined;

	constructor(props: ParamsComponentProps<empty, RoomPageParams>) {
		super(props);
		this.state = {
			gameStarted: true
		};
		//this.socket = io();
		this.aliveIntervalId = undefined;
	}

	componentDidMount(): void {
		//this.socket.emit('join', this.props.params.roomGuid);

		//send alive signal to server
		this.aliveIntervalId = setInterval(() => {
			//this.socket.emit('alive');
			console.log('sending alive event');
		}, 5 * 1000);
	}

	componentWillUnmount(): void {
		if (this.aliveIntervalId !== undefined) {
			clearInterval(this.aliveIntervalId);
		}
		//this.socket.emit('leave', this.props.params.roomGuid);
	}

	render(): React.ReactNode {
		if (this.state.gameStarted) {
			return (
				<div>
					<h1>Game started</h1>
					<GameComponent />
				</div>
			);
		} else {
			return (
				<div>
					<h1>Room: {this.props.params.roomGuid}</h1>
				</div>
			);
		}
	}
}

export default paramsHOC(RoomPage);
