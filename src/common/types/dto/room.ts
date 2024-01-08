import Player from './player';
import { TicTacToe } from '../tictactoe';

type Room = {
	guid: string;
	roomName: string;
	playerCount: number;
	maxPlayerCount: number;
	players: Player[];
	game: TicTacToe;
};

export default Room;
