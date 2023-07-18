import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Input from '../UI/Input';
import { authPost } from '../../services/user-service';
import s from './Authorization.module.sass';
import useInput from '../../hooks/useInput';

const Authorization = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [isLoginPage, setLoginPage] = useState(true);

	const firstName = useInput('');
	const lastName = useInput('');
	const email = useInput('');
	const password = useInput('');

	useEffect(() => setLoginPage(pathname.includes('login')), [pathname]);

	const authHandler = () => {
		dispatch(
			authPost(
				firstName.value,
				lastName.value,
				email.value,
				password.value,
				isLoginPage ? 'login' : 'register',
				navigate
			)
		);
	};

	return (
		<section className={s.wrapper}>
			<div className={s.top}>
				<div className={s.block}>
					<h2 className={s.title}>{isLoginPage ? 'Login' : 'Register'}</h2>
					{!isLoginPage && (
						<>
							<Input placeholder={'First Name'} {...firstName} />
							<Input placeholder={'Last Name'} {...lastName} />
						</>
					)}
					<Input type={'email'} placeholder={'E-Mail'} {...email} />
					<Input type={'password'} placeholder={'Password'} {...password} />
					<div className={s.middle}>
						<span>
							{isLoginPage ? 'Do not have account?' : 'Already have account?'}
						</span>
						<Link to={isLoginPage ? '/auth/register' : '/auth/login'}>
							{isLoginPage ? 'Sign Up' : 'Sign In'}
						</Link>
					</div>
					<button className={s.btn} onClick={authHandler}>
						{isLoginPage ? 'Sign In' : 'Sign Up'}
					</button>
				</div>
			</div>
			<div className={s.bottom}>Please authorized to store your files.</div>
		</section>
	);
};

export default Authorization;
