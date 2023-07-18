import { useDispatch } from 'react-redux';
import {
	resetStack,
	setCurrentDir,
	updateStack,
} from '../../reducers/fileReducer';
import s from './BreadCrumps.module.sass';

const BreadCrumps = ({ currentDir, dirStack, firstName }) => {
	const dispatch = useDispatch();

	const changeFolderHandler = dir => {
		if (!dir.id) {
			return dispatch(resetStack());
		}
		const newStack = [];
		for (let i = 0; i < dirStack.length; i++) {
			const stackDir = dirStack[i];
			if (dir.id === stackDir.id) break;
			newStack.push(stackDir);
		}
		dispatch(setCurrentDir(dir));
		dispatch(updateStack(newStack));
	};

	return (
		<div className={s.breadCrumps}>
			{dirStack.map(dir => (
				<span
					onClick={() => changeFolderHandler(dir)}
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
