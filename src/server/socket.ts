import cookie from 'cookie';
import { Socket } from 'socket.io';

import TicTacToe from '../common/types/tictactoe';
import { Games, RoomList } from './rooms';

export function handleConn(socket: Socket) {
	console.log('a user connected');

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
	socket.on('join', guid => {
		console.log('a user joined');

		const targetRoom = RoomList.find(element => element.guid == guid);
		if (
			targetRoom &&
			targetRoom.players.length < targetRoom.maxPlayerCount &&
			socket.client.request.headers.cookie
		) {
			socket.join(guid);

			// sometimes it's better not to know
			const playerJson = cookie.parse(socket.client.request.headers.cookie)['Player'].slice(2);

			const player = JSON.parse(playerJson);

			if (!targetRoom.players.find(element => element.guid == player.guid)) {
				targetRoom.players.push(player);
			}

			if (targetRoom.players.length == targetRoom.maxPlayerCount) {
				socket.to(guid).emit('start');
				Games.set(targetRoom, new TicTacToe());
			}

			console.log(targetRoom.players);
		} else socket.disconnect();
	});

	socket.on('leave', guid => {
		console.log('a user left');

		const targetRoom = RoomList.find(element => element.guid == guid);
		if (targetRoom && socket.client.request.headers.cookie) {
			const playerJson = cookie.parse(socket.client.request.headers.cookie)['Player'].slice(2);

			const player = JSON.parse(playerJson);
			const playerguid = player.guid;

			const index = targetRoom.players.findIndex(element => element.guid == playerguid);
			if (index > -1) {
				targetRoom.players.splice(index, 1);
				socket.leave(guid);
			}
		} else socket.disconnect();
	});

	socket.on('makeMove', (i, j, guid) => {
		console.log('user tries to make a move');
		const targetRoom = RoomList.find(element => element.guid == guid);
		if (targetRoom === undefined) {
			console.error('Fatal error. Room is undefined. Move ignored');
			return;
		}

		const game = Games.get(targetRoom);
		if (game === undefined) {
			console.error('Fatal error. Game is undefined. Move ignored');
			return;
		}
	});
}
