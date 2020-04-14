import React, { Component } from 'react';
import '../../../public/css/notification.css';
import Root from '../../../components/layout/root';
import EditNotificationComponent from '../../../components/roomServices/notifications/edit';
import moment from 'moment';
import { connect } from 'react-redux';
import { ROLE } from '../../../config.json';
import { checkAuth } from '../../../services/functionService';

class EditNotification extends Component {
	constructor(props) {
		super(props);

		checkAuth("rooms/notice", this.props.user, ROLE.EDIT_DELETE, true);

		this.state = {
			title: "업데이트",
			activeUser: true,
			activeUser: true, 
			id: ""
		}
	}

	componentWillMount() {
		
		if (this.props.match.params.id !== undefined) {
			this.setState({
				id: this.props.match.params.id
			});
		}
	}

	render() {
		const { title, activeUser } = this.state;

		return (
			<Root
				title={title}
				activeUser={activeUser}
			>
				<EditNotificationComponent
					sickroomManagement={this.state.dataEdit}
				/>
			</Root>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		user: state.authReducer.user.user,
	}
}
export default (connect(mapStateToProps)(EditNotification));