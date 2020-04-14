import React, { Component } from 'react';
import Root from '../../components/layout/root';
import ProblemUpdate from '../../components/problems/update';
import '../../public/css/handlingproblem.css';

class Edit extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "사고 처리",
			subtitle: "병원에서 사고 발생 시, 사고에 대한 내용 등록 및 관리를 할 수 있는 페이지입니다.",
            activeUser: true,
            id: ""
		}
    }
    
    componentWillMount() {
        if (this.props.match.params.id !== undefined) {
            this.setState({
                id: this.props.match.params.id
            });
		}
    }

	render() {
		const { title, subtitle, activeUser } = this.state;

		return (
			<Root title={title} activeUser={activeUser} subtitle={subtitle}>
				<ProblemUpdate
                    id={this.state.id}
                />
			</Root>
		);
	}
}

export default Edit;