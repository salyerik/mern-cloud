import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { searchFile } from '../../services/file-service';
import { showLoader } from '../../reducers/appReducer';
import { logOut } from '../../reducers/userReducer';
import { resetStack } from '../../reducers/fileReducer';

import s from './NavBar.module.sass';
import avatarIcon from '../../assets/icons/avatar.png';
import searchIcon from '../../assets/icons/search.svg';

function NavBar() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { isAuth, currentUser } = useSelector(state => state.user);
	const [searchTimeout, setSearchTimeout] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [isSearchActive, setSearchActive] = useState(false);
	const { avatar } = currentUser;
	const dispatch = useDispatch();

	function dispatchSearch(value = '') {
		dispatch(showLoader());
		dispatch(resetStack());
		dispatch(searchFile(value));
	}

	function searchVisibilityHandler() {
		if (searchValue.length) setSearchActive(true);
		else setSearchActive(prev => !prev);
	}

	function searchHandler(e) {
		if (!pathname.includes('/file')) navigate('/file');
		setSearchValue(e.target.value);
		clearTimeout(searchTimeout);
		setSearchTimeout(
			setTimeout(() => {
				dispatchSearch(e.target.value);
			}, 500)
		);
	}

	function resetSearch() {
		setSearchValue('');
		dispatchSearch();
		setSearchActive(false);
	}

	function logoutHandler() {
		localStorage.removeItem('token');
		dispatch(logOut());
	}

	return (
		<div className={s.wrapper}>
			<div className={s.logo}>
				<h1 className={s.title}>
					<Link to={'/'}>Cloud</Link>
				</h1>
			</div>
			<div className={s.content}>
				{!isAuth ? (
					<div className={s.links}>
						<Link className={s.link} to={'/about'}>
							About
						</Link>
						<Link className={s.link} to={'/auth/register'}>
							Sign Up
						</Link>
					</div>
				) : (
					<>
						<div className={s.searchContainer}>
							<label
								onFocus={searchVisibilityHandler}
								onBlur={searchVisibilityHandler}
								className={[s.search, isSearchActive ? s.active : ''].join(
									' '
								)}>
								<img src={searchIcon} alt='searchIcon' />
								<input
									value={searchValue}
									placeholder='Search...'
									onChange={searchHandler}
									type='text'
									name='search'
								/>
								{searchValue.length ? (
									<span onClick={resetSearch}>&times;</span>
								) : null}
							</label>
						</div>
						<Link to={'/profile'} className={s.profileLink}>
							<img className={s.img} src={avatar || avatarIcon} alt='avatar' />
							<span className={s.link}>Profile</span>
						</Link>
						<button className={s.link} onClick={logoutHandler}>
							Sign Out
						</button>
					</>
				)}
			</div>
		</div>
	);
}

export default NavBar;
