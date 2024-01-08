import { Router } from 'express';
import RoomList from '../../rooms';

const router = Router();
router.get('/fetch', (req, res) => {
	res.send(RoomList);
});

export = router;
