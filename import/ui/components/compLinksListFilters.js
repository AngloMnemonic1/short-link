//import { Tracker } from 'meteor/tracker'
import React from 'react';

//import { ReactiveDict } from 'meteor/reactive-dict';


export default class LinksListFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isChecked: false
    };
  }

  //---------------------------------------
  componentDidMount() {
      //this.FilterTracker = Tracker.autorun(
      //  function(){
          //const hello = sessionDict.get('showVisible');
        //  this.setState({isChecked: sessionDict.get('showVisible')})
        //});
  }
  //------------------------------------------
  componentWillUnmount(){
    //  this.FilterTracker.stop();
  }
  //-----------------------------------------

  render(){
    return (
      <div>
        <label className = "checkbox">
          <input className = "checkbox-box"
            type = "checkbox"
            checked = {this.state.isChecked}
            onChange = {(event) => {
            /* global sessionDict:true */
            sessionDict.set('showVisible', !event.target.checked);
            this.setState({isChecked: !this.state.isChecked})
            //console.log(event.target.checked);
          }}/>
          show hidden links
        </label>
      </div>
    );
  }


}

/*

this.FilterTracker = Tracker.autorun(
  () => {
    /*  sessionDict:true
    this.setState({isChecked: sessionDict.get('showVisible')})  })

    this.FilterTracker.stop();


export  default () => {
  return (
    <div>
      <label>
        <input type = "checkbox" onChange = {(event) => {
          console.log(this.props);
        }}/>
        show hidden links
      </label>
    </div>
  );
}

*/
