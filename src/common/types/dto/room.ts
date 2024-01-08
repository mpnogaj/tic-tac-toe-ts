import Player from './player';

type Room = {
	guid: string;
	roomName: string;
	maxPlayerCount: number;
	players: Player[];
};

export default Room;
