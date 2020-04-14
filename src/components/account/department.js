import React, { Component } from 'react';
import { PAGESIZE, ROLE } from '../../config.json';
import Datatable from '../common/datatable.js';
import Modal from 'react-bootstrap-modal';
import parts from '../../services/accountDepartments';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import PulseLoader from 'react-spinners/PulseLoader';
import { checkAuth } from '../../services/functionService';
import { connect } from 'react-redux';

class Department extends Component {
	constructor(props) {
		super(props);
		var params = [
			{ title: "NO", value: "no", className: "w50 text-center" },
			{ title: "부서", value: "name" }
		];
		if(checkAuth("accounts/department-position", this.props.user, ROLE.EDIT_DELETE, false) === true)
		{
			params = [...params, { title: "조작", value: "action", renderer: this._renderAction, className: "wrapper-action text-center" }]
		}

		this.state = {
			name: "",
			isActive: true,
			data: {
				params,
				body: [],
				page: 1,
				pageSz: PAGESIZE,
				totalPage: 0
			},
			dataEdit: {
				name: ""
			},
			openModalEditDepartment: false,
			error: false,
			openModalWarningDepartmentUsing: false,
			isClick: false
		}
	}

	componentWillMount() {
		const { page, pageSz } = this.state.data;

		this._renderData(this.props.hospital_id, page, pageSz);
	}


	_renderData = async (id, page, pageSz) => {
		try {
			let dataResult = await parts.getListParts(id, page, pageSz);
			let data = [...dataResult.data.data.parts];

			data.map((item, index) => {
				item.no = (page - 1) * pageSz + index + 1;
				return item;
			});

			this.setState({
				data: {
					...this.state.data,
					body: data,
					totalPage: dataResult.data.data.total
				},
				isActive: false,
				value: "",
				openModalDelete: false,
				openModalEditDepartment: false
			});
		} catch (error) {
			console.log(error);
		}
	}

	onHandleChange = (data) => {
		this.setState({
			...data
		});
	}

	_renderAction = (data) => {
		return (
			<div>
				<button
					className="btn btn-primary"
					onClick={() => this.handleEdit(data)}
				>수정</button>
				<button
					className="btn btn-danger"
					onClick={() => this.onHandleChange({ id: data.id, openModalDelete: true })}
				>삭제</button>
			</div>
		);
	}

	handleEdit = (dataEdit) => {
		this.setState({
			dataEdit,
			openModalEditDepartment: true
		});
	}

	handleDelete = async () => {
		try {
			let response = await parts.deletePart(this.state.id);
			console.log(response.data.data.length)
			if(response.data.data.length !== 0)
			{
				this.onHandleChange({ openModalDelete: false});
				setTimeout(() => { this.onHandleChange({ openModalWarningDepartmentUsing: true }); }, 500);
				
			}else {
				this.handleChangePage(1);
				toast.success(response.data.message);
			}
			
		} catch (error) {
			toast.error("부분이 존재하지 않습니다!");
		}
	}

	handleChangePage = (page) => {
		this.setState({
			data: {
				...this.state.data,
				page: page
			}
		}, () => {
			this._renderData(this.props.hospital_id, page, this.state.data.pageSz);
		});
		window.scrollTo(0, 0)
	}

	hanleSubmit = async () => {
		this.setState({
			isClick: true
		})
		const { name } = this.state;
		const data = {
			name: name,
			hospital_id: this.props.hospital_id
		}

		if(data.name.trim().length)
		{
			try {
				await parts.addPart(data);
				toast.success('새 데이터가 추가되었습니다');

				this.setState({
					name: ""
				}, () => {
					const { page, pageSz } = this.state.data;
					this._renderData(this.props.hospital_id, page, pageSz);
				})
			} catch (error) {
				toast.error('부서가 이미 있습니다.');
			}
		}else {
			toast.error('부품 이름이 필요합니다');
		}
		setTimeout(() => {
			this.setState({
				isClick: false
			})
		}, 3000);
	}

	handleChangeData = (data) => {
		this.setState({
			dataEdit: {
				...this.state.dataEdit,
				...data
			}
		});
	}

