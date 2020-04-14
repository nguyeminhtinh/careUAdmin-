import React, { Component } from 'react';
import logo from '../../public/images/logo_banner.png';

class Header extends Component {

	render() {
		const { title, subtitle } = this.props;

		return (
			<div className={title.length === 0 ? "header" : "header page"}>
				<div className="wrapp-banner">
					{title.length === 0 ?
						<img src={logo} alt="" className="logo-banner" /> :
						<div>
							<p className="pt-2 mb-1 font-weight-bold">{title}</p>
							<p className="mb-2 f-14">{subtitle}</p>
						</div>
					}
				</div>
			</div>
		);
	}
}

export default Header;