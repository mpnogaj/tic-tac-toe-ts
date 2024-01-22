import cookie from 'cookie';
import { Socket } from 'socket.io';

import Player from '../common/types/dto/player';
import Room from '../common/types/dto/room';
import TicTacToe from '../common/types/tictactoe';
import { Games, RoomList } from './rooms';

// retrieves player from user cookies
function getPlayer(socket: Socket): Player {
	const cookieValue = (socket.client.request.headers.cookie ??= '');
	const playerJson = cookie.parse(cookieValue)['Player'].slice(2);
	return JSON.parse(playerJson);
}

// returns true if room contains a specific player and false otherwise
function containsPlayer(room: Room, player: Player): boolean {
	if (room.players.find(p => p == player)) return true;
	return false;
}

export function handleConn(socket: Socket) {
	console.log('a user connected');

	socket.on('disconnect', () => {
		console.log('user disconnected');

		const player = getPlayer(socket);

		const targetRoom = RoomList.find(element => containsPlayer(element, player));

		if (targetRoom && socket.client.request.headers.cookie) {
			const player = getPlayer(socket);

			const index = targetRoom.players.findIndex(element => element.guid == player.guid);
			if (index > -1) {
				targetRoom.players.splice(index, 1);
				socket.leave(targetRoom.guid);
				socket.to(targetRoom.guid).emit('NotifyPlayerLeft');
			}
		}
		socket.disconnect();
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

			const player = getPlayer(socket);

			if (!targetRoom.players.find(element => element.guid == player.guid)) {
				targetRoom.players.push(player);
				socket.to(guid).emit('NotifyPlayerJoined');
			}

			if (targetRoom.players.length == targetRoom.maxPlayerCount) {
				socket.to(guid).emit('NotifyGameStarted');
				Games.set(targetRoom, new TicTacToe());
			}

			console.log(targetRoom.players);
		} else socket.disconnect();
	});

	socket.on('leave', guid => {
		console.log('a user left');

		const targetRoom = RoomList.find(element => element.guid == guid);
		if (targetRoom && socket.client.request.headers.cookie) {
			const player = getPlayer(socket);

			const index = targetRoom.players.findIndex(element => element.guid == player.guid);
			if (index > -1) {
				targetRoom.players.splice(index, 1);
				socket.leave(guid);
				socket.to(guid).emit('NotifyPlayerLeft');
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

		if (game.MakeMove(i, j, getPlayer(socket))) socket.to(guid).emit('UpdateBoardState');

		if (game.GameFinished) socket.to(guid).emit('NotifyGameFinished');
	});
}
