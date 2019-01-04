const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// for errors
const { validationResult } = require('express-validator/check')

exports.signup = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {  //if there are erros
        const error = new Error('Validation failed')
        error.statusCode = 422
        error.data = errors.array() // keep all errors
        throw error
    }
    console.log('it is working')

   
     const email = req.body.email
     const password = req.body.password

     bcrypt.hash(password, 12)   //hashing with salt 12
     .then(hashpassword =>{
         const user = new User({
             email: email,
             password: hashpassword
         })
         return user.save()
     }
     )
     .then(result => {
         res.status(201).json({message: 'user created successfully', userId: result._id})
     }
    )
     .catch(err => {
         if (!err.statusCode) {
             RegExp.statusCode = 500
         }
       next(err) //throwing the error
     })
}

exports.login = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    
    let loadeduser // where to store the user logged in
     User.findOne({email: email})
     .then(user => {
         
        if (!user) {
           const error = new Error('This email could not be found')
           error.statusCode = 401 // user is not authenticated  
           throw error
        }
         loadeduser = user
         return bcrypt.compare(password, user.password) //use return to give a promise
     })
     .then(isequal => {
         
         if (!isequal) {
             const error = new Error('The password entered is wrong')
             error.statusCode = 401
             throw error
        }
         const token = jwt.sign(    //generating the token for the user logged in
            // token = json data + signature. we can add any data we want 
            // _id is mongodb object. it needs to be converted to a string
            {
                 email: loadeduser.email,
                 userId: loadeduser._id.toString()
             },
             'somesupersecretsecret', // the private key used for the signature
             { expiresIn: '1h'}
         )
         res.status(200).json({token: token, userId: loadeduser._id.toString()})
     })
     .catch(err => {
         if (!err.statusCode) {
             err.statusCode = 500 //network error
         }
         next(err)
     })
}