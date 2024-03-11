import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import useTypedSelector from '../../hooks/useTypedSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import useDebounce from '../../hooks/useDebounce';
import fileAPI from '../../store/rtk-queries/file-query';
import { logOut } from '../../store/slices/user-slice';

import avatarIcon from '../../assets/icons/avatar.png';
import searchIcon from '../../assets/icons/search.svg';
import s from './NavBar.module.sass';

const NavBar: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [searchValue, setSearchValue] = useState('');
	const [isSearchActive, setSearchActive] = useState(false);
	const { isAuth, currentUser } = useTypedSelector(state => state.user);
	const { avatar } = currentUser;

	const debouncedValue = useDebounce(searchValue);
	const [searchFile, searchParams] = fileAPI.useSearchFileMutation();

	useEffect(() => {
		if (searchParams.isLoading) navigate('/mern-cloud');
	}, [searchParams.isLoading]);

	useEffect(() => {
		if (isSearchActive) searchFile(debouncedValue || '');
	}, [debouncedValue]);

	return (
		<div className={s.wrapper}>
			<div className={s.logo}>
				<h1 className={s.title}>
					<Link to={'/mern-cloud'}>Cloud</Link>
				</h1>
			</div>
			<div className={s.content}>
				{isAuth ? (
					<>
						<div className={s.searchContainer}>
							<label
								className={[s.search, isSearchActive ? s.active : ''].join(
									' '
								)}>
								<img
									onClick={() => setSearchActive(true)}
									src={searchIcon}
									alt='searchIcon'
								/>
								<input
									onBlur={() => setSearchActive(!!searchValue.length)}
									value={searchValue}
									placeholder='Search...'
									onChange={e => setSearchValue(e.target.value)}
									type='text'
									name='search'
								/>
								{searchValue.length ? (
									<span
										onClick={() => {
											setSearchValue('');
											searchFile('');
										}}>
										&times;
									</span>
								) : null}
							</label>
						</div>
						<Link to={'/mern-cloud/profile'} className={s.profileLink}>
							<img className={s.img} src={avatar || avatarIcon} alt='avatar' />
							<span className={s.link}>Profile</span>
						</Link>
						<button className={s.link} onClick={() => dispatch(logOut())}>
							Sign Out
						</button>
					</>
				) : (
					<div className={s.links}>
						<Link className={s.link} to={'/mern-cloud/about'}>
							About
						</Link>
						<Link className={s.link} to={'/mern-cloud'}>
							Sign Up
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default NavBar;
