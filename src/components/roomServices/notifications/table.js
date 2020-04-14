import React, { Component } from 'react';
import Pagination from '../../common/pagination';
import { Link } from 'react-router-dom';
import Datatable from '../../common/datatable';
import '../../../public/css/tableNotification.css';
import $ from 'jquery';
import { enhance } from "../../../helpers/enhance";
import WithLoading from "../../../helpers/withLoading";
import LoadingOverlay from 'react-loading-overlay';
import PulseLoader from 'react-spinners/PulseLoader'
import { ROLE } from '../../../config.json';
import { checkAuth } from '../../../services/functionService';
import { connect } from 'react-redux';

class TableNotification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addClass: false,
		};
	}

	clickToggleClass = (id, indexNotification) => {
		// this.setState({
		// 	addClass: !this.state.addClass
		// }, () => {
		// 	let isDetails = this.props.isDetails;
		// 	this.props.renderListDetailToggle(indexNotification, this.state.addClass);
		// 	$(".table-chird-" + id).toggleClass('d-block');
		// 	$(".table-parent-" + id).toggleClass('arrow-up');
		// 	if (isDetails) {
		// 		$(".table-parent-" + id).toggleClass('toogle');
		// 	}
		// });

		let isDetails = this.props.isDetails;
		if(!$(".table-chird-" + id).hasClass('d-block'))
		{
			this.props.renderListDetailToggle(indexNotification, true);
		}

		setTimeout(() => {
			$(".table-chird-" + id).toggleClass('d-block');
			$(".table-parent-" + id).toggleClass('arrow-up');
			if (isDetails) {
				$(".table-parent-" + id).toggleClass('toogle');
			}
		}, 1000);
		
	}

	_renderButtonClose = (item) => {
		if (item.status == 2)
		{
			if (item.count_aide_waiting > 0 || item.count_aide_approved > 0) {
				if(checkAuth("rooms/notice", this.props.user, ROLE.ALL, false) === false){
					return false;
				}

				return (
					<button onClick={(e) => this.props.handleCloseNotification(item.id)}
						className="btn btn-primary"
					>마감</button>
				)
			} else {
				if(checkAuth("rooms/notice", this.props.user, ROLE.EDIT_DELETE, false) === false){
					return false;
				}

				return (
					<Link to={"/rooms/notice/edit/" + item.id +'/0'}>
						<button
							className="btn btn-primary"
						>공지수정</button>
					</Link>)
			}
		}
	}

	_renderTotalRequestOrApprove = (item, indexNotification) => {
		if (item.count_aide_approved > 0) {
			return (<span
				className={"cursor-pointer toogle table-parent-" + item.id}
				onClick={() => this.clickToggleClass(item.id, indexNotification)}
			>승인 <span className={'number_'+ indexNotification}>{item.count_aide_approved}</span>명 <i>&#x25B2;</i></span>)
		}

		return (<span
			className={"cursor-pointer toogle table-parent-" + item.id}
			onClick={() => this.clickToggleClass(item.id, indexNotification)}
		>신청 <span className={'number_'+ indexNotification}>{item.count_aide_waiting}</span>명 <i>&#x25B2;</i></span>)

	}

	_renderBodyTable = (data) => {
		let boxClass = ['d-none '];
		let isDetails = this.props.isDetails;
		if (isDetails) {
			boxClass.push('d-block ');
			$(".toogle").addClass('arrow-up');
		}
		let html = [];
		let detaiils = (data, index) => {
			let handleChangePageListNotApprove = this.props.handleChangePageListNotApprove_1;
			let listNotApprove = this.props.listNotApprove_1;
			let listApprove = this.props.listApprove_1;
			let handleChangePageListApprove = this.props.handleChangePageListApprove_1;
			let renderListDetail = this.props.renderListDetail_1;
			if (index === 2) {
				handleChangePageListNotApprove = this.props.handleChangePageListNotApprove_2;
				listNotApprove = this.props.listNotApprove_2;
				listApprove = this.props.listApprove_2;
				handleChangePageListApprove = this.props.handleChangePageListApprove_2;
				renderListDetail = this.props.renderListDetail_2;
			}
			if (index === 3) {
				handleChangePageListNotApprove = this.props.handleChangePageListNotApprove_3;
				listNotApprove = this.props.listNotApprove_3;
				listApprove = this.props.listApprove_3;
				handleChangePageListApprove = this.props.handleChangePageListApprove_3;
				renderListDetail = this.props.renderListDetail_3;
			}
			return (
				<div className={boxClass.join('') + " table-chird-" + data.id}>
					<div className="mt-4">
						<h6 className="mb-4">승인 된 간병인</h6>
						<Datatable key={'listApprove_' + index}
							body={listApprove.body}
							params={listApprove.params}
							page={listApprove.page}
							pageSz={listApprove.pageSz}
							totalPage={listApprove.totalPage}
							handleChangePage={handleChangePageListApprove}
							renderListDetail={renderListDetail}
						/>
					</div>
					<div className="mt-3">
						<h6>신청 중인 간병인</h6>
						<Datatable key={'listNotApprove_' + index}
							body={listNotApprove.body}
							params={listNotApprove.params}
							page={listNotApprove.page}
							pageSz={listNotApprove.pageSz}
							totalPage={listNotApprove.totalPage}
							handleChangePage={handleChangePageListNotApprove}
							renderListDetail={renderListDetail}
						/>
					</div>
				</div>
			)
		}

		let _renderCaregiver = (item) => {
			let html = [];
			if(item.count_male_aide > 0)
			{ 
				let male = <p key={"count_male_aide_" + item.id} className="m-0">남자{item.count_male_aide}명 </p>;
				html.push(male);
			}

			if(item.count_female_aide > 0)
			{
				let female = <p key={"count_female_aide_" + item.id + 1} className="m-0">여자{item.count_female_aide}명</p>;
				html.push(female);
			}

			if(item.count_other_aide > 0)
			{ 
				let other = <p key={"count_other_aide_" + item.id} className="m-0">무관{item.count_other_aide}명 </p>;
				html.push(other);
			}

			if(item.count_couple_aide > 0)
			{ 
				let couple = <p key={"count_couple_aide_" + item.id} className="m-0">부부{item.count_couple_aide} </p>;
				html.push(couple);
			}

			return html
		}

		if (this.props.data.body.length === 0) {
			return (
				<div key={0} className="bg-white text-center p-3 border">
					<h6 className="mb-0">데이터가 없습니다</h6>
				</div>
			);
		}

		this.props.data.body.map((item, index) => {
			html.push(
				<div className="wrapp-table jsNotice" key={index} status={item.status}>
					<div className="text-right mb-3">
						{
							this._renderButtonClose(item)
						}
						<div className="float-left mt-2"><h6>병실정보</h6></div>
					</div>

					<table className="table table-bordered text-center">
						<tbody>
							<tr>
								<th colSpan="2">근무일시</th>
								<td colSpan="4">{item.date}</td>
							</tr>
							<tr>
								<th>동</th>
								<th>호수</th>
								<th>병실</th>
								<th>일당</th>
								<th>병실인원</th>
								<th>간병인</th>
							</tr>
							<tr>
								<td>{item.departRoom}</td>
								<td>{item.name}</td>
								<td>{item.typeRoom}</td>
								<td>{item.salary}</td>
								<td>{item.numberOfPatient} 인실</td>
								<td>{_renderCaregiver(item)}
								</td>
							</tr>
							<tr>
								<th colSpan="2">상세</th>
								<td colSpan="4">{item.details}</td>
							</tr>
							<tr>
								<th colSpan="2">상태</th>
								<td colSpan="4">
									{this._renderTotalRequestOrApprove(item, index + 1)}
								</td>
							</tr>
						</tbody>
					</table>
					{detaiils(item, index + 1)}
				</div>
			);
			return item;
		})
		return html;
	}

	_renderPaging = () => {
		const { totalPage, pageSz, page } = this.props.data;

		if (totalPage > 0) {
			return (
				<Pagination
					totalPage={totalPage}
					handleChangePage={this.props.handleChangePage}
					pageSz={pageSz}
					page= {page}
				/>
			);
		}
		return;
	}

	render() {
		return (
			<LoadingOverlay
				active={this.props.isLoading}
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
				<div>
					{this._renderBodyTable()}
					{this._renderPaging()}
				</div>
			</LoadingOverlay>


		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user
	}
}
export default connect(mapStateToProps)(TableNotification);

