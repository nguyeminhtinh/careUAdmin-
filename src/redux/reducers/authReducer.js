import actionTypes from '../constants/constant';

const initialState = {
	user: {}
}

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.DO_LOGIN:
			return {
				...state,
				user: action.payload
			}
		case actionTypes.DO_LOGOUT:
			return {
				...state,
				user: initialState.user
			}
		default:
			return state;
	}
}

export default authReducer;