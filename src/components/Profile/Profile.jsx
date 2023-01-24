import { useDispatch, useSelector } from 'react-redux'
import { deleteAvatar, uploadAvatar } from '../../actions/user'
import s from './Profile.module.sass'

import avatarIcon from '../../assets/icons/avatar.png'

const Profile = () => {
	const dispatch = useDispatch()
	const { avatar } = useSelector(state => state.user.currentUser)

	const uploadFileHandler = e => {
		dispatch(uploadAvatar(e.target.files[0]))
		e.target.value = ''
	}

	const deleteAvatarHandler = () => {
		dispatch(deleteAvatar(avatar))
	}

	return (
		<section className={s.wrapper}>
			<h2 className={s.title}>Profile</h2>
			<div className={s.avatar}>
				<img className={s.img} src={avatar || avatarIcon} alt='avatar' />
				<label className={s.updateImg}>
					<input onChange={uploadFileHandler} type='file' accept='image/*' />
					<span>Update Image</span>
				</label>
				<button className={s.deleteImg} onClick={deleteAvatarHandler}>
					Delete Image
				</button>
			</div>
		</section>
	)
}

export default Profile
