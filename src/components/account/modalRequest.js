import React, { Component } from 'react';
import Modal from 'react-bootstrap-modal';

class ModalRequest extends Component {

	renderBodyModal = () => {
		if (this.props.type === 1) {
			return (
				<div>
					<p className="text-center">해당 계정을 승인하시겠습니까?</p>
					<div className="button-footer text-center">
						<button 
							className="btn btn-primary" 
							disabled={this.props.isClick}
							onClick={() => this.props.handleChangeApproved({ openModalRequest: false })}
						>예</button>
						<button
							className="btn btn-secondary"
							onClick={() => this.props.handleChange({ openModalRequest: false })}
						>아니오</button>
					</div>
				</div>
			);
		}

		return (
			<div>
				<p className="text-center">해당 계정을 거절하시겠습니까?</p>
				<div className="button-footer text-center">
					<button 
						className="btn btn-primary"
						disabled={this.props.isClick} 
						onClick={() => this.props.handleChangeDelete({ openModalRequest: false })}
					>예</button>
					<button
						className="btn btn-secondary"
						onClick={() => this.props.handleChange({ openModalRequest: false })}
					>아니오</button>
				</div>
			</div>
		);
	}

	render() {
		const { email, fullName, partName, positionName } = this.props.dataPopup;
		
		return (
			<Modal className='modalPopup w-45'
				id="Modal"
				show={this.props.openModalRequest}
				onHide={() => this.props.handleChange({ openModalRequest: false })}
			>
				<Modal.Header closeButton>
				</Modal.Header>
				<Modal.Title>{this.props.title}</Modal.Title>
				<div className="pt-4">
					<p className="mt-2">아이디-ID  : {email}</p>
					<p>이름 : {fullName}</p>
					<p>부서 : {partName}</p>
					<p>직책 : {positionName} </p>
				</div>
				{this.renderBodyModal()}
			</Modal>
		);
	}
}

export default ModalRequest;