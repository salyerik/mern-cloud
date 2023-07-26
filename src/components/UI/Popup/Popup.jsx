import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createDir } from '../../../services/file-service';
import { togglePopup } from '../../../store/slices/app-slice';
import { addFile } from '../../../store/slices/file-slice';

import s from './Popup.module.sass';

const Popup = () => {
	const dispatch = useDispatch();
	const [isCreateBtnClicked, setCreateBtnClicked] = useState(false);
	const currentDir = useSelector(state => state.file.currentDir);
	const [folderName, setFolderName] = useState('');
	const createBtnHandler = () => {
		if (folderName.trim().length === 0) {
			return alert('Folder name cannot be empty');
		}
		setCreateBtnClicked(true);
		createDir(folderName, currentDir.id).then(data => {
			setFolderName('');
			dispatch(togglePopup());
			dispatch(addFile(data));
		});
	};
	const inputChangeHandler = e => {
		if (isCreateBtnClicked) setCreateBtnClicked(false);
		setFolderName(e.target.value);
	};

	return (
		<section className={s.wrapper} onClick={() => dispatch(togglePopup())}>
			<div className={s.content} onClick={e => e.stopPropagation()}>
				<div className={s.header}>
					<div className={s.title}>Create Folder</div>
					<button
						className={s.closeBtn}
						onClick={() => dispatch(togglePopup())}>
						&times;
					</button>
				</div>
				<div className={s.middle}>
					<input
						onChange={inputChangeHandler}
						value={folderName}
						className={s.input}
						placeholder='Enter folder name...'
					/>
					<button
						disabled={isCreateBtnClicked}
						onClick={createBtnHandler}
						className={[
							s.createBtn,
							isCreateBtnClicked && s.createBtnActive,
						].join(' ')}>
						Create
					</button>
				</div>
			</div>
		</section>
	);
};

export default Popup;
