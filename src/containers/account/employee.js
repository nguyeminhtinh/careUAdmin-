import React, { Component } from 'react';
import '../../public/css/notification.css';
import Root from '../../components/layout/root';
import '../../public/css/history.css';
import EmployeeAccountComponent from '../../components/account/employee';

class HistoyrDetail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "직원 계정 관리",
			subtitle: "병원 내 담당자들의 계정을 관리 할 수 있는 페이지 입니다.",
			activeUser: true
		}
	}

	render() {
		const { title, subtitle, activeUser } = this.state;

		return (
			<Root
				title={title}
				activeUser={activeUser}
				subtitle={subtitle}
			>
				<EmployeeAccountComponent />
			</Root>
		);
	}
}

export default HistoyrDetail;