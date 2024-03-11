import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import userAPI from '../../store/rtk-queries/user-query';
import useInput from '../../hooks/useInput';

import Input from '../UI/Input';
import s from './Authorization.module.sass';

const Authorization: React.FC = () => {
	const { pathname } = useLocation();
	const [isLoginPage, setLoginPage] = useState(true);

	const [authPost, authParams] = userAPI.useAuthorizeMutation();

	const firstName = useInput('');
	const lastName = useInput('');
	const email = useInput('');
	const password = useInput('');

	useEffect(() => {
		setLoginPage(pathname.includes('login'));
	}, [pathname]);

	const authHandler = () => {
		const body = {
			firstName: firstName.value,
			lastName: lastName.value,
			email: email.value,
			password: password.value,
		};
		authPost({
			body,
			path: isLoginPage ? 'login' : 'register',
		});
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
						<Link to={isLoginPage ? '/mern-cloud' : '/mern-cloud/login'}>
							{isLoginPage ? 'Sign Up' : 'Sign In'}
						</Link>
					</div>
					<button
						disabled={authParams.isLoading}
						className={[
							s.btn,
							authParams.isLoading ? s.btn__disabled : '',
						].join(' ')}
						onClick={authHandler}>
						{isLoginPage ? 'Sign In' : 'Sign Up'}
					</button>
				</div>
			</div>
			<div className={s.bottom}>Please authorized to store your files</div>
		</section>
	);
};

export default Authorization;
