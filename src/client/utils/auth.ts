import axios from 'axios';

import Endpoints from '../endpoints';

export const isPlayer = async () => {
	try {
		await axios.get(Endpoints.PingAuth);
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};
