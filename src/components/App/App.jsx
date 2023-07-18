import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { auth } from '../../services/user-service';
import { authRoutes, notAuthRoutes } from '../../utils/routes';
import NavBar from '../NavBar';
import Loader from '../UI/Loader/Loader';
import './App.sass';

const App = () => {
	const isAuth = useSelector(state => state.user.isAuth);
	const dispatch = useDispatch();
	const [routes, setRoutes] = useState(null);

	useEffect(() => {
		dispatch(auth());
		setRoutes(isAuth ? authRoutes : notAuthRoutes);
	}, [isAuth]);

	if (!routes) return <Loader />;

	return (
		<BrowserRouter>
			<div className='container'>
				<NavBar />
				<Routes>
					{routes.map((route, i) => (
						<Route key={i} path={route.path} element={<route.element />} />
					))}
				</Routes>
			</div>
		</BrowserRouter>
	);
};

export default App;
