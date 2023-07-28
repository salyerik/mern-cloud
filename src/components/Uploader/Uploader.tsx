import useAppDispatch from '../../hooks/useAppDispatch';
import useTypedSelector from '../../hooks/useTypedSelector';
import { hideUploader } from '../../store/slices/upload-slice';
import UploaderFile from '../UploaderFile';
import s from './Uploader.module.sass';

const Uploader: React.FC = () => {
	const dispatch = useAppDispatch();
	const uploadingFiles = useTypedSelector(state => state.upload.uploadingFiles);
	return (
		<section className={s.wrapper}>
			<div className={s.header}>
				<span className={s.title}>Uploads</span>
				<button onClick={() => dispatch(hideUploader())} className={s.close}>
					X
				</button>
			</div>
			{uploadingFiles.map(file => (
				<UploaderFile file={file} key={file.id} />
			))}
		</section>
	);
};

export default Uploader;
