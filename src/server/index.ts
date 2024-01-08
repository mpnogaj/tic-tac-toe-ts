import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { Express, NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import http from 'http';
import * as path from 'path';
import { Server } from 'socket.io';

import { PORT } from './config';
import { handleConn } from './socket';

const publicDir = path.join(__dirname, '../../public');
const routeDir = path.join(__dirname, 'routes');

const loadRoutes = async (routesPath: string, app: Express) => {
	const dirContent = fs.readdirSync(routesPath);
	for (const dirElem of dirContent) {
		const filepath = routesPath + '/' + dirElem;
		const file = path.parse(filepath);
		const stat = fs.statSync(filepath);
		if (stat.isDirectory()) {
			await loadRoutes(filepath, app);
		} else if (file.ext === '.js') {
			try {
				const relativePath = path.relative(routeDir, file.dir);
				const baseRoute = relativePath !== '' ? `/api/${relativePath}` : '/api';
				const router = (await import(filepath)).default;
				console.log(`Mapping router from module: ${file.name}, with base route: ${baseRoute}`);
				app.use(baseRoute, router);
			} catch (ex) {
				console.error('Failed loading router');
				console.error(ex);
			}
		}
	}
};

const setupExpressApp = async (app: Express) => {
	app.use(express.static(publicDir));

	const jsonParser = bodyParser.json();
	app.use(jsonParser);

	app.disable('etag');
	app.use(cookieParser());

	console.log('Loading routes');
	await loadRoutes(routeDir, app);
	console.log('Routes loaded');

	app.get('/api/*', (req: Request, res: Response): void => {
		res.sendStatus(404);
	});

	//return react for all not defined routes app
	app.get('*', (req: Request, res: Response, next: NextFunction): void => {
		try {
			res.sendFile(path.join(publicDir, 'app.html'));
		} catch (ex) {
			console.error(ex);
			next(ex);
		}
	});

	const server = http.createServer(app);
	const io = new Server(server);

	server.listen(PORT, () => {
		console.log(`App listening on port ${PORT}`);
	});

	io.on('connection', handleConn);
};

setupExpressApp(express());
