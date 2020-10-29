const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

//container for the module to be exported
let lib = {};

//base directory
lib.baseDir = path.join(__dirname,'/../.data/');

//write data to a file
lib.create = (dir,fileName,data,callback)=>{
    //open the file for writing
    fs.open(lib.baseDir+dir+'/'+fileName+'.json','wx',(err,fileDescriptor)=>{
        if(!err && fileDescriptor){
            //convert data to string
            let stringData = JSON.stringify(data);

            //write to file and close it
            fs.writeFile(fileDescriptor,stringData,(err)=>{
                if(!err){
                    fs.close(fileDescriptor,(err)=>{
                        if(!err){
                            callback(false);
                        }else{
                            callback('Error closing file!')
                        }
                    });
                }else{
                    callback('Error wrting to new file!')
                }
            });

        }else{
            callback('Could not create file, it may already exist!');
        }
    });
};

// Read data from a file
lib.read = (dir,fileName,callback)=>{
    fs.readFile(lib.baseDir+dir+'/'+fileName+'.json', 'utf8', (err,data)=>{
        if(!err){
            parsedData = helpers.parseJsonToObject(data);
            callback(false,parsedData);
        }else{
            callback(err,data);
        }
    });
  };

//update data in a file
lib.update = (dir,fileName,data,callback)=>{
    //open file for writing
    fs.open(lib.baseDir+dir+'/'+fileName+'.json','r+',(err,fileDescriptor)=>{
        if(!err && fileDescriptor){
            //convert data to string
            let stringData = JSON.stringify(data);

            //truncate file
            fs.ftruncate(fileDescriptor,(err)=>{
                if(!err){
                    fs.writeFile(fileDescriptor,stringData,(err)=>{
                        if(!err){
                            fs.close(fileDescriptor,(err)=>{
                                if(!err){
                                    callback(false);
                                }else{
                                    callback('Error while closing existing file!');
                                }
                            })
                        }else{
                            callback('Error writing to existing file!');
                        }
                    });
                }else{
                    callback('Error truncating file!');
                }
            })
        }else{
            callback('Error while opening file!');
        }
    });
};

//delete file
lib.delete = (dir,fileName,callback)=>{
    //unlink the file
    fs.unlink(lib.baseDir+dir+'/'+fileName+'.json',(err)=>{
        if(!err){
            callback(false);
        }else{
            callback('Error deleting file!',err);
        }
    });
}

module.exports = lib;