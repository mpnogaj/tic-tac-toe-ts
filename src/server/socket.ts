import cookie from 'cookie';
import { Server, Socket } from 'socket.io';

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
function setupSockets(io: Server) {
	const handleUserLeaveRoom = (guid: string, socket: Socket): boolean => {
		socket.leave(guid);

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

		const player = targetRoom.players.find(x => x.guid == getPlayer(socket).guid);

		if (player === undefined) return false;

		//end game if it's already started
		const game = Games.get(targetRoom);
		if (game !== undefined && !game.GameFinished) {
			game.Surrender(player);
			io.to(guid).emit('NotifyGameFinished', game.Winner?.nickname ?? null);
		}

		//remove player from the list
		targetRoom.players.splice(targetRoom.players.indexOf(player), 1);
		io.to(guid).emit('NotifyPlayerLeft', player.guid);

		//close room if last player left
		if (targetRoom.players.length === 0) {
			RoomList.splice(RoomList.indexOf(targetRoom), 1);
			Games.delete(targetRoom);
		}

		return true;
	};

	io.on('connection', (socket: Socket) => {
		socket.on('disconnect', () => {
			//currently missing handler
			//user should leave the rooms he is in
			//call surrender for any ongoing games here too
			//we could store a list of rooms for each user
			//or append guid to connection query params
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
