/* Request handlers */

//dependencies
const _data = require('./data');
const helpers = require('./helpers');

//define the handlers
let handlers = {};

handlers.users = (data,callback)=>{
    let acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data,callback);
    }else{
        callback(405);
    }
};

//container for users sub methods
handlers._users = {}

//users post
handlers._users.post = (data,callback)=>{
    let firstName = typeof(data.payload.firstName) =='string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) =='string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof(data.payload.phone) =='string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) =='string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    let tosAgreement = typeof(data.payload.tosAgreement) =='boolean' && data.payload.tosAgreement == true ? true : false;

    if(firstName && lastName && phone && password && tosAgreement){
        //make sure that the user doesnt already exist
        _data.read('users',phone,(err,data)=>{
            if(err){
                //hash the password
                let hashedPassword = helpers.hash(password);

                if(hashedPassword){
                    //create the user object
                    let userObject = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone,
                        'hashedPassword' : hashedPassword,
                        'tosAgreement' : true,
                    };

                    //store the user
                    _data.create('users',phone,userObject,(err)=>{
                        if(!err){
                            callback(200);
                        }else{
                            console.log(err);
                            callback(500,{'Error':'Could not create the new user'})
                        }
                    });
                }else{
                    callback(500,{'Error':'Could not hash the user\'s password'})
                }
            }else{
                callback(400,{'Error':'A user with that phone number already exists'});
            }
        });
    }else{
        callback(400,{'Error':'Missing required Fields'})
    }
}

//users get
handlers._users.get = (data,callback)=>{
    //check that the phone number provided is valid
    let phone= typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        _data.read('users',phone,(err,data)=>{
            if(!err && data){
                delete data.hashedPassword;
                callback(200,data);
            }else{
                callback(404);
            }
        });
    }else{
        callback(400,{'Error':'Phone number not valid'})
    }
}

//users put
handlers._users.put = (data,callback)=>{
    //
}

//users delete
handlers._users.delete = (data,callback)=>{
    //
}

//define sample handler
handlers.ping = (data,callback)=>{
    //call back a http status code and payload object
    callback(200);
}

//define not found any route router
handlers.notFound = (data,callback)=>{
    callback(404);
}

//export
module.exports = handlers;