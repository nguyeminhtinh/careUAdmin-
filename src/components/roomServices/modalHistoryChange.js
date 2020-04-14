import React, { Component } from 'react';
import Modal from 'react-bootstrap-modal';

class ModalHistoryChange extends Component {
	render() {
		return (
			<Modal className='modalPopup w-45'
				id="HistoryChange"
				show={this.props.openModalHistoryChange}
				onHide={() => this.props.handleChange({ openModalHistoryChange: false })}
			>
				<Modal.Header closeButton>
				</Modal.Header>
				<Modal.Title>변동 내역</Modal.Title>
				<p className="pt-4">변동상세내역</p>
				<ul>
					<li>18-11-11  12:00 업무시작시간</li>
					<li>18-06-30  72,000 변경사유가 적힘</li>
					<li>18-06-01 75,000 환자추가</li>
					<li>19-03-12 15:00 업무종료예약시간</li>
				</ul>
				<div className="action text-center">
					<button
						className="btn btn-secondary"
						onClick={() => this.handleChange({ openModalHistoryChange: false })}
					>취소</button>
				</div>
			</Modal>
		);
	}
}

export default ModalHistoryChange;