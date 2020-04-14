import actionTypes from '../constants/constant';

const initialState = {
	hospital: {},
	listHospital: [],
	listCourses: [],
	listMedicals: [],
	listTypes: []
}

const hospitalReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_HOSPITAL:
			return {
				...state,
				hospital: action.payload
			}
		case actionTypes.GET_LIST_HOSPITAL:
			return {
				...state,
				listHospital: action.payload
			}
		case actionTypes.GET_LIST_COURSES:
			return {
				...state,
				listCourses: action.payload
			}
		case actionTypes.GET_LIST_MEDICALS:
			return {
				...state,
				listMedicals: action.payload
			}
		case actionTypes.GET_LIST_TYPES:
			return {
				...state,
				listTypes: action.payload
			}
		default:
			return state;
	}
}

export default hospitalReducer;