import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import { togglePopup } from '../../store/slices/file-slice';
import { popFromStack, setSort, setView } from '../../store/slices/file-slice';
import fileAPI from '../../store/rtk-queries/file-query';

import FileList from '../FileList';
import BreadCrumps from '../BreadCrumps';
import Popup from '../Popup';
import Uploader from '../Uploader';

import arrowIcon from './../../assets/icons/arrow.svg';
import listIcon from './../../assets/icons/list.svg';
import plateIcon from './../../assets/icons/plate.svg';
import s from './Panel.module.sass';

const Panel = () => {
	const dispatch = useDispatch();
	const { firstName, lastName } = useSelector(state => state.user.currentUser);
	const { currentDir, dirStack, sort, isPopupVisible } = useSelector(
		state => state.file
	);
	const { isUploaderVisible } = useSelector(state => state.upload);
	const [dragEnter, setDragEnter] = useState(false);
	const [uploadFiles] = fileAPI.useUploadFilesMutation();

	const uploadFilesHandler = e => {
		uploadFiles({ files: [...e.target.files], parent: currentDir.id });
		e.target.value = '';
	};

	const dragEnterHandler = e => {
		e.preventDefault();
		if (!dragEnter) setDragEnter(true);
	};
	const dragLeaveHandler = e => {
		e.preventDefault();
		if (dragEnter) setDragEnter(false);
	};
	const dropHandler = e => {
		e.preventDefault();
		setDragEnter(false);
		uploadFiles([...e.dataTransfer.files], currentDir.id);
		e.target.value = '';
	};

	return (
		<section
			className={s.wrapper}
			onDragEnter={dragEnterHandler}
			onDragLeave={dragLeaveHandler}>
			{dragEnter ? (
				<div
					onDrop={dropHandler}
					onDragOver={dragEnterHandler}
					className={s.drag}>
					Upload Files
				</div>
			) : (
				<>
					<h2 className={s.title}>
						{firstName + ' ' + lastName + "'s " + 'Files'}
					</h2>
					<div className={s.top}>
						<div className={s.btns}>
							<button
								onClick={() => dirStack.length && dispatch(popFromStack())}
								className={[s.btn, s.btn__back].join(' ')}>
								<img src={arrowIcon} alt='arrowIcon' />
							</button>
							<button
								className={[s.btn, s.btn__create].join(' ')}
								onClick={() => dispatch(togglePopup())}>
								Create Folder
							</button>
							<label onChange={uploadFilesHandler} className={s.label}>
								<span>Upload File</span>
								<input type='file' multiple />
							</label>
						</div>
						<div className={s.views}>
							<div className={s.sortBlock}>
								<span>Sort: </span>
								<select
									defaultValue={sort}
									onChange={e => dispatch(setSort(e.target.value))}>
									<option value='type'>Type</option>
									<option value='name'>Name</option>
									<option value='date'>Date</option>
									<option value='size'>Size</option>
								</select>
							</div>
							<button
								className={[s.viewBtns, s.plateBtn].join(' ')}
								onClick={() => dispatch(setView('plate'))}>
								<img src={plateIcon} alt='plateIcon' />
							</button>
							<button
								className={[s.viewBtns, s.listBtn].join(' ')}
								onClick={() => dispatch(setView('list'))}>
								<img src={listIcon} alt='listIcon' />
							</button>
						</div>
					</div>
					<BreadCrumps
						currentDir={currentDir}
						dirStack={dirStack}
						firstName={firstName}
					/>
					<FileList />
					{isPopupVisible && <Popup />}
					{isUploaderVisible && <Uploader />}
				</>
			)}
		</section>
	);
};

export default Panel;
