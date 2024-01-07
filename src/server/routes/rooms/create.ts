import { Router } from 'express';
import Room from '../../../common/types/dto/room';
import Player from '../../../common/types/dto/player';
import RoomsList from '../../rooms';
import crypto from "crypto"

const router = Router();
router.post('/create', (req, res) => {
	var newRoom: Room = {
		guid: crypto.randomUUID(),
		roomName: (req.body as Room).roomName,
		playerCount: 0,
		maxPlayerCount: 2,
		players: []
	};
	RoomsList.push(newRoom);
	res.send(newRoom);
});

export = router;
