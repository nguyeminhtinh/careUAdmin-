import actionTypes from '../constants/constant';

const initialState = {
	data: {
		body: [],
		page: 1,
		pageSz: 3,
		totalPage: 0
	}
}

const notificationReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_NOTIFICATION:
			return {
				...state,
				data: action.payload
			}
		default:
			return state;
	}
}

export default notificationReducer;