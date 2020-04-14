import React, { Component } from "react";
import BillingTable from "./billingTable";
import { exportExcel, checkAuth } from '../../services/functionService';
import { toast } from "react-toastify";
import { connect } from 'react-redux';
import { ROLE } from '../../config.json';

class BillTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isClick: false
		}
	}

	handleExportExcel = () => {
		let { year, month } = this.props.dataFilter;
		if(month < 10 ) month = '0' + month;
		const file_name = year + '년 ' + month + '월 일산요양병원 간병료 청구서';
		// exportExcel("tableA", "Example", file_name);
		console.log(process.env.REACT_APP_API_URL + this.props.hospital_id + "/bill-export?name=" + file_name + "&year=" + year + "&month=" + month)
		window.location.href = process.env.REACT_APP_API_URL + this.props.hospital_id + "/bill-export?name=" + file_name + "&year=" + year + "&month=" + month;
	}

	handleExportExcelNull = () => {
		this.setState({
			isClick: true
		})
		toast.error('표시 할 데이터가 없습니다..');
		setTimeout(() => {
			this.setState({
				isClick: false
			})
		}, 5000);
	}

	_renderEcel = () => {
		return <div className="text-right">
				<button 
					onClick={this.handleExportExcel}
					className="btn btn-primary mb-3"
				>엑셀 다운로드</button>
			</div>
	}

	_renderEccelNull = () => {
		return <div className="text-right">
			<button 
				onClick={this.handleExportExcelNull}
				disabled={this.state.isClick}
				className="btn btn-primary mb-3"
			>엑셀 다운로드</button>
		</div>
	}

	render() {
		const data = this.props.data;
		var download = checkAuth("settlements/bill", this.props.user, ROLE.ALL, false) ? true : false;
		return (
			<div className="table-tax">
				{this.props.showExcel ? this._renderEcel() : this._renderEccelNull()}
				<div>
					<BillingTable
						isActive={this.props.isActive}
						data={data}
						page={this.props.page}
						totalAmount={this.props.totalAmount}
						dataFilter={this.props.dataFilter}
						handleChangePage={this.props.handleChangePage}
					/>
				</div>
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
export default connect(mapStateToProps)(BillTable);