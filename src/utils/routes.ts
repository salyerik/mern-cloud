import About from '../components/About/About';
import Authorization from '../components/Authorization/Authorization';
import Panel from '../components/Panel';
import Profile from '../components/Profile';

export const authRoutes = [
	{ path: '/mern-cloud/file', element: Panel },
	{ path: '/mern-cloud/profile', element: Profile },
	{ path: '*', element: Panel },
];
export const notAuthRoutes = [
	{ path: '/mern-cloud/auth/login', element: Authorization },
	{ path: '/mern-cloud/auth/register', element: Authorization },
	{ path: '/mern-cloud/about', element: About },
	{ path: '*', element: Authorization },
];
