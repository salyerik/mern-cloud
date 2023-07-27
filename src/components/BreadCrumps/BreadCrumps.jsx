import { useDispatch } from 'react-redux';
import { changeFolder } from '../../store/slices/file-slice';
import s from './BreadCrumps.module.sass';

const BreadCrumps = ({ currentDir, dirStack, firstName }) => {
	const dispatch = useDispatch();

	return (
		<div className={s.breadCrumps}>
			{dirStack.map(dir => (
				<span
					onClick={() => dispatch(changeFolder(dir))}
					key={dir.id}
					className={s.breadCrump}>
					{!dir.name ? firstName : dir.name}&nbsp;&gt;&nbsp;
				</span>
			))}
			<div className={s.breadCurrent}>{currentDir.name || firstName}</div>
		</div>
	);
};

export default BreadCrumps;
