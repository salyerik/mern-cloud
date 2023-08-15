import { useState } from 'react';

import useTypedSelector from '../../hooks/useTypedSelector';
import useAppDispatch from '../../hooks/useAppDispatch';

import fileAPI from '../../store/rtk-queries/file-query';
import { togglePopup } from '../../store/slices/file-slice';

import s from './Popup.module.sass';

const Popup: React.FC = () => {
	const dispatch = useAppDispatch();
	const [isCreateBtnClicked, setCreateBtnClicked] = useState(false);
	const currentDir = useTypedSelector(state => state.file.currentDir);
	const [folderName, setFolderName] = useState('');
	const [createDir] = fileAPI.useCreateDirMutation();

	const createBtnHandler = () => {
		if (folderName.trim().length === 0) {
			return alert('Folder name cannot be empty');
		}
		setCreateBtnClicked(true);
		createDir({ name: folderName, parent: currentDir.id });
	};
	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isCreateBtnClicked) setFolderName(e.target.value);
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