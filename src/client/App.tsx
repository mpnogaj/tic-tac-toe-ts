import React from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import LoadingComponent from './components/LoadingComponent';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RoomPage from './pages/RoomPage';
import RoomsPage from './pages/RoomsPage';
import { isPlayer } from './utils/auth';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Navigate to="/rooms" />
	},
	{
		path: '/login',
		element: <LoginPage />
	},
	{
		path: '/rooms',
		element: (
			<ProtectedRoute
				child={<RoomsPage />}
				loading={<LoadingComponent />}
				fallback={<Navigate to="/login" />}
				checkAuthFunc={isPlayer}
			/>
		)
	},
	{
		path: '/room/:roomGuid',
		element: (
			<ProtectedRoute
				child={<RoomPage />}
				loading={<LoadingComponent />}
				fallback={<Navigate to="/login" />}
				checkAuthFunc={isPlayer}
			/>
		)
	}
]);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;
