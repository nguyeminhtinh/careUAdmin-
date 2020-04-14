import React, { Component } from 'react';
import { PAGESIZE, ROLE } from '../../config.json';
import { getHandlingProblem } from "../../services/handlingProblem";
import { isNumberKey, getPrefixCondition, getPrefixPhoneNumber, checkAuth, isOnPasteNumber } from '../../services/functionService';
import HandlingTable from './handlingTable';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap-modal';

class HandlingProblem extends Component {
	constructor(props) {
		super(props);

		checkAuth("problems", this.props.user, ROLE.VIEW, true);

		this.state = {
			dataHandling: {
				body: [],
				page: 1,
				pageSz: PAGESIZE,
				totalPage: 0
			},
			dataFilter: {
				aide_name: "",
				type_id: '',
				phoneFirst: '',
				phoneSecond: "",
				phoneEnd: "",
				insurrance: "",
				hospitalId: ""
			},
			aide_name: "",
			valueType: '',
			phoneFirst: '',
			phoneSecond: "",
			phoneEnd: "",
			insurrance: "",
			openModalViewLetter: false,
			imgPopup: ""
		}
	}

	componentWillMount() {
		this.renderListArea();
		this._renderDataHandling(this.state.dataFilter, this.state.dataHandling.page, this.state.dataHandling.pageSz);
	}

	renderListArea = () => {
		let listArea = [];
		listArea.push({
			id: '',
			value: '',
			label: '선택'
		});

		listArea = [
			...listArea,
			...this.props.listArea
		];

		listArea.map((item) => {
			if (item.id) {
				item.value = item.id;
			}
			if (item.name) {
				item.label = item.name;
			}
			return item;
		});

		this.setState({
			listArea
		});
	}

	_renderDataHandling = async (data, page, pageSz) => {
		try {
			data['hospitalId'] = this.props.hospital_id;
			let dataResult = await getHandlingProblem(data, page, pageSz);
			let dataTable = [...dataResult.listHandling];

			dataTable.map((item, index) => {
				item.no = (page - 1) * pageSz + index + 1;
				return item;
			});

			this.setState({
				dataHandling: {
					...this.state.dataHandling,
					body: dataResult.listHandling,
					totalPage: dataResult.total
				}
			});
		} catch (error) {
			console.log(error);
		}

	}

	handleChangePage = (page) => {
		this.setState({
			dataHandling: {
				...this.state.dataHandling,
				page: page
			}
		}, () => {
			this._renderDataHandling(this.state.dataFilter, page, this.state.dataHandling.pageSz);
			window.scroll({ top: 0, left: 0, behavior: 'smooth' });
		});
	}

	handleChangeData = (data) => {
		this.setState({
			dataFilter: {
				...this.state.dataFilter,
				...data
			}
		});
	}

	handleFilterData = () => {
		const { phoneFirst, phoneSecond, phoneEnd, insurrance } = this.state;
		let aide_name = this.getAideName.value;
		let type_id = '';

		if (this.state.valueType !== '') {
			type_id = this.state.valueType;
		}

		this.setState({
			dataFilter: {
				...this.state.dataFilter,
				aide_name,
				type_id,
				phoneFirst: phoneFirst,
				phoneSecond: phoneSecond,
				phoneEnd: phoneEnd,
				insurrance: insurrance
			}
		}, () => {
			this.handleChangePage(1);
		});
	}

	handleChange = (data) => {
		console.log(data);
		this.setState({
			...data
		});
	}

	render() {
		return (
			<div>
				<div className="header-search search-problem">
					<h5>검색</h5>
					<div className="d-flex align-items-center">
						<div className="d-flex justify-content-between align-items-center w-85 style2">
							<div className="d-flex align-items-center justify-content-between">
								<label>간병인 이름 :</label>
								<div>
									<input
										type="text"
										className="form-control"
										placeholder="이름을 입력하세요"
										ref={(input) => this.getAideName = input}
									/>
								</div>
							</div>
							<div className="d-flex align-items-center justify-content-between">
								<label>병실 :</label>
								<div>
									<Select
										placeholder="선택"
										onChange={(e) => this.handleChange({ valueType: e.value })}
										options={this.props.listType}
										blurInputOnSelect={true}
										isSearchable={false}
									/>
								</div>
							</div>							
							<div className="d-flex align-items-center justify-content-between">
								<label>보호자연락처 :</label>
								<div className="d-flex justify-content-around align-items-center">
									<div className="d-flex justify-content-start handling-problem custom-slectoption">
										<Select
											className="d-inline-block"
											value=""
											onChange={(e) => this.handleChange({ phoneFirst: e.value })}
											options={getPrefixPhoneNumber().prefix}
											blurInputOnSelect={true}
											isSearchable={false}
										/>
										<input
											type="text"
											className="form-control combo-input top5"
											value={this.state.phoneFirst}
											placeholder="000"
											onKeyPress={(e) => isNumberKey(e)}
											maxLength="3"
											onChange={(e) => this.handleChange({ phoneFirst: e.target.value })}
											onPaste={(e) => isOnPasteNumber(e)}
										/>
									</div>
									<span className="dashs mb-0">-</span>
									<input
										type="text"
										className="form-control"
										placeholder="0000"
										maxLength="4"
										onKeyPress={(e) => isNumberKey(e)}
										onChange={(e) => this.handleChange({ phoneSecond: e.target.value })}
										onPaste={(e) => isOnPasteNumber(e)}
									/>
									<span className="dashs mb-0">-</span>
									<input
										type="text"
										className="form-control"
										placeholder="0000"
										maxLength="4"
										onKeyPress={(e) => isNumberKey(e)}
										onChange={(e) => this.handleChange({ phoneEnd: e.target.value })}
										onPaste={(e) => isOnPasteNumber(e)}
									/>
								</div>
							</div>
							<div className="d-flex align-items-center justify-content-between">
								<label>상태 :</label>
								<div>
									<Select
										placeholder="선택"
										onChange={(e) => this.handleChange({ "insurrance": e.value })}
										options={getPrefixCondition().prefixCondition}
										blurInputOnSelect={true}
										isSearchable={false}
									/>
								</div>
							</div>
						</div>
						<div className="text-right w-20 mt-0">
							<button
								className="btn btn-primary "
								onClick={this.handleFilterData}
							>검색</button>
						</div>
					</div>
				</div>
				{checkAuth("problems", this.props.user, ROLE.ALL, false) === true ?
					<div className="text-right mt-3 mr-3 mb-3">
						<Link to={"/problems/create"}>
							<button className="btn btn-primary">등록</button>
						</Link>
					</div>
					: ''}
				<div className="wrapp-right">
					<HandlingTable
						handleChangePage={this.handleChangePage}
						handleChange={this.handleChange}
						data={this.state.dataHandling}
						imgPopup={this.state.imgPopup}
					/>
				</div>
				<Modal className='modalPopup w-100'
					id="cancel"
					show={this.state.openModalViewLetter}
					onHide={() => this.handleChange({ openModalViewLetter: false })}
				>
					<div className="text-center custom-img-popup">
						<img src={this.state.imgPopup} alt="" className="w-100" />
					</div>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		listArea: state.areaReducer.listArea,
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user,
		hospital_id: state.authReducer.user.user ? state.authReducer.user.user.hospital ? state.authReducer.user.user.hospital.id : null : null,
		listType: state.typeReducer.listType
	}
}

export default connect(mapStateToProps)(HandlingProblem);
