const express = require('express')
const { body } = require('express-validator/check')
const user = require('../models/user')

const router = express.Router()

// registering the new user
const authcontroller = require('../controllers/auth')


router.post(
    '/signup',
     [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
        return user.findOne({email: value})
        .then(userdoc => {
            if(userdoc) {
                
                return Promise.reject('Email already exists')
            }
            
           
        })
    })
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({min: 6})
    .withMessage('Password should have at least six characters'),
       
], 
authcontroller.signup

)

router.post('/login', authcontroller.login)

module.exports = router