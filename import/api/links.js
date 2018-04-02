import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
export const dbLinks = new Mongo.Collection('links');
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';


if (Meteor.isServer){
  //NOTE publication ---------------
  Meteor.publish('linksPub', function(){
    //function() allows access to this binding
    return dbLinks.find( { userId: this.userId } );
  });
  //---------------------------------
}


Meteor.methods({

  //NOTE Links_Insert -----------
  Links_Insert: function(url){ // eslint-disable-line meteor/audit-argument-checks
    if (!this.userId){
      //not logged in
      throw new Meteor.Error('Not-authorised'); //stops code when run
    }

    //NOTE SimpleSchema------------------------------------
    new SimpleSchema({
      url: {
        type: String,
        label: 'Your link',
        regEx: SimpleSchema.RegEx.Url
      }
    }).validate({url: url})
    //-----------------------------------

    dbLinks.insert({
      _id: shortid.generate(),  //generate shorter id if this line absent autogenerate long id
      url: url,
      userId: this.userId,
      visible: true,
      visitedCount: 0,
      lastVisitedAt: null
    });



  },
  //-----------------------------------
  'links-setVisibility'(_id, visible){ // eslint-disable-line meteor/audit-argument-checks

    if (!this.userId){
      //not logged in
      throw new Meteor.Error('Not-authorised'); //stops code when run
    }
    new SimpleSchema({
      _id: {
        type: String,
        label: 'Hidden',
        min: 1
      },
      visible: {
        type: Boolean
      }
    }).validate({_id: _id, visible: visible }); // eslint-disable-line meteor/audit-argument-checks
    //update the database record
    dbLinks.update({ _id: _id,
      userId: this.userId},
      {$set:{
        visible: visible
         }
    });

  },
  'links-trackVisit'(_id){ // eslint-disable-line meteor/audit-argument-checks
    new SimpleSchema({
      _id: {
        type: String,
        label: 'Hidden',
        min: 1
      }
    }).validate({_id: _id});
      //update the database record
    dbLinks.update({ _id: _id},{
      $set:{
        lastVisitedAt: new Date().getTime()
      },
      $inc:{
        visitedCount: 1
      }
    });
  }

});

/*
greetUser:function(name = ''){

  if (!name){
    throw new Meteor.Error('invalide arguments', 'Name is required')
  }
   console.log('greetUser is running');
   return 'Hello '+ name + '!';
},

addNumbers:function(a, b){
  if (typeof a === 'number' && typeof b === 'number' ){
    var x = Number(a) + Number(b);
    return 'Sum '+ x;
  } else {
  throw new Meteor.Error('Invalid type', 'Not a number');
  }
}




*/
