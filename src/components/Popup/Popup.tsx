import { useState } from 'react';

import useTypedSelector from '../../hooks/useTypedSelector';
import useAppDispatch from '../../hooks/useAppDispatch';

import fileAPI from '../../store/rtk-queries/file-query';
import { togglePopup } from '../../store/slices/file-slice';

import s from './Popup.module.sass';

const Popup: React.FC = () => {
	const dispatch = useAppDispatch();
	const currentDir = useTypedSelector(state => state.file.currentDir);
	const [folderName, setFolderName] = useState('');
	const [createDir, createDirParams] = fileAPI.useCreateDirMutation();

	const createBtnHandler = () => {
		if (folderName.trim().length === 0) {
			return alert('Folder name cannot be empty');
		}
		createDir({ name: folderName, parent: currentDir.id });
	};
	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!createDirParams.isLoading) setFolderName(e.target.value);
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
						disabled={createDirParams.isLoading}
						onClick={createBtnHandler}
						className={[
							s.createBtn,
							createDirParams.isLoading && s.createBtnActive,
						].join(' ')}>
						Create
					</button>
				</div>
			</div>
		</section>
	);
};

export default Popup;
