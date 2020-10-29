
//container for all the environments
let environments = {}


//staging (default) environment
environments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging',
    'hashingSecret' : 'thisIsASecret'
}

//production environment
environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret' : 'thisIsAlsoASecret'
};

//determine which environment was passed as a command line argument
let currentEvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//check that the current environment is one of the default environment
let environmentToExport = typeof(environments[currentEvironment]) != 'undefined' ? environments[currentEvironment] : environments.staging;

//export the module
module.exports = environmentToExport;