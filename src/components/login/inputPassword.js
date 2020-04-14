import React, { Component } from 'react';

class InputPassword extends Component {
	state = {
		show: false
	}

	handleMasking = () => {
		this.setState({
			show: !this.state.show
		});
	}

	render() {
		return (
			<div className="input-custom">
				<input
					type={this.state.show ? "text" : "password"}
					className={this.props.className}
					name={this.props.name}
					placeholder={this.props.placeholder}
					value={this.props.value}
					onChange={(e) => this.props.handleChange ? this.props.handleChange(this.props.name, e.target.value) : ""}
					onBlur={this.props.handleOnBlur}
				/>
				<i className="fa fa-eye" onClick={this.handleMasking} />
			</div>
		);
	}
}

export default InputPassword;