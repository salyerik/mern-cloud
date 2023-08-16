import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import useTypedSelector from './../../hooks/useTypedSelector';
import userAPI from '../../store/rtk-queries/user-query';
import { authRoutes, notAuthRoutes } from '../../utils/routes';
import NavBar from '../NavBar';
import Loader from '../UI/Loader/Loader';
import './App.sass';

const App: React.FC = () => {
	const [checkAuth, checkParams] = userAPI.useCheckAuthMutation();
	const isAuth = useTypedSelector(state => state.user.isAuth);

	useEffect(() => {
		if (localStorage.getItem('token')) checkAuth(null);
	}, []);

	if (checkParams.isLoading)
		return (
			<div className='loader'>
				<Loader />
			</div>
		);

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
