import React, { Component } from "react";
import _ from "lodash";
import Pagination from './pagination';

class Datatable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pageActive: 1,
			rowActive: ''
		};
	}

	_renderHeader = () => {
		var heading = [];
		_.forEach(this.props.params, (data, key) => {
			if (data.isHide) {
				heading.push(<th key={key} className="d-none">{data.title}</th>);
			} else {
				heading.push(<th key={key}>{data.title}</th>);
			}

		});
		return heading;
	}

	_renderField = (data, rowIndex) => {
		var fields = [];
		_.forEach(this.props.params, (value, key) => {
			let rowData;
			let classes = value.className;

			if (value.renderer) {
				rowData = value.renderer(data, value.value, rowIndex);
			} else {
				rowData = (data[value.value]);
			}

			if (classes) {
				fields.push(<td key={key} className={classes}>{rowData}</td>);
			} else {
				fields.push(<td key={key}>{rowData}</td>);
			}
		});

		return fields;
	}

	renderErrorRow = (data) => {
		if (_.isFunction(this.props.renderErrorRow)) {
			return this.props.renderErrorRow(data);
		}

		return '';
	}

	renderFunctionClickRow = (data) => {
		if (_.isFunction(this.props.handleClickRow)) {
			return this.props.handleClickRow(data);
		}

		return;
	}

	_renderBody = () => {
		var body = [];
		var rowActive = this.props.dataIdActive;
		_.forEach(this.props.body, (data, index) => {
			let className = this.renderErrorRow(data);
			let classes = data.className;
			if (classes === undefined) {
				classes = "";
			}
			if (rowActive !== '' && data.id === this.props.dataIdActive) {
				body.push(
					<tr
						key={index}
						data-id={data.id}
						onDoubleClick={this.props._handleDoubleClickItem}
						onClick={() => this.renderFunctionClickRow(data)}
						className='active'>{this._renderField(data, index)}
					</tr>
				);
			} else {
				body.push(
					<tr
						onDoubleClick={this.props._handleDoubleClickItem}
						key={index}
						data-id={data.id}
						onClick={() => this.renderFunctionClickRow(data)}
						className={className + classes}>{this._renderField(data, index)}
					</tr>
				);
			}
			
		});

		if (body.length === 0) {
			return (
				<tr key={0}>
					<td colSpan={this.props.params.length} className="bg-white text-center">데이터가 없습니다</td>
				</tr>
			);
		}

		return body;
	}

	_renderPaging = () => {
		const { page, pageSz, totalPage } = this.props;

		if (totalPage > 0) {
			return (
				<Pagination
					totalPage={totalPage}
					handleChangePage={this.props.handleChangePage}
					page={page}
					pageSz={pageSz}
				/>
			);
		}
	}

	render() {
		return (
			<div className="datatable">
				<table className="table table-bordered" id="tableA">
					<thead>
						<tr>
							{this._renderHeader()}
						</tr>
					</thead>
					<tbody>
						{this._renderBody()}
					</tbody>
				</table>
				{this._renderPaging()}
			</div>
		);
	}
}

export default Datatable;
