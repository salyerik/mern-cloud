import About from '../components/About';
import Authorization from '../components/Authorization';
import Panel from '../components/Panel';
import Profile from '../components/Profile';

export const authRoutes = [
	{ path: '/mern-cloud/*', element: Panel },
	{ path: '/mern-cloud/profile', element: Profile },
];
export const notAuthRoutes = [
	{ path: '/mern-cloud/*', element: Authorization },
	{ path: '/mern-cloud/login', element: Authorization },
	{ path: '/mern-cloud/about', element: About },
];
