import React, { Component } from 'react';
import '../public/css/app.css';
import Root from '../components/layout/root';
import Home from '../components/home/index';
import IndexResult from '../components/home/indexResult';

class Index extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "",
			activeUser: false,
			hospital: "",
			step: 2
		}
	}

	handleChange = (hospital) => {
		this.setState({
			title: "홈",
			step: 1,
			activeUser: true
		});
	}

	renderContent = () => {
		if (this.state.step === 2) {
			return (
				<Home handleActiveUser={this.handleChange} />
			);
		}

		return (
			<IndexResult />
		);
	}

	render() {
		const { title, activeUser } = this.state;

		return (
			<Root
				title={title}
				activeUser={activeUser}
			>
				{this.renderContent()}
			</Root>
		);
	}
}

export default Index;