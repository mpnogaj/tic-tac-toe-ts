import express, { Request, Response, NextFunction, Express } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { PORT } from './config';

const app = express();
const publicDir = path.join(__dirname, '../../public');
const routePath = path.join(__dirname, 'routes');

app.use(express.static(publicDir));

app.get('/', (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.sendFile('index.html');
	} catch (error) {
		next(error);
	}
});

const loadRoutes = async (routesPath: string, app: Express) => {
	fs.readdirSync(routesPath).forEach(async fileName => {
		const filepath = routesPath + '/' + fileName;
		const file = path.parse(filepath);
		fs.stat(filepath, async (_, stat) => {
			if (stat.isDirectory()) {
				loadRoutes(filepath, app);
			} else if (file.ext === '.js') {
				try {
					console.info(`Loading module: ${path.join(file.dir, file.name)}`);
					const route = `/api/${path.relative(routePath, file.dir)}`;
					const router = (await import(filepath)).default;
					console.log(`Mapping router from module: ${file.name} to route: ${route}`);
					app.use(route, router);
				} catch (ex) {
					console.error('Failed loading router');
					console.error(ex);
				}
			}
		});
	});
};
loadRoutes(routePath, app);

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
