import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import userAPI from '../../store/rtk-queries/user-query';
import { authRoutes, notAuthRoutes } from '../../utils/routes';
import NavBar from '../NavBar';
import Loader from '../UI/Loader/Loader';
import './App.sass';

const App = () => {
	const { isLoading } = userAPI.useCheckAuthQuery();
	const isAuth = useSelector(state => state.user.isAuth);

	if (isLoading) return <Loader />;

	return (
		<BrowserRouter>
			<div className='container'>
				<NavBar />
				<Routes>
					{(isAuth ? authRoutes : notAuthRoutes).map((route, i) => (
						<Route key={i} path={route.path} element={<route.element />} />
					))}
				</Routes>
			</div>
		</BrowserRouter>
	);
};

export default App;
