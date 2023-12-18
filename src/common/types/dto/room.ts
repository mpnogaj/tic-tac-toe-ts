import Player from './player';

type Room = {
	guid: string;
	roomName: string;
	playerCount: number;
	maxPlayerCount: number;
	players: Player[];
};

export default Room;
