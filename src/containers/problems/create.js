import React, { Component } from 'react';
import Root from '../../components/layout/root';
import ProblemCreate from '../../components/problems/create';
import '../../public/css/handlingproblem.css';
import { connect } from 'react-redux';

class Create extends Component {
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
			<Root title={title} activeUser={activeUser} subtitle={subtitle}>
				<ProblemCreate />
			</Root>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		listArea: state.areaReducer.listArea
	}
}

export default connect(mapStateToProps)(Create);
