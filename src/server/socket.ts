import cookie from 'cookie';
import { Server, Socket } from 'socket.io';

import Player from '../common/types/dto/player';
import TicTacToe from '../common/types/tictactoe';
import { Games, RoomList } from './rooms';

// retrieves player from user cookies
function getPlayer(socket: Socket): Player {
	const cookieValue = (socket.client.request.headers.cookie ??= '');
	const playerJson = cookie.parse(cookieValue)['Player'].slice(2);
	return JSON.parse(playerJson);
}

function setupSockets(io: Server) {
	const handleUserLeaveRoom = (roomGuid: string, socket: Socket): boolean => {
		socket.leave(roomGuid);

		const targetRoom = RoomList.find(element => element.guid == roomGuid);
		const cookie = socket.client.request.headers.cookie;

		if (targetRoom === undefined || cookie === undefined) return false;

		const player = targetRoom.players.find(x => x.guid == getPlayer(socket).guid);

		if (player === undefined) return false;

		//end game if it's already started
		const game = Games.get(targetRoom);
		if (game !== undefined && !game.GameFinished) {
			game.Surrender(player);
			io.to(roomGuid).emit('NotifyGameFinished', game.Winner?.nickname ?? null);
		}

		//remove player from the list
		targetRoom.players.splice(targetRoom.players.indexOf(player), 1);
		io.to(roomGuid).emit('NotifyPlayerLeft', player.guid);

		//close room if last player left
		if (targetRoom.players.length === 0) {
			RoomList.splice(RoomList.indexOf(targetRoom), 1);
			Games.delete(targetRoom);
		}

		return true;
	};

	io.on('connection', (socket: Socket) => {
		socket.on('disconnect', () => {
			const player = getPlayer(socket);

			const guidsToHandle: string[] = [];

			RoomList.forEach(room => {
				if (room.players.find(p => p.guid == player.guid) === undefined) return;
				guidsToHandle.push(room.guid);
			});

			console.log(guidsToHandle);

			guidsToHandle.forEach(roomGuid => {
				handleUserLeaveRoom(roomGuid, socket);
			});
		});

		socket.on('join', (guid: string) => {
			const cookie = socket.client.request.headers.cookie;
			const targetRoom = RoomList.find(element => element.guid == guid);
			if (targetRoom && targetRoom.players.length < targetRoom.maxPlayerCount && cookie) {
				const player = getPlayer(socket);

				//add socket to room before check because
				//we want to subscribe to the events
				//if user join the room in new tab
				socket.join(guid);

				//user already is in the room
				if (targetRoom.players.some(x => x.guid === player.guid)) return;

				targetRoom.players.push(player);
				io.to(guid).emit('NotifyPlayerJoined', player);

				if (targetRoom.players.length == targetRoom.maxPlayerCount) {
					const game = new TicTacToe();
					game.StartGame(targetRoom.players[0], targetRoom.players[1]);

					io.to(guid).emit('NotifyGameStarted', game.CurrentTurn);
					Games.set(targetRoom, game);
				}
			} else socket.disconnect();
		});

		socket.on('leave', guid => {
			handleUserLeaveRoom(guid, socket);
		});

		socket.on('makeMove', (i, j, guid) => {
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

			const player = targetRoom.players.find(x => x.guid === getPlayer(socket).guid);

			if (player === undefined) {
				console.error('Fatal error. Player is undefined. Move ignored');
				return;
			}

			if (game.MakeMove(i, j, player))
				io.to(guid).emit('UpdateBoardState', game.BoardToString(), game.CurrentTurn);

			if (game.GameFinished) io.to(guid).emit('NotifyGameFinished', game.Winner?.nickname ?? null);
		});
	});
}

export default setupSockets;
