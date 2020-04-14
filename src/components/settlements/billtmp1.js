import React, { Component } from 'react';
import moment from 'moment';
import BillTable from './billTable';
import Select from 'react-select';
import { getRooms } from '../../services/bill';
import { formatNumber } from '../../services/functionService';
import { PAGESIZEMODAL } from '../../config.json';
import { connect } from 'react-redux';

class Bill extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dataFilter: {
				year: moment().format('YYYY'),
				month: parseInt(moment().format('MM')) - 1
			},
			selectData: {
				year: moment().format('YYYY'),
				month: parseInt(moment().format('MM')) - 1
			},
			data: {
				body: [],
				totalPage: 0,
				page: 1,
				pageSz: PAGESIZEMODAL
			},
			total: {
				totalAmount: 0,
				numberRows: 0
			},
			isActive: true
		}
	}

	async componentWillMount() {
		const { page, pageSz } = this.state.data;
		const { year, month } = this.state.dataFilter;
		if (this.props.hospital_id) {
			this._renderData(year, month, page, pageSz, this.props.hospital_id);
		}
			
	}

	_renderData = async (year, month, page, pageSz, id) => {
		try {
		let dataResult = await getRooms(year, month, page, pageSz, this.props.hospital_id);
		this.setState({
			isActive: false,
			data: {
				...this.state.data,
				body: dataResult ? dataResult.data : [],
				totalPage: dataResult ? dataResult.totalPage : 0,
			},
			total: {
				totalAmount: dataResult ? dataResult.total : 0,
				numberRows: dataResult ? dataResult.aide : 0
			}
		});
		} catch (ex) {
			console.log(ex);
		}
	}

	handleChangePage = (page) => {
		const { year, month } = this.state.dataFilter;

		this.setState({
			data: {
				...this.state.data,
				page
			}
		}, () => {
			this._renderData(year, month, page, this.state.data.pageSz, this.props.hospital_id);
		});
	}

	onHandleChange = (data) => {
		this.setState({
			selectData: {
				...this.state.selectData,
				...data
			}
		});
	}

	renderOptionYear = () => {
		let year = moment().format('YYYY');

		let html = [];

		for (let i = 0; i <= 1; i++) {
			html.push({
				value: year - i,
				label: year - i + '년'
			});
		}

		return html;
	}

	renderOptionMonth = () => {
		let year = this.state.selectData.year;
		let yearCurrent = moment().format('YYYY');
		let monthCurrent = moment().format('MM');
		let length = 12;
		let html = [];


		if (parseInt(year) === parseInt(yearCurrent)) {
			length = parseInt(monthCurrent);
		}

		for (let i = 1; i <= parseInt(length); i++) {
			html.push({
				value: i,
				label: i + '월'
			});
		}

		return html;
	}

	hanleSubmit = () => {
		const { pageSz } = this.state.data;
		const { year, month } = this.state.selectData;

		this.setState({
			dataFilter: this.state.selectData,
			isActive: true
		}, () => {
			this._renderData(year, month, 1, pageSz, this.props.hospital_id);
		});
	}

	

	render() {
		const { totalAmount, numberRows } = this.state.total;
		return (
			<div className="page-bill">
				<div className="header-search page-report">
					<h5>현재 근무중인 간병인 수 : {formatNumber(numberRows)} 명</h5>
					<h5>총 정산 금액  : {formatNumber(totalAmount)} 원</h5>
					<div className="d-flex">
						<label>기간: <i className="fa fa-calendar mx-2"></i></label>
						<Select
							className="selectbill"
							defaultValue={this.renderOptionYear()[0]}
							options={this.renderOptionYear()}
							onChange={(e) => this.onHandleChange({ year: e.value })}
							blurInputOnSelect={true}
							isSearchable={false}
						/>
						<Select
							className="selectbill"
							defaultValue={this.renderOptionMonth()[this.renderOptionMonth().length - 2] || { value: 1, label: "1월" }}
							options={this.renderOptionMonth()}
							onChange={(e) => this.onHandleChange({ month: e.value })}
							blurInputOnSelect={true}
							isSearchable={false}
						/>
						<button
							className="btn btn-primary"
							onClick={this.hanleSubmit}
						>청구서 조회</button>
					</div>
				</div>
					<BillTable
						isActive={this.state.isActive}
						data={this.state.data}
						totalAmount={this.state.total.totalAmount}
						dataFilter={this.state.dataFilter}
						handleChangePage={this.handleChangePage}
						renderFooterTable={this.renderFooterTable}
					/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		hospital_id: state.authReducer.user.user.hospital === null ? null : state.authReducer.user.user.hospital.id
	}
}

export default connect(mapStateToProps)(Bill);