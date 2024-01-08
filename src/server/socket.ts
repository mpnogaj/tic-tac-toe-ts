import { Socket } from "socket.io";
import RoomList from './rooms';
import Player from "../common/types/dto/player";
import cookie from 'cookie'

export function handleConn(socket: Socket) {
	console.log('a user connected');

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
	socket.on('join', (guid) => {
		console.log('a user joined');

		const targetRoom = RoomList.find((element) => element.guid == guid)
		if (targetRoom && targetRoom.playerCount < targetRoom.maxPlayerCount && socket.client.request.headers.cookie) {
			socket.join(guid);

			// sometimes it's better not to know
			let playerJson = cookie.parse(socket.client.request.headers.cookie)["Player"].slice(2);

			let player = JSON.parse(playerJson);

			if (!targetRoom.players.find((element) => element.guid == player.guid)) {
				targetRoom.players.push(player);
				targetRoom.playerCount++;
			}

			if (targetRoom.playerCount == targetRoom.maxPlayerCount)
				socket.to(guid).emit("start");

			console.log(targetRoom.players);
		}
		else socket.disconnect();
	});

	socket.on('leave', (guid) => {
		console.log('a user left');

		const targetRoom = RoomList.find((element) => element.guid == guid)
		if (targetRoom && socket.client.request.headers.cookie) {

			let playerJson = cookie.parse(socket.client.request.headers.cookie)["Player"].slice(2);

			let player = JSON.parse(playerJson);
			let playerguid = player.guid;

			const index = targetRoom.players.findIndex((element) => element.guid == playerguid);
			if (index > -1) {
				targetRoom.players.splice(index, 1);
				targetRoom.playerCount--;

				socket.leave(guid);
			}
		}
		else socket.disconnect();
	});

	socket.on('makeMove', (i, j, guid) => {
		console.log('user tries to make a move');
		const targetRoom = RoomList.find((element) => element.guid == guid)

	});

}