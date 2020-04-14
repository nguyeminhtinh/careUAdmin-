import React, { Component } from 'react';
import '../../public/css/notification.css';
import Root from '../../components/layout/root';
import '../../public/css/history.css';
import HistoryComponent from '../../components/roomServices/history';

class History extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "병실 과거내역",
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
				<HistoryComponent />
			</Root>
		);
	}
}

export default History;