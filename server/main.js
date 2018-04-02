import { Meteor } from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import { WebApp} from 'meteor/webapp';
import SimpleSchema from 'simpl-schema';

import { dbLinks} from '../import/api/links';
import '../import/startup/simple-schema-config.js';

Meteor.startup(() => {
  // code to run on server at startup
  Accounts.validateNewUser((user) => {
    const email = user.emails[0].address;
    //NOTE SimpleSchema------------------------------------
      new SimpleSchema({
        email: {
          type: String,
          label: 'Your link',
          regEx: SimpleSchema.RegEx.Email
        }
      }).validate({email: email})
    //-----------------------------------

    console.log('this is the user ', user);
    return true
  });

  /*NOTE: WebApp - Request comes in, run middleware one at a time
    send them that page
  */
  WebApp.connectHandlers.use((request, response, next) => {
    //console.log(request.url);
    const _id = request.url.slice(1);
    const link = dbLinks.findOne({_id: _id});
    if (link){
      // redirect
      response.writeHead(302, {
        'Location': link.url
      });
        response.end();
        Meteor.call('links-trackVisit',_id);
    }else{
      next()
    }
  });

  WebApp.connectHandlers.use((request, response, next) => {
    console.log('This is from custom middleware');
    console.log(request.url, request.method, request.headers, request.query);
    //set http status code
    //response.statusCode = 302;  //httpstatuses.com
    //set http headers
    //response.setHeader('Location', 'http://www.google.com');
    //set http body
    //response.write('<h1>This is my middleware at work</h1>');
    //end http request
    next();
  });

});

//petSchema.validate({

//});

/*

//redirect all pages to google.co.uk
//response.writeHead(302, {
//  'Location': 'http://www.google.co.uk'
//});
//response.end();

WebApp.connectHandlers.use((request, response, next) => {
  console.log('This is from custom middleware');
  console.log(request.url, request.method, request.headers, request.query);
  //set http status code
  //response.statusCode = 404;  //httpstatuses.com
  //set http headers
  //response.setHeader('my-custom-header', 'Steve was here');
  //set http body
  //response.write('<h1>This is my middleware at work</h1>');
  //end http request
  //response.end();

  next();
});

// SimpleSchema------------------------------------
try {
  new SimpleSchema({
    email: {
      type: String,
      label: 'Your link',
      regEx: SimpleSchema.RegEx.Email
    }
  }).validate({email: email})
} catch(e){
  throw new Meteor.Error(400, e.message)
}
//-----------------------------------

//NOTE: Meteor method server
Meteor.call("greetUser",'George', function(error, result){
  if(error){
    console.log("error", error);
  }
  if(result){
     console.log("Greet user arguments server ", result);
  }
});


const petSchema = new SimpleSchema({
  name:{
    type: String,
    min: 1,
    max: 200,
    optional: true
  },
  age: {
    type: Number,
    min: 0
  },
  contactNumber:{
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Phone
  }

});

const employeeSchema = new SimpleSchema({
  name: {
    type: String,
    min: 1,
    max: 200
  },
  hourlyWage: {
    type: Number,
    min: 0
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }

});
*/
