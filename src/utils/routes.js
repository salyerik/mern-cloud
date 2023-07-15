import About from '../components/About/About';
import Authorization from '../components/Authorization/Authorization';
import Panel from '../components/Panel';
import Profile from '../components/Profile';

export const authRoutes = [
	{ path: '/file', element: Panel },
	{ path: '/profile', element: Profile },
	{ path: '*', element: Panel },
];
export const notAuthRoutes = [
	{ path: '/auth/login', element: Authorization },
	{ path: '/auth/register', element: Authorization },
	{ path: '*', element: Authorization },
	{ path: '/about', element: About },
];
