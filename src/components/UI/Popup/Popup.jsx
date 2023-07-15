import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createDir } from '../../../services/file';
import { togglePopup } from '../../../reducers/appReducer';
import { addFile } from '../../../reducers/fileReducer';

import s from './Popup.module.sass';

const Popup = () => {
	const [isClicked, setClicked] = useState(false);
	const dispatch = useDispatch();
	const { currentDir } = useSelector(state => state.file);
	const [folderName, setFolderName] = useState('');
	const createBtnHandler = () => {
		setClicked(true);
		createDir(folderName, currentDir.id).then(data => {
			setFolderName('');
			dispatch(togglePopup());
			dispatch(addFile(data));
		});
	};
	const inputChangeHandler = e => {
		if (isClicked) setClicked(false);
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
						disabled={isClicked}
						onClick={createBtnHandler}
						className={[s.createBtn, isClicked && s.createBtnActive].join(' ')}>
						Create
					</button>
				</div>
			</div>
		</section>
	);
};

export default Popup;
