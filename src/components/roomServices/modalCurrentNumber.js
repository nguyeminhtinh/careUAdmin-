import React, { Component } from 'react';
import Modal from 'react-bootstrap-modal';
import Datetime from 'react-datetime';
import Select from 'react-select';
import { isMaxlength } from '../../services/functionService';
import { toast } from "react-toastify";
import { exportExcel } from '../../services/functionService';
import moment, { max } from 'moment';
import { connect } from 'react-redux';

class ModalCurrentNumber extends Component {
	constructor(props) {
		super(props);

		this.state = {
			status: true,
			time: '',
			area: ''
		}
	}
	handleChangeStep = (id) =>{
		 this.setState({
			status: !this.state.status
		});
		if(this.state.status) {
			this.props.renderDataCode(id, 1, this.state.area)
		} else {
			this.props.renderDataCode(id, 0, this.state.area)
		}
	}
	renderTbodyTable = () => {
		let html = [];
		this.props.dataPopup.map((item, index) => {
			html.push(
				<tr key={index}>
					<td className="text-center w170">{item.name}</td>
					<td className="text-center w170">{item.room}</td>
					<td>
						<input
							type="text"
							className="form-control text-center"
							onKeyPress={(e) => isMaxlength(e, item.maxlength)}
							placeholder="미입력"
							name="value"
							autoComplete="off"
							maxLength="10"
							onChange={(e) => this.props.handleChangeIndex("value", e.target.value, item, index)}
							defaultValue={item.value}
						/>
					</td>
				</tr>
			);

			return item
		});
		if (this.props.dataPopup.length === 0) {
			return (
				<tr key={0}>
					<td colSpan={3} className="bg-white text-center">데이터가 없습니다</td>
				</tr>
			);
		}
		return html;
	}
	renderTbodyTableExcel = () => {
		let html = [];
		this.props.dataPopup.map((item, index) => {
			html.push(
				<tr key={index}>
					<td className="text-center w170">{item.name}</td>
					<td className="text-center w170">{item.room}</td>
					<td className="text-center w170">{item.value}</td>
				</tr>
			);

			return item
		});
		if (this.props.dataPopup.length === 0) {
			return (
				<tr key={0}>
					<td colSpan={3} className="bg-white text-center">데이터가 없습니다</td>
				</tr>
			);
		}
		return html;
	}

	renderCancelModal = () => {
		return (
			<div>
				<p className="text-center pt-16">취소하시겠습니까?</p>
				<div className="button-footer text-center">
					<button
						className="btn btn-primary"
						onClick={() => this.props.handleChange({ openModalCancel: false, openModalCurrentNumber: false, })}
					>예</button>
					<button
						className="btn btn-secondary"
						data-dismiss="modal"
						onClick={() => this.props.handleChange({ openModalCancel: false })}
					>아니오</button>
				</div>
			</div>
		);
	}

	handelChangeTime = (evt) => {
		let time = evt.format('YYYY-MM-DD');
		if(time === "") {
			toast.error('시간을 입력하십시오.');
		} else {
			this.setState({
				time: time
			})
			if(this.state.status) this.props.sendTimeCheck(time, 1, this.state.area);
			else this.props.sendTimeCheck(time, 0, this.state.area);
		}	
	}

	handleChangeFilter = (e) => {
		this.props.handleChangeFilter(e)
		this.setState({
			area: e.value
		});
	}

	exportExcel = () => {
		let data = this.props.dataPopup
		if(data.length === 0) {
			toast.error('데이터 없음.');
		} else {
			const file_name = '병실 현황' + moment().format("YYYY-MM-DD-HH-mm");
			window.location.href = process.env.REACT_APP_API_URL + this.props.hospital_id + "/room-export?name=" + file_name + "&time=" + this.state.time + "&area=" + this.state.area;
			// exportExcel("tableC", "Example", file_name);
		}
	}

	render() {
		const { status } = this.state;
		return (
			<div>
				<Modal className='modalPopup w-65 not-ie selectbill'
					id="CurrentNumber"
					show={this.props.openModalCurrentNumber}
					onHide={() => this.props.handleChange({ openModalCurrentNumber: false })}
				>
					<div className="d-flex justify-content-between align-items-center">
						<div className="d-flex align-items-center">
							<label className="mb-0">병동 :</label>
							<Select
								className="select-ward"
								placeholder="선택"
								defaultValue={this.props.selectRoom}
								onChange={(e) => this.handleChangeFilter(e)}
								options={this.props.valueSelect}
								blurInputOnSelect={true}
								isSearchable={false}
							/>
							<button
								className="btn btn-primary mr3"
								onClick={(e) => this.handleChangeStep(this.props.id)}
							>
								{status ? "전체보기" : "미입력보기"}
							</button>
							<button
								className="btn btn-primary" onClick={this.exportExcel}>
								엑셀로 저장
							</button>
						</div>
						<Datetime
							className="input-date w-246"
							timeFormat="HH:mm:ss"
							onChange={this.handelChangeTime}
							inputProps={{ placeholder: '일시를 선택하세요', readOnly: true, }}
						/>
					</div>

					<table className="table mt-3 mb-0" id="tableB">
						<thead>
							<tr>
								<th>동</th>
								<th>호실</th>
								<th className="">인원</th>
							</tr>
						</thead>
						<tbody>
							{this.renderTbodyTable()}
						</tbody>
					</table>
					<table className="table mt-3 mb-0" id="tableC">
						<thead>
							<tr>
								<th>동</th>
								<th>호실</th>
								<th className="">인원</th>
							</tr>
						</thead>
						<tbody>
							{this.renderTbodyTableExcel()}
						</tbody>
					</table>
					<div className="action text-center mb-0">
						<button
							className="btn btn-primary"
							disabled={this.props.isClick}
							onClick={() => this.props.handleClickSave()}
						>
							저장
						</button>
						<button
							className="btn btn-secondary"
							onClick={() => this.props.handleChange({ openModalCurrentNumber: false })}
						>
							취소
						</button>
					</div>
				</Modal>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		hospital_id: state.authReducer.user.user.hospital === null ? null : state.authReducer.user.user.hospital.id,
	}
}
export default connect(mapStateToProps)(ModalCurrentNumber);