import React, { Component } from 'react';
import '../../public/css/notification.css';
import Root from '../../components/layout/root';
import RegisterComponent from '../../components/roomServices/sickroomRegister';

class Register extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "변동금액인 경우",
			activeUser: true
		}
	}

	render() {
		const { title, activeUser } = this.state;

		return (
			<Root
				title={title}
				activeUser={activeUser}
			>
				<RegisterComponent />
			</Root>
		);
	}
}

export default Register;