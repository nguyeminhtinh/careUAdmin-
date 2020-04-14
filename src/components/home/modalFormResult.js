import React, { Component } from "react";
import Modal from "react-bootstrap-modal";
import _ from "lodash";
import Datatable from "../common/datatable";
import { STATUS } from "../../config.json";
import Select from 'react-select';

class ModalFormResult extends Component {

	renderAction = (dataItem) => {
		let data = {};
		if (!_.isEmpty(dataItem)) {
			data['hospital_id'] = dataItem.id;
			data['part_id'] = ("part_id" in dataItem) ? dataItem.part_id : dataItem.parts[0].id;
			data['position_id'] = ("position_id" in dataItem) ? dataItem.position_id : dataItem.positions[0].id;
			data['openModalRequest'] = true;
		}

		if (dataItem.status === 1) {
			return (
				<button
					className="btn btn-primary"
					onClick={() => this.props.onHandleChange({ openModalConfirmDelete: true })}
				>
					승인대기중
	      		</button>
			);
		}

		return (
			<div className="text-center">
				<button
					className="btn btn-primary"
					onClick={() => this.props.onHandleSubmitApply(data)}
				>
					승인요청
				</button>
			</div>
		);
	}

	renderDataResult = () => {
		let html = [];
		if (!_.isEmpty(this.props.dataItem)) {
			const { name, address } = this.props.dataItem;
			let parts = [...this.props.dataItem.parts];
			let part = {};
			let positions = [...this.props.dataItem.positions];
			let position = {};

			parts.map((item) => {
				item.value = item.id;
				item.label = item.name;
				return item;
			});

			if (this.props.dataItem.part_id === undefined) {
				part = parts[0].value;
			} else {
				part = this.props.dataItem.part_id;
			}


			positions.map((item) => {
				item.value = item.id;
				item.label = item.name;
				return item;
			});

			if (this.props.dataItem.position_id === undefined) {
				position = positions[0].value;
			} else {
				position = this.props.dataItem.position_id;
			}

			html.push(
				<tr key={0}>
					<td>{name}</td>
					<td className="text-center">{address || "-"}</td>
					<td>
						<Select
							placeholder={'선택'}
							defaultValue={parts[parts.findIndex(x => x.id === part)]}
							options={parts}
							onChange={(e) => this.props.handleChangeData({ part_id: e.value })}
							blurInputOnSelect={true}
							isSearchable={false}
						/>
					</td>
					<td>
						<Select
							placeholder={'선택'}
							defaultValue={positions[positions.findIndex(x => x.id === position)]}
							options={positions}
							onChange={(e) => this.props.handleChangeData({ position_id: e.value })}
							blurInputOnSelect={true}
							isSearchable={false}
						/>
					</td>
					<td className="text-center">{this.renderAction(this.props.dataItem)}</td>
				</tr>
			);
		} else {
			html.push(
				<tr key={0}>
					<td colSpan={5} className="bg-white text-center">데이터가 없습니다</td>
				</tr>
			)
		}

		if (this.props.isShowTableResult) {
			return (
				<table className="table table-bordered table-striped table-result">
					<thead>
						<tr>
							<th>병원 명</th>
							<th>주소</th>
							<th>부서</th>
							<th>직책</th>
							<th>승인 요청</th>
						</tr>
					</thead>
					<tbody>
						{html}
					</tbody>
				</table>
			);
		} else {
			return;
		}
	}

	handleUpdateItem = (value) => {
		this.props.handleChangeData({ status: value })
		this.props.onHandleChange({ openModalRequest: false });
	}

	renderContentModal = () => {
		const { dataItem } = this.props;

		if (!_.isEmpty(dataItem)) {
			if (dataItem.status === STATUS.REQUEST) {
				return (
					<div className="text-center">
						<h6 className="text-question">
							<span className="d-block">참사랑요양병원 원장(마스터)에게 </span>
							승인을 요청하시겠습니까?
            			</h6>
						<div className="modal-action-footer">
							<button
								className="btn btn-primary"
								onClick={this.props.handleSubmitRequest}
							>확인</button>
							<button
								className="btn btn-secondary"
								onClick={() => this.props.onHandleChange({ openModalRequest: false })}
							>
								취소
              				</button>
						</div>
					</div>
				);
			}
		}

		return (
			<div className="text-center">
				<h6 className="text-question">
					<span className="d-block">현재 승인 대기 중입니다. 원장(마스터)의 승</span>
					인이 필요합니다.
				</h6>
				<div className="modal-action-footer">
					<button
						className="btn btn-primary"
						onClick={this.props.handleSubmitConfirm}
					>
						확인
          			</button>
					<button
						className="btn btn-secondary"
						onClick={() => this.handleUpdateItem(1)}
					>
						승인취소
          			</button>
				</div>
			</div>
		);
	}

