import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />
	},
	{
		path: '/login',
		element: <LoginPage />
	}
]);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;
