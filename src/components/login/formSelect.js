import React, { Component } from 'react';

class FormSelect extends Component {
	renderOption = () => {
		let html = [];

		this.props.data.map((item, index) => {
			html.push(
				<option
					value={item}
					key={index}
				>
					{item}
				</option>
			);
			return item;
		});

		return html;
	}

	render() {
		return (
			<select
				name={this.props.name}
				onChange={(e) => this.props.handleChange(this.props.name, e.target.value)}
				className={this.props.className}
			>
				{this.renderOption()}
			</select>
		);
	}
}

export default FormSelect;
