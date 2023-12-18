import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RoomPage from './pages/RoomPage';
import RoomsPage from './pages/RoomsPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />
	},
	{
		path: '/login',
		element: <LoginPage />
	},
	{
		path: '/rooms',
		element: <RoomsPage />
	},
	{
		path: '/room/:roomGuid',
		element: <RoomPage />
	}
]);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;
