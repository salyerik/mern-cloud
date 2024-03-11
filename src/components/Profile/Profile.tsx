import useTypedSelector from '../../hooks/useTypedSelector';
import userAPI from '../../store/rtk-queries/user-query';

import avatarIcon from '../../assets/icons/avatar.png';
import Loader from '../UI/Loader/Loader';
import s from './Profile.module.sass';

const Profile: React.FC = () => {
	const [deleteAvatar] = userAPI.useDeleteAvatarMutation();
	const [uploadAvatar, params] = userAPI.useUploadAvatarMutation();
	const currentUser = useTypedSelector(state => state.user.currentUser);
	const { avatar, firstName, lastName, isMailConfirmed } = currentUser;

	const uploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isMailConfirmed) {
			e.target.files = null;
			return alert('Please confirm your e-mail to upload avatar');
		}
		const files = e.target.files;
		if (files) uploadAvatar(files[0]);
	};

	return (
		<section className={s.wrapper}>
			<h2 className={s.title}>Profile</h2>
			<div className={s.profile}>
				{params.isLoading ? (
					<div className={s.loader}>
						<Loader />
					</div>
				) : (
					<div className={s.avatar}>
						<img
							className={[s.img, !avatar && s.imgIcon].join(' ')}
							src={avatar || avatarIcon}
							alt='avatar'
						/>
						<label className={s.updateImg}>
							<input onChange={uploadHandler} type='file' accept='image/*' />
							<span>Update Image</span>
						</label>
						<button
							className={s.deleteImg}
							onClick={() => avatar && deleteAvatar(null)}>
							Delete Image
						</button>
					</div>
				)}
				<div className={s.userInfo}>
					<div className={s.name}>
						<span>First name:</span> {firstName}
					</div>
					<div className={s.name}>
						<span>Last name:</span> {lastName}
					</div>
					<div className={s.name}>
						<span>Mail confirmation:</span>{' '}
						<span className={isMailConfirmed ? s.confirmed : s.notConfirmed}>
							{isMailConfirmed ? 'Confirmed' : 'Not Confirmed'}
						</span>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Profile;
