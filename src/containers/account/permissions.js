import React, { Component } from 'react';
import Root from '../../components/layout/root';
import '../../public/css/manageaccounts.css';
import ManagePermissionsDetailComponent from '../../components/account/permissions';

class ManagePermissionsDetail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "권한 상세 관리",
			activeUser: true,
			newaccounts: "",
			subtitle: "병원 내의 부서, 직책 별로 페이지의 접근 권한을 관리 할 수 있는 페이지 입니다."
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
				<ManagePermissionsDetailComponent />
			</Root>
		);
	}
}

export default ManagePermissionsDetail;