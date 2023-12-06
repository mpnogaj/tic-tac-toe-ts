import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />
	}
]);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;
