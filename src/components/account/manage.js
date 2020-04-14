import React, { Component } from 'react';
import Position from './position';
import Department from './department';
import { connect } from 'react-redux';

import { checkAuth } from '../../services/functionService';
import { ROLE } from '../../config.json';

class Manage extends Component {
	constructor(props) {
		super(props);

		checkAuth("accounts/department-position", this.props.user, ROLE.VIEW, true);
	}

	render() {
		return (
			<div className="page-department">
				<ul className="nav nav-tabs">
					<li className="nav-item">
						<a className="nav-link active" data-toggle="tab" href="#department">부서</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" data-toggle="tab" href="#position">직책</a>
					</li>
				</ul>
				<div className="tab-content">
					<div className="tab-pane active" id="department">
						<Department
							hospital_id={this.props.hospital_id}
						/>
					</div>
					<div className="tab-pane fade" id="position">
						<Position
							hospital_id={this.props.hospital_id}
						/>
					</div>
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

export default connect(mapStateToProps)(Manage);