import { useSelector } from 'react-redux';
import userAPI from '../../store/rtk-queries/user-query';

import avatarIcon from '../../assets/icons/avatar.png';
import Loader from '../UI/Loader/Loader';
import s from './Profile.module.sass';

const Profile = () => {
	const [deleteAvatar] = userAPI.useDeleteAvatarMutation();
	const [uploadAvatar, params] = userAPI.useUploadAvatarMutation();
	const currentUser = useSelector(state => state.user.currentUser);
	const { avatar, firstName, lastName } = currentUser;

	return (
		<section className={s.wrapper}>
			<h2 className={s.title}>Profile</h2>
			{params.isLoading ? (
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
								onChange={e => uploadAvatar(e.target.files[0])}
								type='file'
								accept='image/*'
							/>
							<span>Update Image</span>
						</label>
						<button className={s.deleteImg} onClick={deleteAvatar}>
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
