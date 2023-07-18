import { useDispatch, useSelector } from 'react-redux';
import { deleteAvatar, uploadAvatar } from '../../services/user-service';
import s from './Profile.module.sass';

import avatarIcon from '../../assets/icons/avatar.png';
import { useEffect, useState } from 'react';
import Loader from '../UI/Loader/Loader';

const Profile = () => {
	const dispatch = useDispatch();
	const [isUpdating, setUpdating] = useState(false);
	const { avatar, firstName, lastName } = useSelector(
		state => state.user.currentUser
	);

	const uploadFileHandler = e => {
		setUpdating(true);
		dispatch(uploadAvatar(e.target.files[0], setUpdating));
		e.target.value = '';
	};

	return (
		<section className={s.wrapper}>
			<h2 className={s.title}>Profile</h2>
			{isUpdating ? (
				<div className={s.loader}>
					<Loader />
				</div>
			) : (
				<div className={s.profile}>
					<div className={s.avatar}>
						<img
							className={[s.img, !avatar && s.imgIcon].join(' ')}
							src={avatar || avatarIcon}
							alt='avatar'
						/>
						<label className={s.updateImg}>
							<input
								onChange={uploadFileHandler}
								type='file'
								accept='image/*'
							/>
							<span>Update Image</span>
						</label>
						<button
							className={s.deleteImg}
							onClick={() => dispatch(deleteAvatar(avatar))}>
							Delete Image
						</button>
					</div>
					<div className={s.userInfo}>
						<div className={s.name}>
							<span>First name:</span> {firstName}
						</div>
						<div className={s.name}>
							<span>Last name:</span> {lastName}
						</div>
					</div>
				</div>
			)}
		</section>
	);
};

export default Profile;
