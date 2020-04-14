import actionTypes from '../constants/constant';

export const doLogin = (data) => {
	return {
		type: actionTypes.DO_LOGIN,
		payload: data,
	};
};

export const doLogout = (data) => {
	return {
		type: actionTypes.DO_LOGOUT,
		payload: data,
	};
};

export const getHospital = (data) => {
	return {
		type: actionTypes.GET_HOSPITAL,
		payload: data,
	};
};

export const getListHospital = (data) => {
	return {
		type: actionTypes.GET_LIST_HOSPITAL,
		payload: data,
	};
};

export const getListType = (data) => {
	return {
		type: actionTypes.LIST_TYPE,
		payload: data,
	};
};

export const getListNotification = (data) => {
	return {
		type: actionTypes.GET_NOTIFICATION,
		payload: data,
	};
};

export const updateProfile = (data) => {
	return {
		type: actionTypes.UPDATE_PROFILE,
		payload: data
	}
}

export const getListArea = (data) => {
	return {
		type: actionTypes.GET_LIST_AREA,
		payload: data,
	};
};

export const getListMedicals = (data) => {
	return {
		type: actionTypes.GET_LIST_MEDICALS,
		payload: data,
	};
};

export const getListCourses = (data) => {
	return {
		type: actionTypes.GET_LIST_COURSES,
		payload: data,
	};
};

export const getListRoom = (data) => {
	return {
		type: actionTypes.GET_LIST_ROOM,
		payload: data,
	};
};

export const getListTypes = (data) => {
	return {
		type: actionTypes.GET_LIST_TYPES,
		payload: data,
	};
};
