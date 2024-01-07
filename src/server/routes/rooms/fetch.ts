import { Router } from 'express';
import RoomsList from '../../rooms';

const router = Router();
router.get('/fetch', (req, res) => {
	res.send(RoomsList);
});

export = router;
