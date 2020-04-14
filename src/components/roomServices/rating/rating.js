import React from "react";

class Rating extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			rating: this.props.rating || 0,
			temp_rating: 0
		};
  	}

  	handleMouseover(rating) {
		this.setState(prev => ({
			rating,
			temp_rating: prev.rating
		}));
  	}

	handleMouseout() {
		this.setState(prev => ({
			rating: prev.temp_rating
		}));
	}

	rate(rating) {
		this.setState({
			rating,
			temp_rating: rating
		}, () => {
			this.props.handleChangeData({ rating: rating});
		});
	}

	render() {
		// const { rating } = this.state;
		let stars = [];
		for (let i = 1; i < 11; i++) {
		let classIcon = "fa fa-star-o text-danger";
		if (this.state.rating >= i && this.state.rating !== null) {
			classIcon = "fa fa-star text-danger";
		}
		stars.push(
			<i key={i}
				style={{
					display: "inline-block",
					width: "12px",
					overflow: "hidden",
					direction: i % 2 === 0 ? "rtl" : "ltr"
			}}
				className={classIcon}
				onMouseOver={() => this.handleMouseover(i)}
				onClick={() => this.rate(i)}
				onMouseOut={() => this.handleMouseout()}
			/>
			);
		}
		return <div className="rating">{stars}</div>;
	}
}

export default Rating;
