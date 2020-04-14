import React, { Component } from 'react';
import '../../public/css/hospital.css';
import Root from '../../components/layout/root';
import UpdateHospital from '../../components/hospital/update';

class Hospital extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "병원 정보",
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
				<UpdateHospital />
			</Root>
		);
	}
}

export default Hospital;