	renderDataBodyResult = () => {
		const { body, params, page, pageSz, totalPage } = this.props.dataHospitals;
		if (body.length === 0) {
			return (
				<div className="mt-4">
					<h5 className="mb-3">병원 검색 결과가 없습니다.</h5>
					<p>1. 원장(마스터)이 가입하지 않았나요? 반드시, 원장이 먼저 가입해야 일반(병원담당자)도 가입할 수 있습니다.</p>
					<p>2. 잘못된 단어로 검색하지 않았나요?</p>
					<p>확인 후 다시 검색 해주세요</p>
					<div className="result-not text-center">
						<button
							className="btn btn-secondary"
							onClick={() => this.props.onHandleChange({ openModalFormResult: false })}
						>
							취소
						</button>
					</div>
				</div>
			);
		}

		
		return (
			<div>
				<h6 className="title-result">
					<button
						className="btn btn-primary"
						onClick={this.props.handleCheck}
					>확인</button>
				</h6>
				<Datatable
					body={body}
					params={params}
					page={page}
					pageSz={pageSz}
					totalPage={totalPage}
					handleChangePage={this.props.handleChangePage}
					handleClickRow={this.props.handleClickRow}
					dataIdActive={this.props.dataIdActive}
					_handleDoubleClickItem={this.props.handleCheck}
				/>
			</div>
		);
	}

	modalConfirmDelete = () => {
		return (
			<div className="text-center">
				<h6 className="text-question border-bottom">
					<span className="d-block">삭제 하시겠습니까?</span>
				</h6>
				<div className="modal-action-footer">
					<button
						className="btn btn-primary"
						onClick={() => this.props.onHandleDeleteApply(this.props.userId)}
					>
						예
          			</button>
					<button
						className="btn btn-secondary"
						onClick={() => this.props.onHandleChange({ openModalConfirmDelete: false })}
					>
						아니오
          			</button>
				</div>
			</div>
		);
	}

	modalApplySuccess = () => {
		return (
			<div className="text-center">
				<h6 className="text-question  border-bottom">
					<span className="d-block">웹 페이지 메시지</span>
				</h6>
				<p>
					병원에 성공적으로 등록되었습니다. 잠시 기다려주십시오.
				</p>
				<div className="modal-action-footer">
					<button
						className="btn btn-secondary"
						onClick={() => this.props.onHandleChange({ openModalApplySuccess: false })}
					>
						닫기
          			</button>
				</div>
			</div>
		);
	}

	modalDeleteSuccess = () => {
		return (
			<div className="text-center">
				<h6 className="text-question border-bottom">
					<span className="d-block">웹 페이지 메시지</span>
				</h6>
				<p>
				적용 병원이 성공적으로 취소되었습니다
				</p>
				<div className="modal-action-footer">
					<button
						className="btn btn-secondary"
						onClick={() => this.props.onHandleChange({ openModalDeleteSuccess: false })}
					>
						닫기
          			</button>
				</div>
			</div>
		);
	}

	render() {
		const { sizeModal } = this.props;

		return (
			<div>
				{this.renderDataResult()}
				<Modal className={"modalPopup " + sizeModal}
					id="FormResult"
					show={this.props.openModalFormResult}
					onHide={this.props.handleCloseModal}
				>
					<Modal.Header closeButton />
					<Modal.Title>병원이름 검색결과</Modal.Title>
					{this.renderDataBodyResult()}
				</Modal>
				<Modal
					className="modalPopup w-55"
					id="ModalRequest"
					show={this.props.openModalRequest}
					onHide={() => this.props.onHandleChange({ openModalRequest: false })}
				>
					{this.renderContentModal()}
				</Modal>

				<Modal
					className="modalPopup w-55"
					id="modalConfirmDelete"
					show={this.props.openModalConfirmDelete}
					onHide={() => this.props.onHandleChange({ openModalConfirmDelete: false })}
				>
					{this.modalConfirmDelete()}
				</Modal>
				<Modal
					className="modalPopup w-55"
					id="modalApplySuccess"
					show={this.props.openModalApplySuccess}
				>
					{this.modalApplySuccess()}
				</Modal>
				<Modal
					className="modalPopup w-55"
					id="modalDeleteSuccess"
					show={this.props.openModalDeleteSuccess}
				>
					{this.modalDeleteSuccess()}
				</Modal>
				<Modal
					className="modalPopup w-45"
					id="ModalAlert"
					show={this.props.openModalModalAlert}
					onHide={() => this.props.onHandleChange({ openModalModalAlert: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						병원을 선택하세요
					</div>
					<div className="action-footer text-center">
						<button
							className="btn btn-secondary"
							onClick={() => this.props.onHandleChange({ openModalModalAlert: false })}
						>확인</button>
					</div>
				</Modal>
			</div>
		);
	}
}
export default ModalFormResult;
