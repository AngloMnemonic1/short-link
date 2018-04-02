import {Meteor} from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types'; // ES6
import Clipboard from 'clipboard';
import moment from 'moment';

export default class LinksListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      justCopied: false,
      copyButtonText: 'Copy'
    };  // Toggle the state every second
  }

  componentDidMount(){
    this.clipboard = new Clipboard(".copyButton");  //const clipboard (local var) this.clipboard (global var)
    //console.log(this.props)

    //NOTE clipboard events
    this.clipboard.on('success', (event) => {
      //alert('It worked');
      console.log('copied:', event.text);

    });


    this.clipboard.on('error', (event) => {
      //alert('Unable to copy. Please manually copy the link.');
      event.trigger.textContent = 'Press "Ctrl + C" to copy';
      console.log('error:');
    });

  }
  componentWillUnmount(){
    this.clipboard.destroy();
  }

  render(){
    //console.log(this.props);
    // <p>Visited:  {this.props.visitedCount} - Last Visited {this.props.lastVisitedAt}</p>
    return (
       <div className = "item">
          <h2> url {this.props.url}</h2>
          <p className = "item-message">short url {this.props.shortUrl}</p>
          {/*<p>Visible:  {this.props.visible.toString()}</p>*/}
          {this.renderStats()}
          <div className = "button-item">
            <a className = "button button-pill button-link" href = {this.props.shortUrl} target = "_blank">
              Visit
            </a>
            <button className = "copyButton button button-pill"
                    key = {this.props._id}
                    onClick = {this.onClick.bind(this)}
                    data-clipboard-text = {this.props.shortUrl}
                    >
                    {this.state.copyButtonText}
            </button>
            <button className = "button button-pill" onClick = {() => {
              // !this.props.visible revese the Boolean
              Meteor.call('links-setVisibility', this.props._id, !this.props.visible);
            }}>
              {this.props.visible ? 'Hide' : 'Unhide'}
            </button>
          </div>
       </div>
    );
  }

  renderStats(){
    //ternary operator
    const visitMessage = this.props.visitedCount == 1 ? 'Visit' : 'Visits';
    let visitedMessage = null;
    if (typeof this.props.lastVisitedAt == 'number'){
      const momentStamp = moment(this.props.lastVisitedAt);
      visitedMessage = '(visited ' + momentStamp.fromNow() + ')';
    }
    return <p className = "item-message">{this.props.visitedCount} {visitMessage} {visitedMessage}</p>

  }
  onClick() {
    this.setState({
      justCopied: true,
      copyButtonText: 'Copied'
    });

    setTimeout( () => {
        //event.trigger.textContent = 'Copy';
      this.setState({
        justCopied: false,
        copyButtonText: 'Copy'
      });
      console.log('reset');
    }, 1000);
  } // end On logout

}

LinksListItem.propTypes = { //defines the type sent to the class
  _id: PropTypes.string.isRequired,
  shortUrl: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  visitedCount: PropTypes.number.isRequired,
  lastVisitedAt: PropTypes.number
};
