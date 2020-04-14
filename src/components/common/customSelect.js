import React from "react";
import Select from 'react-select';

const SelectCustom = ({ name, value, handleChangeData, dataOption }) => {
	return (
		<Select
			value={value}
			onChange={(e) => handleChangeData(name, e.value)}
			options={dataOption}
			blurInputOnSelect={true}
			isSearchable={false}
		/>
	);
};

export default SelectCustom;