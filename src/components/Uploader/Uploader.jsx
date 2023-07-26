import { useDispatch, useSelector } from 'react-redux';
import { hideUploader } from '../../store/slices/upload-slice';
import UploaderFile from '../UploaderFile';
import s from './Uploader.module.sass';

const Uploader = () => {
	const dispatch = useDispatch();
	const uploadFiles = useSelector(state => state.upload.uploadFiles);
	return (
		<section className={s.wrapper}>
			<div className={s.header}>
				<span className={s.title}>Uploads</span>
				<button onClick={() => dispatch(hideUploader())} className={s.close}>
					X
				</button>
			</div>
			{uploadFiles.map(file => (
				<UploaderFile file={file} key={file.id} />
			))}
		</section>
	);
};

export default Uploader;
