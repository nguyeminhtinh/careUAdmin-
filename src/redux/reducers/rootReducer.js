import authReducer from './authReducer';
import hospitalReducer from './hospitalReducer';
import typeReducer from './typeReducer';
import notificationReducer from './notificationReducer';
import areaReducer from './areaReducer';
import userReducer from './userReducer';
import roomReducer from './roomReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
	authReducer,
	hospitalReducer,
	typeReducer,
	notificationReducer,
	areaReducer,
	userReducer,
	roomReducer
});
export default rootReducer;