import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker'
import React from 'react'
import FlipMove from 'react-flip-move';

import { dbLinks } from '../api/links';
import PropTypes from 'prop-types'; // ES6
import LinksListItem from './LinksListItem'

//NOTE container component
export default class LinksList extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      links: []
    };
  }
  //---------------------------------------
  componentDidMount() {

    //NOTE set the session
    /* global sessionDict:true */
    sessionDict = new ReactiveDict('sessionDict')
    sessionDict.set('showVisible', true);
    //console.log('sessionDict',sessionDict.get('showVisible'));

    //NOTE links tracker
    this.linksTracker = Tracker.autorun(
      () => {
        //NOTE subscription
        Meteor.subscribe('linksPub');
        const dbCollection = dbLinks.find({
          visible: sessionDict.get('showVisible')} //sessionDict.get('showVisible')
        ).fetch();
        //console.log('dbCollection ', dbCollection);
        this.setState({links: dbCollection});
      }
    );
  }
  //------------------------------------------
  componentWillUnmount(){
      console.log('componentWillUnmount LinksList');
      this.linksTracker.stop();
  }
  //-----------------------------------------
  render(){
    return (
      <div>

        {/*<p>Links list</p>*/}
        <div>
          <FlipMove duration={750} easing="ease-out" maintainContainerHeight = {true}>
          {this.renderLinksListItems()}
          </FlipMove>
        </div>
      </div>
    ) //return end
  } //render end
  //-----------------------------------------

  renderLinksListItems(){
    if (this.state.links.length == 0){
      return (
          <div className = "item">
            <p className = "item-statusMessage">No links found.</p>
          </div>
      );
    }
    return this.state.links.map( (link) => {
      const shortUrl = Meteor.absoluteUrl(link._id);
      return <LinksListItem key = {link._id} shortUrl = {shortUrl} {...link}/> //<p key = {link._id} >URL {link.url}</p>
    });

  }


} //LinksList end
LinksList.propTypes = { //defines the type sent to the class
  links: PropTypes.array
};
