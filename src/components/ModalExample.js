import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

const dialogStyle = {
    //border: '1px solid #e5e5e5',
    backgroundColor: 'white',
    boxShadow: '0 5px 15px rgba(0,0,0,.5)',
    padding: 20
};


const ModalExample = React.createClass({

    render() {

        return (
            <div className='modal-example'>
                <Modal
                    show={true}
                    onHide={this.props.onClose}
                >
                    <div style={dialogStyle} >
                        <h4 id='modal-label'>Text in a modal</h4>
                        <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
                    </div>
                </Modal>
            </div>
        );
    },
});

export default ModalExample;
