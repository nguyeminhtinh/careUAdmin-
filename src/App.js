import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import index from "./containers/index";
import Login from './containers/login/login';
import FindId from "./containers/findId/findId";
import ReturnId from "./containers/returnId/returnId";
import FindPassword from './containers/findPassword/findPassword';
import Register from './containers/register/register';
import ResetPassword from './containers/resetpassword/resetPassword';
import ReturnPassword from './containers/resetpassword/returnPassword';
import Hospital from './containers/hospital/update';
import Profile from './containers/profile/edit';
import RoomStatus from './containers/roomServices/roomStatus';
import RoomNormal from './containers/roomServices/roomNormal';

import ListNotification from './containers/roomServices/notifications/list';
import CreateNotification from './containers/roomServices/notifications/create';
import EditNotification from './containers/roomServices/notifications/edit';

import History from './containers/roomServices/history';
import HistoryDetail from './containers/roomServices/historyDetail';
import ManagePermissionsDetail from './containers/account/permissions';
import Bill from './containers/settlements/bill';
import Tax from './containers/settlements/tax';

import RequestAccounts from './containers/account/request';
import EmployeeAccounts from './containers/account/employee';

import Manage from './containers/account/manage';
import handlingProblem from './containers/problems/list';
import RegisterRoom from './containers/roomServices/register';
import SickroomRegister from './containers/roomServices/sickroomRegister';
import PermissionsEdit from './containers/account/permissionsEdit';

import ProblemCreate from './containers/problems/create';
import ProblemUpdate from './containers/problems/edit';
import ExportExcel from './containers/exportExcel';
import PageNotFound from './containers/pageNotFound/pageNotFound';
import { Master, OnlyMaster } from './helpers/role';

const App = () => {
	var moment = require('moment-timezone');
	moment.tz.setDefault('Asia/Seoul');
	return (
		<Router>
			<Switch>
				/*---- Auth -----*/
				<Route path="/login" component={Login} />
				<Route path="/find-id" component={FindId} />
				<Route path="/find-id-success" component={ReturnId} />
				<Route path="/find-password" component={FindPassword} />
				<Route path="/register" component={Register} />
				<Route path="/reset-password/:code" component={ResetPassword} />
				<Route path="/reset-password-error" component={ReturnPassword} />

				/*---- Profile -----*/
				<Route path="/profile" component={Profile} />

				/*---- Hospitals -----*/				
				<Route path="/hospitals" component={Hospital} />
				
				/*---- Homepage -----*/
				<Route exact path="/" component={RoomNormal} />
				<Route path="/home-waiting" component={index} />

				/*---- Rooms -----*/
				<Route path="/rooms/status" component={RoomStatus} />

				<Route path="/rooms/notice/create" component={CreateNotification} />
				<Route path="/rooms/notice/edit/:id/:type" component={EditNotification} />
				<Route path="/rooms/notice" component={ListNotification} />

				<Route path="/rooms/register" component={RegisterRoom} />
				<Route path="/rooms/sickroomRegister" component={SickroomRegister} />
				<Route exact path="/rooms/history" component={History} />
				<Route path="/rooms/history/:id" component={HistoryDetail} />

				/*---- Settlements -----*/
				<Route path="/settlements/bill" component={Bill} />
				<Route path="/settlements/tax" component={Tax} />

				/*---- Accounts -----*/
				<Route path="/accounts/permissions/edit/:id" component={PermissionsEdit} />
				<Route path="/accounts/permissions" component={ManagePermissionsDetail} />
				<Route path="/accounts/request" component={RequestAccounts} />//OnlyMaster
				<Route path="/accounts/employee" component={EmployeeAccounts} /> //OnlyMaster
				<Route path="/accounts/department-position" component={Manage} /> //OnlyMaster

				/*---- Problems -----*/
				<Route path="/problems/update/:id" component={ProblemUpdate} />
				<Route path="/problems/create" component={ProblemCreate} /> //OnlyMaster
				<Route path="/problems" component={handlingProblem} /> //Master

				<Route path="/exportexcel" component={ExportExcel} />
				<Route component={PageNotFound} />
			</Switch>
		</Router>
	);
};

export default App;