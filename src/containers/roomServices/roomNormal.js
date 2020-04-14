import React, { Component } from 'react';
import '../../public/css/roomServices.css';
import Root from '../../components/layout/root';
import RoomStatusComponent from '../../components/roomServices/roomNormal';

class RoomStatus extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "홈",
			activeUser: true
		}
	}

	componentWillMount() {
		if (this.props.location.search.split("=")[1] !== undefined) {
			this.setState({
				id: this.props.location.search.split("=")[1]
			});
		}
	}

	render() {
		const { title, activeUser, id } = this.state;

		return (
			<Root
				title={title}
				activeUser={activeUser}
			>
				<RoomStatusComponent
					id={id}
				/>
			</Root>
		);
	}
}

export default RoomStatus;