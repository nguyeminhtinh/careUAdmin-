import React, { Component } from 'react';
import Root from '../../components/layout/root';
import '../../public/css/manageaccounts.css';
import ManageNewAccountsComponent from '../../components/account/request';

class ManageNewAccounts extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "요청 계정 관리",
			activeUser: true,
			newaccounts: "",
			subtitle: "담당자들이 신청한 계정들을 관리 할 수 있는 페이지 입니다.",
		}
	}

	render() {
		const { title, newaccounts, activeUser, subtitle } = this.state;

		return (
			<Root
				title={title}
				newaccounts={newaccounts}
				activeUser={activeUser}
				subtitle={subtitle}
			>
				<ManageNewAccountsComponent />
			</Root>
		);
	}
}

export default ManageNewAccounts;