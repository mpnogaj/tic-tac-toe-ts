import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import axios from 'axios';

const container = document.getElementById('app');
const root = createRoot(container!);

axios.defaults.withCredentials = true;

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
