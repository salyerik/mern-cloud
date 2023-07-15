export const nameCutter = (name, length) => {
	if (name.length <= length) return name;
	const nameArr = name.split('');
	nameArr.length = length - 3;
	return nameArr.join('') + '...';
};
