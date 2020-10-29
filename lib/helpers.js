//dependencies
const crypto = require('crypto');
const config = require('../config');

let helpers = {};

//create a sha256 hash
helpers.hash = (str)=>{
    if(typeof(str)=='string' && str.trim().length > 0){
        let hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hash;
    }else{
        return false;
    }
}

//parse a JSON string to an object in all cases without throwing an error
helpers.parseJsonToObject = (str)=>{
    try{
        obj = JSON.parse(str);
        return obj;
    }catch(e){
        return {};
    }
}

module.exports = helpers;