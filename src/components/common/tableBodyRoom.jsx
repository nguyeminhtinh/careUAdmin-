import React, { Component } from "react";
import _ from "lodash";

class TableBody extends Component {
	state = {
		valueRow: 0
	};

	renderCellSpan = (conspan, item, idxRow) => {
		var arrCell = [];
		var valueRows;
		if (_.size(conspan) !== 0) {
			valueRows = _.get(item, conspan[0].path);
		}
		for (var i = 1; i < _.size(valueRows); i++) {
			var cols = _.values(valueRows[i]);
			arrCell.push(
				<tr key={this.createKey(item, conspan[i])}>
					{this.renderColumn(cols, conspan, item, idxRow)}
				</tr>
			)
		}
		return arrCell;
	}

	renderColumn = (arrValues, columns, item, idxRow) => {
		var arrCols = [];
		for (var i = 1; i < _.size(arrValues); i++) {
			if(i < 7){
				arrCols.push(
					<td key={i}>{arrValues[i]}</td>
				)
			}
			if (columns[i] !== undefined && columns[i].content) {
				arrCols.push(
					<td key={this.createKey(item, columns[i])}>{columns[i].content(item, idxRow, arrValues[0], arrValues[7], arrValues[8], arrValues[9], arrValues[3])}</td>
				);
			}
		}
		let length = _.size(arrValues);
		for (var j = length; j < _.size(columns); j++) {
			if (columns[j] !== undefined && columns[j].content) {
				arrCols.push(
					<td key={this.createKey(item, columns[j])}>{columns[j].content(item, idxRow, arrValues[0], arrValues[7], arrValues[8], arrValues[9], arrValues[3])}</td>
				);
			}
		}

		return arrCols;
	};

	renderCell = (item, column, conspan, index, idxRow) => {
		var valueRow = 0, arrValues = [];

		if (conspan !== undefined && conspan.path !== "") {
			valueRow = _.get(item, conspan.path);
			arrValues = _.values(valueRow[0]);
		}
		if (column.content && column.rowspan !== undefined) {
			return (
				<td key={this.createKey(item, column)}>{column.content(item, idxRow, arrValues[0], arrValues[7], arrValues[8], arrValues[9], arrValues[3])} </td>);
		}
		
		if (column.content && column.rowspan === undefined) {
			return (
				<td key={this.createKey(item, column)} rowSpan={valueRow.length}>{column.content(item, idxRow)} </td>);
		}

		if (column.rowspan === undefined && column.path !== "") {
			return (<td key={this.createKey(item, column)} rowSpan={valueRow.length} className={column.className}>
				{_.get(item, column.path)}
			</td>
			)
		} else {
			if (column.path !== "" && column.rowspan === true) {
				return (
					this.renderColumn(arrValues, conspan, item)
				)
			}
		}
	};

	createKey = (item, column) => {
		if (column) {
			return item.id + (column.path || column.label);
		} else {
			return item.id + column;
		}

	};

	renderBody = () => {
		const { data, columns } = this.props;
		var conspan = columns.filter(col => col.rowspan === true);

		let html = [];
		data.map((item, idxRow) => (
			html.push(
				<React.Fragment key={idxRow}>
					<tr key={idxRow}>
						{columns.map((column, index) => (
							this.renderCell(item, column, conspan[0], index, idxRow)
						))}
					</tr>
					{this.renderCellSpan(conspan, item, idxRow)}
				</React.Fragment>
			)
		));
		if (_.isFunction(this.props.renderFooterTable)) {
			html.push(this.props.renderFooterTable());
		}

		if (data.length === 0) {
			return (
				<tr key={0}>
					<td colSpan={columns.length} className="bg-white text-center">데이터가 없습니다</td>
				</tr>
			);
		}

		return html;
		
	}

	render() {
		return (
			<tbody>
				{this.renderBody()}
			</tbody>
		);
	}
}

export default TableBody;
