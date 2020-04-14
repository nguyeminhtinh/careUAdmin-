import React, { Component } from 'react';
import EditProfile from '../../components/profile/edit';
import { connect } from 'react-redux';

class Edit extends Component {
	render() {
		return (
			<div className="bg-white">
				<EditProfile
					profile={this.props.user}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.authReducer.user.user,
	}
}

export default connect(mapStateToProps)(Edit);