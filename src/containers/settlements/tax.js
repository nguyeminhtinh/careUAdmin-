import React, { Component } from 'react';
import Root from '../../components/layout/root';
import '../../public/css/settlements.css';
import TaxComponent from '../../components/settlements/tax';

class Tax extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "세금",
			subtitle: "간병인 세금에 대한 내용을 관리 할 수 있는 페이지입니다.",
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
				<TaxComponent />
			</Root>
		);
	}
}

export default Tax;