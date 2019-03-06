import React, { Component } from 'react';

class Modal extends Component {
  onCancel = e => {
    this.props.onCancel && this.props.onCancel();
  };

  onConfirm = e => {
    this.props.onConfirm && this.props.onConfirm();
  };

  render() {
    return (
      <div style={styles.modalBackDrop}>
        <div style={styles.modal}>
          <h4 style={styles.modalHeader}>{this.props.modalTitle}</h4>
          <div style={styles.content}>{this.props.children}</div>
          <div style={styles.actions}>
            <button
              onClick={this.props.onCancel}
              class="btn waves-effect waves-light btn-small #c62828 red darken-3"
            >
              {this.props.onCancelButtonText}
            </button>
            <button
              onClick={this.props.onConfirm}
              class="btn waves-effect waves-light btn-small #2e7d32 green darken-3
              "
            >
              {this.props.onConfirmButtonText}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  modalBackDrop: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    left: '0',
    top: '0',
    background: 'rgba(51,51,51,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '80%',
    background: 'white',
    border: '1px solid #ccc',
    boxShadow: '-2rem 2rem 2rem rgba(black, 0.2)',
    display: 'flex',
    flexDirection: 'column'
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'center',
    borderBottom: '1px solid #ccc',
    padding: '1rem',
    margin: '0'
  },

  content: {
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem'
  },

  actions: {
    display: 'flex',
    justifyContent: 'center',
    borderTop: '1px solid #ccc',
    padding: '0.5rem 1rem',
    background: '#eee'
  }
};

export { Modal };
