import { Meteor } from 'meteor/meteor';
import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types'; // ES6


//Modal.setAppElement('#app');

export default class PrivateHeader extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      url: '',
      modalIsOpen: false,
      errorUrl: '',

    };
  }

  componentWillMount() {
    // Make sure to bind modal to your appElement document.getElementById('app')
    Modal.setAppElement(document.getElementById('app'));
  }
  componentDidMount(){
    //this.urlInput.focus();
  }

  render(){
      return (
        <div>
          {console.log('props', this.props)}
          <button className = "button" onClick = {this.openModal.bind(this)}>Add Link</button>
          <Modal
            //style={customStyles}
            className="boxed-view-box"
            overlayClassName="boxed-view boxed-view-modal"
            isOpen={this.state.modalIsOpen}
            contentLabel="Add Link Modal"
            onAfterOpen = {() => this.urlInput.focus()}
            onRequestClose={this.closeModal.bind(this)}

            >
              <h1>Add Link</h1>
              {this.state.errorUrl ? <p>{this.state.errorUrl}</p> : undefined }
              <form className = "boxed-view-form" onSubmit = {this.onSubmit.bind(this)}>
                <input
                  type = "text"
                  ref = {(cBackRef) => this.urlInput = cBackRef}
                  name = "url"

                  placeholder = "URL"
                  value ={this.state.url}
                  onChange ={this.onChange.bind(this)}/>
                <button className = "button">Save Added Link</button>
                <button type = "button"
                        className = "button button-secondary"
                        onClick = {this.closeModal.bind(this) }>Cancel
                </button>
              </form>

          </Modal>

        </div>
      )

    }

    openModal() {
      this.setState({modalIsOpen: true});
    }
    afterOpenModal() {
    // references are now sync'd and can be accessed.
      console.log('EVENT');
      //event.target.url.focus();
    }
    closeModal() {
      this.setState({
        modalIsOpen: false,
        url: '',
        errorUrl: ''
      });
    }

    onChange(event){
      this.setState({
        url: event.target.value     // the .trim() wil prevent space bar action
      })
    }

    onSubmit(event){
      event.preventDefault();

      //const url =  event.target.url.value.trim();
      const url = this.state.url.trim();
      //if (url){
      Meteor.call('Links_Insert', url, (err) => {
        if (!err){
          //this.setState({url: ''}); //clear when no error
          this.closeModal();
        } else {
          this.setState({errorUrl: err.reason});
        }
      });
        //dbLinks.insert({url: url, userId: Meteor.userId()});
        //event.target.url.value = '';
        //console.log('Added link ', url);
      //}


    }



}

PrivateHeader.propTypes = {

  name: PropTypes.string,
  //urlInput: PropTypes.string
}


/*

const customStyles = {
content : {
  top                   : '50%',
  left                  : '50%',
  right                 : 'auto',
  bottom                : 'auto',
  marginRight           : '-50%',
  transform             : 'translate(-50%, -50%)'
}
};


render(){
    return (
      <div>
      <p>Add Link</p>
        <form onSubmit = {this.onSubmit.bind(this)} >
        <input
          type = "text"
          name = "url"
          placeholder = "URL"
          value ={this.state.url}
          onChange ={this.onChange.bind(this)}/>
        <button>Add Link</button>
        </form>
      </div>
    )

  }
  */
