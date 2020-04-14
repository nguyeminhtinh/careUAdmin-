import React, { Component } from 'react';
import { PAGESIZE, ROLE } from '../../config.json';
import Datatable from "../common/datatable";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import permission from '../../services/permissions';
import LoadingOverlay from 'react-loading-overlay';
import PulseLoader from 'react-spinners/PulseLoader';
import { checkAuth } from '../../services/functionService';

class Permissions extends Component {
	constructor(props) {
		super(props);

		checkAuth("accounts/permission", this.props.user, ROLE.VIEW, true);

		var params = [
			{ title: "NO", value: "no", className: "text-center w80" },
			{ title: "부서", value: "part_name" },
			{ title: "직책", value: "position_name" },
			{ title: "이름", value: "name" }
		];
		if(checkAuth("accounts/permission", this.props.user, ROLE.VIEW, false) === true || checkAuth("accounts/permission", this.props.user, ROLE.EDIT_DELETE, false) === true)
		{
			params = [...params, { title: "상세", renderer: this._renderLink }]
		}

		this.state = {
			dataHistory: {
				params,
				body: [],
				page: 1,
				pageSz: PAGESIZE,
				totalPage: 0
			},
			isActive: true
		}
	}

	componentWillMount() {
		const { page, pageSz } = this.state.dataHistory;

		this._renderData(this.props.hospital_id, page, pageSz);
	}

	_renderData = async (id, page, pageSz) => {
		try {
			let response = await permission.getListPermission(id, page, pageSz);
			let data = response.data.data;

			data.accounts.map((item, index) => {
				item.no = (page - 1) * pageSz + index + 1;
				item.name = item.user.full_name;
				item.position_name = item.position.name;
				item.part_name = item.part ? item.part.name : '';
				return item;
			});

			this.setState({
				dataHistory: {
					...this.state.dataHistory,
					body: data.accounts,
					totalPage: data.total
				},
				isActive: false
			});
		} catch (error) {
			console.log(error);
		}
	}

	handleChangePage = (page) => {
		this.setState({
			dataHistory: {
				...this.state.dataHistory,
				page: page
			}
		}, () => {
			this._renderData(this.props.hospital_id, page, this.state.dataHistory.pageSz);
		});
		window.scrollTo(0, 0)
	}

	handleChangeType = (data) => {
		this.setState({
			...data
		});
	}

	navMainPage = () => {
		window.location.href = "/accounts/permissions";
	}

	_renderLink = (data) => {
		return (
			<Link to={"/accounts/permissions/edit/" + data.id}>
				<button
					className="btn btn-primary btn-sm btn-table"
				>상세 정보</button>
			</Link>
		);
	}

	render() {
		const { body, params, page, pageSz, totalPage } = this.state.dataHistory;

		return (
			<div>
				<div className="wrapp-right table-row">
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
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		hospital_id: state.authReducer.user.user ? state.authReducer.user.user.hospital ? state.authReducer.user.user.hospital.id : null : null,
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user
	}
}

export default connect(mapStateToProps)(Permissions);