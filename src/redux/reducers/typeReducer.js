import actionTypes from '../constants/constant';

const initialState = {
	listType: {}
}

const typeReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.LIST_TYPE:
			return {
				...state,
				listType: action.payload
			}
		default:
			return state;
	}
}

export default typeReducer;