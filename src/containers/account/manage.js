import React, { Component } from 'react';
import Root from '../../components/layout/root';
import '../../public/css/manageaccounts.css';
import ManageComponent from '../../components/account/manage';

class Manage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "부서/직책 관리",
			activeUser: true,
			subtitle: "담당자들이 부서/직책 을 관리 할 수 있는 페이지 입니다."
		}
	}

	render() {
		const { title, activeUser, subtitle } = this.state;

		return (
			<Root
				title={title}
				activeUser={activeUser}
				subtitle={subtitle}
			>
				<ManageComponent />
			</Root>
		);
	}
}

export default Manage;