import actionTypes from '../constants/constant';
const initialState = {
	listArea: []
}
const areaReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_LIST_AREA:
			console.log(action)
			return {
				...state,
				listArea: action.payload
			}
		default:
			return state;
	}
}
export default areaReducer;