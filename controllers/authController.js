const jwt = require('jsonwebtoken');
var signKey = process.env.DEMO_PRIVATE_KEY;

const params = require(`../params`);

exports.verifyUser = function(req, res, next){
    var user = req.authData.user;
    if(user){
        if(user.username){
            console.log(`Verifying user '${user.username}'.`);
            var fUser = params.users.find(obj => {
                return (obj.username == user.username);
            });
            if(fUser) { 
                console.log(`User '${user.username}' found.`);
                next(); 
            }
            else { console.log(`Could not find user '${user.username}'. (403)`); res.status(403).json({error: "The provided token is not valid."}); }
        } else { console.log(`User data has no username. (403)`); res.status(403).json({error: "The provided token is not valid."}); }
    } else { console.log(`User data is empty. (403)`); res.status(403).json({error: "The provided token is not valid."}); }
}
exports.authenticateUser = function(req, res, next){
    console.log(`Preparing to authenticate user.`);    
    var user = req.body;
    if(user){
        if(user.username && user.password){
            var fUser = params.users.find(obj => {
                return (obj.username == user.username && obj.active);
            });
            if(fUser){
                if(user.password == fUser.password){
                    req.user = {
                        id: fUser.id,
                        username: fUser.username,
                        accesses: fUser.accesses,
                        audience: fUser.audience,
                        expiresIn: fUser.expiresIn
                    };
                    console.log(`User '${req.user.username}' authenticated!`);
                    next();
                } else { console.log(`User ${user.username} has an incorrect password and/or request came from an unknown address. (403)`); res.status(403).json({error: "The provided credentials are not valid."}); }
            } else { console.log(`Could not find user '${user.username} in db. (403)`); res.status(403).json({error: "The provided credentials are not valid."}); }
        } else { console.log(`User username and/or password is empty. (403)`); res.status(403).json({error: "The provided credentials are not valid."}); }
    } else { console.log(`User data is empty. (403)`); res.status(403).json({error: "The provided credentials are not valid."}); }
}
//function verifyToken
exports.verifyToken = function(req, res, next){
    var cert = signKey;

    jwt.verify(req.token, cert, (err, authData) => {
        if(err){
            console.log(`Token is not valid. (403)`);
            res.status(403).json({error: "The provided token is not valid."});
        } else {
            req.authData = authData;
            console.log(`Token verified.`);
            next();
        }
    });
}
//FORMAT OF TOKEN
// Authorization: Bearer <access_token>
//function fetch token
exports.fetchToken = function(req, res, next){
    //get auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is not undefined
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        next();
    }else{
        //Forbidden access
        console.log(`Request header does not contain a bearer token. (403)`);
        res.status(403).json({error: "The provided token is not valid."});
    }
}


exports.canCreateData = function(req, res, next){
    try{
        let accessList = req.authData.user.accesses;
        if((accessList.indexOf("CREATE") > -1)) {
            console.log(`Authenticated user can access a CREATE request.`);
            next();
        }else{
            console.log(`Authenticated user CANNOT access a CREATE request.`);
            res.status(403).json({error: "Unauthorized access."});
        }
    }catch(err){
        logger.error(`Could not validate the users access permission.`);
        res.status(500).send({error: "Something went wrong."})
    }
}
exports.canReadData = function(req, res, next){
    try{
        let accessList = req.authData.user.accesses;
        if((accessList.indexOf("READ") > -1)) {
            console.log(`Authenticated user can access a READ request.`);
            next();
        }else{
            console.log(`Authenticated user CANNOT access a READ request.`);
            res.status(403).json({error: "Unauthorized access."});
        }
    }catch(err){
        logger.error(`Could not validate the users access permission.`);
        res.status(500).send({error: "Something went wrong."})
    }
}
exports.canUpdateData = function(req, res, next){
    try{
        let accessList = req.authData.user.accesses;
        if((accessList.indexOf("UPDATE") > -1)) {
            console.log(`Authenticated user can access a UPDATE request.`);
            next();
        }else{
            console.log(`Authenticated user CANNOT access a UPDATE request.`);
            res.status(403).json({error: "Unauthorized access."});
        }
    }catch(err){
        logger.error(`Could not validate the users access permission.`);
        res.status(500).send({error: "Something went wrong."})
    }
}
exports.canDeleteData = function(req, res, next){
    try{
        let accessList = req.authData.user.accesses;
        if((accessList.indexOf("DELETE") > -1)) {
            console.log(`Authenticated user can access a DELETE request.`);
            next();
        }else{
            console.log(`Authenticated user CANNOT access a DELETE request.`);
            res.status(403).json({error: "Unauthorized access."});
        }
    }catch(err){
        logger.error(`Could not validate the users access permission.`);
        res.status(500).send({error: "Something went wrong."})
    }
}
