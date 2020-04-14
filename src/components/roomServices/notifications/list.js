import React, { Component } from 'react';
import { getNotifications, getTotalByType } from '../../services/notification';
import SearchNotification from './search';
import TableNotification from './table';

const ALL = 0;
const EMERGENCY = 1;
const LONGTIME = 2;
const SHORTTIME = 3;

class ListNotification extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listTab: [
				{ type: 0, name: "전체", value: getTotalByType(ALL), active: true },
				{ type: 1, name: "긴급", value: getTotalByType(EMERGENCY), active: false },
				{ type: 2, name: "장기", value: getTotalByType(LONGTIME), active: false },
				{ type: 3, name: "단기(대근자)", value: getTotalByType(SHORTTIME), active: false }
			],
			data: {
				body: [],
				page: 1,
				pageSz: 3,
				totalPage: 0
			},
			dataFilter: {
				departRoom: "",
				name: "",
				typeRoom: "",
				type: 0
			}
		}
	}

	componentWillMount() {
		const { page, pageSz } = this.state.data;

		this._renderData(this.state.dataFilter, page, pageSz);
	}

	_renderData = (dataFilter, page, pageSz) => {
		let dataResult = getNotifications(dataFilter, page, pageSz);

		this.setState({
			data: {
				...this.state.data,
				body: dataResult.data,
				totalPage: dataResult.totalPage
			}
		});
	}

	renderTab = () => {
		let html = [];

		this.state.listTab.map((item, index) => {
			html.push(
				<li
					key={index}
					className={item.active ? "active" : ""}
					onClick={() => this.handleClickTab(index, { type: item.type })}
				>{item.name} ({item.value})</li>
			);

			return item;
		});

		return html;
	}

	handleClickTab = (index, data) => {
		let listTab = this.state.listTab;

		listTab.map((item, key) => {
			item.active = false;

			if (index === key) {
				item.active = true;
			}

			return item;
		});

		this.setState({
			listTab,
			dataFilter: {
				...this.state.dataFilter,
				...data
			}
		}, () => {
			this._renderData(this.state.dataFilter, this.state.data.page, this.state.data.pageSz);
		});
	}

	handleChangePage = (page) => {
		this.setState({
			data: {
				...this.state.data,
				page
			}
		}, () => {
			this._renderData(this.state.dataFilter, page, this.state.data.pageSz);
		});
	}

	// handleChangeDataFilter = (data) => {
	// 	this.setState({
	// 		dataFilter: {
	// 			...this.state.dataFilter,
	// 			...data
	// 		}
	// 	});
	// }

	handleSubmitFilter = (dataSearch) => {
		const { page, pageSz } = this.state.data;

		this._renderData(this.state.dataFilter, page, pageSz);
	}

	render() {
		return (
			<div className="page-list">
				<SearchNotification
					dataFilter={this.state.dataFilter}
					// handleChangeDataFilter={this.handleChangeDataFilter}
					handleSubmitFilter={this.handleSubmitFilter}
				/>
				<div className="text-right mt-3 mr-3">
					<button
						className="btn btn-primary"
						onClick={() => this.props.handleChange({ step: 2 })}
					>공고 등록</button>
				</div>

				<ul className="list-tab d-flex">
					{this.renderTab()}
				</ul>

				<p className="tab-status">
					<span>자세히 보기</span>
					<span>|</span>
					<span>간단히 보기</span>
				</p>

				<TableNotification
					data={this.state.data}
					handleChange={this.props.handleChange}
					handleChangePage={this.handleChangePage}
				/>
			</div>
		);
	}
}

export default ListNotification;