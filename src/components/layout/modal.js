import React, { Component } from 'react';

class Modal extends Component {

    renderHeader = () => {
        if (this.props.hideHeader) {
            return;
        }

        return (
            <div className="modal-header">
                <h4 className="modal-title">{this.props.title}</h4>
                <button
                    type="button"
                    className="close"
                    data-dismiss="modal">×</button>
            </div>
            
        );
    }
    
  	render() {
        const { id, sizeModal, dataBackdrop, dataKeyboard } = this.props;

		return (
			<div className="modal" id={id}  data-backdrop={dataBackdrop} data-keyboard={dataKeyboard}>
                <div className={"modal-dialog modal-midle " + sizeModal}>
                    <div className="modal-content">
                        {this.renderHeader()}
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
		);
  	}
}

export default Modal;