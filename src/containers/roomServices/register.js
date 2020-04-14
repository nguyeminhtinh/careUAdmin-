import React, { Component } from 'react';
import '../../public/css/notification.css';
import Root from '../../components/layout/root';
import '../../public/css/history.css';
import RegisterComponent from '../../components/roomServices/register';

class Register extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "병실 등록",
			// (변동 금액일 경우)
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