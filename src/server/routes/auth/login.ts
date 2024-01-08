import { Router, Request } from 'express';
import crypto from "crypto"
import Player from '../../../common/types/dto/player';

const router = Router();
router.get('/login', (req, res) => {
	let c = req.cookies;
	if (c['Player']) {
		res.send(c['Player']);
	}
	else {
		let newPlayer: Player = { guid: crypto.randomUUID(), nickname: req.body.nickname ??= 'anon' };
		res.cookie('Player', newPlayer).send(newPlayer);
	}
});

router.get('/ping', (req, res) => {
	let c = req.cookies;
	if (c['Player'])
		res.sendStatus(200);
	else
		res.sendStatus(403);
});


router.get('/logout', (req, res) => {
	res.clearCookie('Player').end();
});

export = router;
