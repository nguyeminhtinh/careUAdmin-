import React, { Component } from 'react';
import '../../public/css/register.css';
import { TYPE_USER } from '../../config.json';
import ChooseUser from '../../components/register/chooseUser';
import UserRegister from '../../components/register/register';
import Notification from '../../components/register/notification';

class Register extends Component {
	constructor(props) {
		super(props);

		this.state = {
			step: 1,
			type_user: TYPE_USER.MASTER,
			dataResult: {}
		}
	}

	handleChange = (data) => {
		this.setState({
			...this.state,
			...data
		});
	}

	renderContent = (step) => {
		const { type_user, dataResult } = this.state;

		switch (step) {
			case 1:
				return (
					<ChooseUser
						type_user={type_user}
						handleChange={this.handleChange}
					/>
				);
			case 2:
				return (
					<UserRegister
						type_user={type_user}
						handleChange={this.handleChange}
					/>
				);
			case 3:
				return (
					<Notification
						type_user={type_user}
						dataResult={dataResult}
					/>
				);
			default:
				break;
		}
	}

	render() {
		return (
			<div className="bg-white">
				{this.renderContent(this.state.step)}
			</div>
		);
	}
}

export default Register;