	handleSubmitEdit = async () => {
		const { page, pageSz } = this.state.data;
		const { name, hospital_id } = this.state.dataEdit;

		if (name.trim().length === 0) {
			this.setState({
				error: true
			});

			return;
		}

		try {
			let response = await parts.updatePart(this.state.dataEdit);

			this._renderData(hospital_id, page, pageSz);
			toast.success(response.data.message);
		} catch (error) {
			toast.error(error.data.errors.mesages.name[0]);
		}
	}

	renderError = () => {
		if (this.state.error) {
			return (
				<span className="help-block text-danger">부서를 입력하세요</span>
			);
		}
	}

	render() {
		const { params, body, page, pageSz, totalPage } = this.state.data;

		return (
			<div>
				{checkAuth("accounts/department-position", this.props.user, ROLE.ALL, false) === true ?
				<div className="header-search">
					<h5>부서 추가</h5>
					<div className="d-flex">
						<label>부서명 : </label>
						<input
							type="text"
							className="form-control"
							value={this.state.name}
							placeholder="부서명"
							onChange={(e) => this.onHandleChange({ name: e.target.value })}
						/>
						<button
							className="btn btn-primary"
							onClick={this.hanleSubmit}
							disabled={this.state.isClick}
						>추가</button>
					</div>
				</div>
				: ''}
				<LoadingOverlay
					active={this.state.isActive}
					spinner={<PulseLoader />}
					text='로딩...'
					styles={{
						spinner: (base) => ({
							...base,
							top: '0',
							background: '#4288ce'
						}),
						overlay: (base) => ({
							...base,
							background: 'rgba(66, 136, 206, 0.28)'
						})
					}}
				>
					<Datatable
						body={body}
						params={params}
						page={page}
						pageSz={pageSz}
						totalPage={totalPage}
						handleChangePage={this.handleChangePage}
					/>
				</LoadingOverlay>
				<Modal className='modalPopup w-55'
					id="EditDepartment"
					show={this.state.openModalEditDepartment}
					onHide={() => this.onHandleChange({ openModalEditDepartment: false, error: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>수정</Modal.Title>
					<input
						type="text"
						value={this.state.dataEdit.name}
						className="form-control mt-5"
						onChange={(e) => this.handleChangeData({ name: e.target.value })}
					/>
					{this.renderError()}
					<div className="text-center">
						<button
							className="btn btn-primary"
							onClick={this.handleSubmitEdit}
						>수정</button>
						<button
							className="btn btn-secondary"
							onClick={() => this.onHandleChange({ openModalEditDepartment: false, error: false })}
						>취소</button>
					</div>
				</Modal>

				<Modal
					className='modalPopup w-45'
					id="ModalError"
					show={this.state.openModalError}
					onHide={() => this.onHandleChange({ openModalError: true })}
				>
					<div>
						<p className="text-center">부서-직책이 중복됩니다. 다시 한번 확인해주세요</p>
						<div className="button-footer text-center">
							<button
								className="btn btn-secondary"
								onClick={() => this.onHandleChange({ openModalError: false })}
							>확인</button>
						</div>
					</div>
				</Modal>

				<Modal
					className='modalPopup w-45'
					id="ModalDelete"
					show={this.state.openModalDelete}
					onHide={() => this.onHandleChange({ openModalDelete: true })}
				>
					<div>
						<p className="text-center">삭제하시겠습니까?</p>
						<div className="button-footer text-center">
							<button
								className="btn btn-primary"
								onClick={this.handleDelete}
							>예</button>
							<button
								className="btn btn-secondary"
								onClick={() => this.onHandleChange({ openModalDelete: false })}
							>아니요</button>
						</div>
					</div>
				</Modal>
				<Modal className='modalPopup w-45'
					id="openModalWarningDepartmentUsing"
					show={this.state.openModalWarningDepartmentUsing}
					onHide={() => this.onHandleChange({ openModalWarningDepartmentUsing: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 사이트로부터의 통지</Modal.Title>
					<div>
						<p className="text-center pt-16">사용중인 직책을 삭제 불 가능합니다</p>
						<div className="button-footer text-center">
							<button
								className="btn btn-secondary"
								onClick={() => this.onHandleChange({ openModalWarningDepartmentUsing: false })}
							>확인</button>
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user
	}
}

export default connect(mapStateToProps)(Department);
