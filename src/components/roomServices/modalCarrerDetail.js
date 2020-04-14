import React, { Component } from 'react';
import Modal from 'react-bootstrap-modal';
import Datatable from '../common/datatable';

class ModalCarrerDetail extends Component {
	render() {
		const { dataInfo, dataHistory, dataHistoryError } = this.props;

		return (
			<Modal className='modalPopup'
				id="CarrerDetail"
				show={this.props.openModalCarrerDetail}
				onHide={this.props.handleCloseModalCarrerDetail}
			>
				<Modal.Header closeButton>
				</Modal.Header>
				<Modal.Title>간병인 상세정보</Modal.Title>
				<h6 className="font-weight-boldt mt-4 pt-2 mb-2">기본정보</h6>
				<Datatable
					body={dataInfo.body}
					params={dataInfo.params}
					page={dataInfo.page}
					pageSz={dataInfo.pageSz}
					totalPage={dataInfo.totalPage}
				/>
				<h6 className="font-weight-boldt mt-0">완료 업무 이력</h6>
				<Datatable
					body={dataHistory.body}
					params={dataHistory.params}
					page={dataHistory.page}
					pageSz={dataHistory.pageSz}
					totalPage={dataHistory.totalPage}
					handleChangePage={this.props.handleChangePage}
				/>
				<h6 className="font-weight-boldt">패널티 이력</h6>
				<Datatable
					body={dataHistoryError.body}
					params={dataHistoryError.params}
					page={dataHistoryError.page}
					pageSz={dataHistoryError.pageSz}
					totalPage={dataHistoryError.totalPage}
					handleChangePage={this.props.handleChangePageHistoryError}
				/>
			</Modal>
		);
	}
}

export default ModalCarrerDetail;