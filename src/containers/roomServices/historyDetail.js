import React, { Component } from 'react';
import '../../public/css/notification.css';
import Root from '../../components/layout/root';
import '../../public/css/history.css';
import HistoryDetailComponent from '../../components/roomServices/historyDetail';

class HistoyrDetail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "병실 과거상세내역",
			activeUser: true
		}
	}

	componentWillMount() {
		if (this.props.match.params.id !== undefined) {
			this.setState({
				idRoom: this.props.match.params.id
			});
		}
	}

	render() {
		const { title, activeUser } = this.state;

		return (
			<Root title={title} activeUser={activeUser}>
				<HistoryDetailComponent
					id={this.state.id}
					idRoom={this.state.idRoom}
				/>
			</Root>
		);
	}
}

export default HistoyrDetail;