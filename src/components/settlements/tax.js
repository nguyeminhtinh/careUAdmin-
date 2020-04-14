import React, { Component } from 'react';
import moment from 'moment';
import TaxTable from './taxTable';
import { getTaxs } from '../../services/tax';
import { PAGESIZEMODAL, ROLE } from '../../config.json';
import Select from 'react-select';
import { formatNumber, checkAuth } from '../../services/functionService';
import { connect } from 'react-redux';


class Tax extends Component {
	constructor(props) {
		super(props);

		checkAuth("settlements/tax", this.props.user, ROLE.VIEW, true);

		this.state = {
			dataFilter: {
				year: moment().format('YYYY'),
				month: parseInt(moment().format('MM'))
			},
			selectData: {
				year: moment().format('YYYY'),
				month: parseInt(moment().format('MM'))
			},
			data: {
				body: [],
				page: 1,
				pageSz: PAGESIZEMODAL,
				totalPage: 0
			},
			total: {
				tax: 0,
				numberRows: 0
			},
			footer:{
				total: 0,
				taxcode: 0,
				avg: 0
			},
			isActive: true,
			show: false
		}
	}

	async componentWillMount() {
		const { page, pageSz } = this.state.data;
		if (this.props.hospital_id) {
			this.renderData(this.state.dataFilter, page, pageSz, this.props.hospital_id);
		}
	}

	renderData = async (dataFilter, page, pageSz, id) => {
		try {
			let dataResult = await getTaxs(dataFilter, page, pageSz, id);
			this.setState({
				data: {
					...this.state.data,
					body: dataResult.data,	
					totalPage: dataResult.totalPage
				},
				total: {
					tax: dataResult ? dataResult.total : 0,
					numberRows: dataResult.aide ? dataResult.aide : 0
				},
				footer: {
					total: dataResult ? dataResult.total : 0,
					taxcode: dataResult ? dataResult.total_taxcode : 0,
					avg: dataResult ? dataResult.avg_taxcode : 0
				},
				 isActive: false,
				 show:  dataResult.data.length > 0 ? true : false
			});
		} catch (ex) {
			console.log(ex);
		}
	}

	onHandleChange = (data) => {
		this.setState({
			selectData: {
				...this.state.selectData,
				...data
			}
		});
	}

	handleChangePage = (page) => {
		this.setState({
			data: {
				...this.state.data,
				page: page
			}
		}, () => {
			this.renderData(this.state.dataFilter, page, this.state.data.pageSz, this.props.hospital_id);
		});
		window.scrollTo(0, 0)
	}

	hanleSubmit = () => {
		this.setState({
			dataFilter: this.state.selectData,
			data: {
				...this.state.data,
				page: 1
			},
			isActive: true
		}, () => {
			this.renderData(this.state.dataFilter, this.state.data.page, this.state.data.pageSz, this.props.hospital_id);
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
		let html = [{value: '', label: '선택'}];


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

	renderTableTax = () => {
		return (
			<TaxTable
				data={this.state.data}
				handleChangePage={this.handleChangePage}
				dataFilter={this.state.dataFilter}
				total={this.state.total}
			/>
		);
	}

	renderFooterTable = () => {
		return (
			<tr key="fooTer1">
				<td colSpan="2" className="tableFooter"><strong>총합계</strong></td>
				<td className="tableFooter"><span>{formatNumber(this.state.footer.avg)}</span></td>
				<td className="tableFooter"><span>{formatNumber(this.state.footer.total)}</span></td>
				<td className="tableFooter"><span>{formatNumber(this.state.footer.taxcode)}</span></td>
				<td colSpan="2"></td>
			</tr>
		);
	}

	render() {
		const { tax, numberRows } = this.state.total;
		return (
			<div className="page-bill">
				<div className="header-search page-report">
					<h5>현재 근무중인 간병인 수 : {numberRows} 명</h5>
					<h5>총 세금 액 : {formatNumber(tax)} 원</h5>
					<div className="d-flex">
						<label>기간: <i className="fa fa-calendar mx-2"></i></label>
						<Select
							defaultValue={this.renderOptionYear()[0]}
							options={this.renderOptionYear()}
							onChange={(e) => this.onHandleChange({ year: e.value })}
							blurInputOnSelect={true}
							isSearchable={false}
						/>
						<Select
							defaultValue={this.renderOptionMonth()[this.renderOptionMonth().length - 1] || { value: 1, label: "1월" }}
							options={this.renderOptionMonth()}
							onChange={(e) => this.onHandleChange({ month: e.value })}
							blurInputOnSelect={true}
							isSearchable={false}
						/>
						<button
							className="btn btn-primary"
							onClick={this.hanleSubmit}
						>세금 조회</button>
					</div>
				</div>
				{/* {this.renderTableTax()} */}
				<TaxTable
					showExcel={this.state.show}
					isActive={this.state.isActive}
					data={this.state.data}
					renderFooterTable={this.renderFooterTable}
					handleChangePage={this.handleChangePage}
					dataFilter={this.state.dataFilter}
					total={this.state.total}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		hospital_id: state.authReducer.user.user.hospital === null ? null : state.authReducer.user.user.hospital.id,
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user
	}
}

export default connect(mapStateToProps)(Tax);