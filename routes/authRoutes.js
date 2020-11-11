'use strict'

//Our middleware/variables/etc initialization
var authController = require(`../controllers/authController`);
var params = require(`../params`);
var signKey = process.env.DEMO_PRIVATE_KEY;
const jwt = require('jsonwebtoken');

module.exports = function(app){
    app.route('/api/auth/signin')
    .post(
    authController.authenticateUser, 
    (req, res) => {
        var cert = signKey;

        jwt.sign({
                user: {
                    id: req.user.id,
                    username: req.user.username,
                    accesses: req.user.accesses
                }
            },
            cert, 
            {
                expiresIn: req.user.expiresIn,
                audience: req.user.audience,
                issuer: params.issuer
            },
            (err, token) => {
                if(err){
                    console.log(err);
                    res.status(403).json({error: "The provided credentials are not valid."});
                } else { 
                res.json({
                    token: token
                });
            }
        });
    });
}