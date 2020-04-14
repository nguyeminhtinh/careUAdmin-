import React, { Component } from 'react';
import '../../public/css/notification.css';
import Root from '../../components/layout/root';
import '../../public/css/history.css';
import ListHandlingProblem from '../../components/problems/list';

class List extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "사고 처리",
			subtitle: "병원에서 사고 발생 시, 사고에 대한 내용 등록 및 관리를 할 수 있는 페이지입니다.",
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
				<ListHandlingProblem />
			</Root>
		);
	}
}

export default List;