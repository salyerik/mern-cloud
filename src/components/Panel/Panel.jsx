import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { uploadFiles } from '../../services/file-service';
import { togglePopup } from '../../store/slices/app-slice';
import { popFromStack, setSort, setView } from '../../store/slices/file-slice';

import FileList from '../FileList';
import BreadCrumps from '../BreadCrumps';
import Popup from '../UI/Popup';
import Uploader from '../Uploader';

import arrowIcon from './../../assets/icons/arrow.svg';
import listIcon from './../../assets/icons/list.svg';
import plateIcon from './../../assets/icons/plate.svg';
import s from './Panel.module.sass';

const Panel = () => {
	const dispatch = useDispatch();
	const { firstName, lastName } = useSelector(state => state.user.currentUser);
	const { currentDir, dirStack, sort } = useSelector(state => state.file);
	const { isUploaderVisible } = useSelector(state => state.upload);
	const { isPopupVisible } = useSelector(state => state.app);
	const [dragEnter, setDragEnter] = useState(false);

	const viewHandler = e => {
		const target = e.target;
		dispatch(setView(target.dataset.view || target.parentElement.dataset.view));
	};

	const uploadFilesHandler = e => {
		dispatch(uploadFiles([...e.target.files], currentDir.id));
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
		dispatch(uploadFiles([...e.dataTransfer.files], currentDir.id));
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
								onClick={viewHandler}
								data-view='plate'>
								<img src={plateIcon} alt='plateIcon' />
							</button>
							<button
								className={[s.viewBtns, s.listBtn].join(' ')}
								onClick={viewHandler}
								data-view='list'>
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
