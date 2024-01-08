import crypto from 'crypto';
import { Router } from 'express';

import Room from '../../../common/types/dto/room';
import { RoomList } from '../../rooms';

const router = Router();
router.post('/create', (req, res) => {
	const newRoom: Room = {
		guid: crypto.randomUUID(),
		roomName: (req.body as Room).roomName,
		maxPlayerCount: 2,
		players: []
	};
	RoomList.push(newRoom);
	res.send(newRoom);
});

export = router;
