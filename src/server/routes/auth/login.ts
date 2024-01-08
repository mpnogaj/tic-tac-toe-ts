import crypto from 'crypto';
import { Router } from 'express';

import Player from '../../../common/types/dto/player';

const router = Router();

router.post('/login', (req, res) => {
	const c = req.cookies;
	if (c['Player']) {
		res.send(c['Player']);
	} else {
		const newPlayer: Player = {
			guid: crypto.randomUUID(),
			nickname: (req.body.nickname ??= 'anon')
		};
		res.cookie('Player', newPlayer).send(newPlayer);
	}
});

router.get('/ping', (req, res) => {
	const c = req.cookies;
	if (c['Player']) res.sendStatus(200);
	else res.sendStatus(403);
});

router.post('/logout', (req, res) => {
	res.clearCookie('Player').end();
});

export = router;
