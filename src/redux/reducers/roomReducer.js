import actionTypes from '../constants/constant';
const initialState = {
	listRoom: []
}
const roomReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_LIST_ROOM:
			return {
				...state,
				listRoom: action.payload
			}
		default:
			return state;
	}
}
export default roomReducer;