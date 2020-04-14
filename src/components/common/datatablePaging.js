import React, { Component } from "react";
import _ from "lodash";
import Pagination from './pagination';
import { PAGESIZE } from '../../config.json'

class DatatablePaging extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pageActive: 1,
			page: 1,
			pageSz: PAGESIZE,
			totalPage: 0
		};
	}

	componentWillMount() {
		const { page, pageSz, totalPage } = this.props;
		this.setState({
			page: page,
			pageSz: pageSz,
			totalPage: totalPage
		})

	}

	_renderHeader = () => {
		var heading = [];
		_.forEach(this.props.params, (data, key) => {
			heading.push(<th key={key}>{data.title}</th>);
		});
		return heading;
	}

	_renderField = (data, rowIndex) => {
		var fields = [];
		_.forEach(this.props.params, (value, key) => {
			let rowData;
			if (value.renderer) {
				rowData = value.renderer(data, value.value, rowIndex);
			} else {
				rowData = (data[value.value]);
			}
			fields.push(<td key={key}>{rowData}</td>);
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
		_.forEach(this.props.body, (data, index) => {
			let className = this.renderErrorRow(data);
			let classes = data.className;

			if (classes === undefined) {
				classes = "";
			}

			body.push(
				<tr
					key={index}
					onClick={() => this.renderFunctionClickRow(data)}
					className={className + classes}>{this._renderField(data, index)}
				</tr>
			);
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

	handleChangePage = () => {

	}

	_renderPaging = () => {
		if (this.props.totalPage > 0) {
			return (
				<Pagination
					totalPage={this.props.totalPage}
					handleChangePage={this.handleChangePage}
					pageSz={this.props.pageSz}
				/>
			);
		}
		return;
	}

	render() {
		return (
			<div className="datatable">
				<table className="table table-bordered">
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

export default DatatablePaging;
