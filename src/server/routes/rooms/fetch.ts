import { Request, Router } from 'express';

import Room from '../../../common/types/dto/room';
import { empty } from '../../../common/types/other';
import { RoomList } from '../../rooms';

const router = Router();

type FetchQueryParams = {
	guid: string | undefined;
};

router.get('/fetch', (req: Request<empty, Room | Room[], empty, FetchQueryParams>, res) => {
	if (req.query.guid !== undefined) {
		const room = RoomList.find(r => r.guid === req.query.guid);
		if (room === undefined) return res.sendStatus(404);
		else return res.send(room);
	}
	res.send(RoomList);
});

export = router;
