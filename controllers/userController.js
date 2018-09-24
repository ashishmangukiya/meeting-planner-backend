
const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/generatePasswordLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')
const AuthModel = mongoose.model('Auth')
const adminModel=mongoose.model('adminSchema');
const emailLib = require('../libs/emailLib');
const messageModel=mongoose.model('messageSchema')
/* Models */
const UserModel = mongoose.model('userSchema')


let signUpFunction = (req, res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Email Does not met the requirement', 400, null)
                    reject(apiResponse)
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, '"password" parameter is missing"', 400, null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During User Creation', 'userController: createUser()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }// end validate user input

    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email })
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'userController: createUser', 10)
                        let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body)
                        let id=shortid.generate();
                        let newUser = new UserModel({
                            userId:id,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName || '',
                            accountVerification:`http://planner.ashishmangukiya.com/email-verify/user/${id}/${shortid.generate()}`,
                            email: req.body.email.toLowerCase(),
                            country:req.body.country,
                            mobileNumber: req.body.mobileNumber,
                            password: passwordLib.hashpassword(req.body.password),
                            createdOn: time.now()
                        })
                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'userController: createUser', 10)
                                let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject();

                                //Creating object for sending welcome email
                                let sendEmailOptions = {
                                    email: newUserObj.email,
                                    name: newUserObj.firstName + ' ' + newUserObj.lastName,
                                    subject: 'Welcome to Meeting Planner ',
                                    html: `<b> Dear ${newUserObj.firstName}</b><br> Hope you are doing well. 
                                    <br>click on below link to activate your account.<br>
                                    link-> <a href='${newUserObj.accountVerification}'>${newUserObj.accountVerification}</a>
                                    <br>
                                    <b>Meeting Planner <br>
                                    Ashish mangukiya</b>
                                    `
                                }

                                setTimeout(() => {
                                    emailLib.sendEmail(sendEmailOptions);
                                }, 2000);

                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }// end create user function


    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'User created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}// end user signup function 

// start of login function 
/* params : email,password
*/

let loginFunction = (req, res) => {
    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log("req body email is there");
                //console.log(req.body);
                UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });

            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let validatePassword = (retrievedUserDetails) => {
        console.log("validatePassword");
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    delete retrievedUserDetailsObj.accountVerification
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }

    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }

    let saveToken = (tokenDetails) => {
        console.log("save token");
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }

    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })
}



// end of the login function 


/**
 * function to logout user.
 * auth params: userId.
 */
let logout = (req, res) => {
    AuthModel.findOneAndRemove({ userId: req.user.userId }, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'user Controller: logout', 10)
            let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
            res.send(apiResponse)
        }
    })
} // end of the logout function.


/* Function to generate recoveryPassword and sending recoveryPassword via email */
/* params : email
*/

let resetPasswordFunction = (req, res) => {
    //finding user with email
    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log("req body email is there");
                console.log(req.body);
                UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });

            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }
    //reset password
    let resetPassword = (userDetails) =>{
        return new Promise((resolve, reject) => {

            let options = {
                recoveryPassword: shortid.generate()
            }
    
            UserModel.update({ 'email': req.body.email }, options).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'User Controller:resetPasswordFunction', 10)
                    let apiResponse = response.generate(true, 'Failed To Update user Password', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No User Found with given Email Id', 'User Controller: resetPasswordFunction')
                    let apiResponse = response.generate(true, 'No User Found', 404, null)
                    reject(apiResponse)
                } else {
    
    
                    let apiResponse = response.generate(false, 'Password reset successfully', 200, result)
                    resolve(apiResponse)
                    //Creating object for sending welcome email
    
                    let sendEmailOptions = {
                        email: userDetails.email,
                        subject: 'Reset Password for Meeting Planner website ',
                        html: `<h4> Hi ${userDetails.firstName}</h4>
                            <p>
                                We got a request to reset your meeting planner account password associated with this ${req.body.email} Email. <br>
                                <br>We have successfully reset your password. Please use following password as a recovery password while resetting the Password <br>
                                <br> Recovery Password : ${options.recoveryPassword} 
                            </p>
    
                            Meeting Planner
                            <br><b>Ashish mangukiya </b>
                                        `
                    }
    
                    setTimeout(() => {
                        emailLib.sendEmail(sendEmailOptions);
                    }, 2000);
    
                }
            });// end user model update
    
        });//end promise
    
    }//end reset password

    //making promise call
    findUser(req, res)
        .then(resetPassword)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Password reset Successfully', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })


}// end resetPasswordFunction

/* Function to update password and sending email */
/* params : recoveryPassword,paswword
*/

let updatePasswordFunction = (req, res) => {

    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.recoveryPassword) {
                console.log("req body recoveryPassword is there");
                console.log(req.body);
                UserModel.findOne({ recoveryPassword: req.body.recoveryPassword }, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });

            } else {
                let apiResponse = response.generate(true, '"recoveryPassword" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let passwordUpdate = (userDetails) => {
        return new Promise((resolve, reject) => {

            let options = {
                password: passwordLib.hashpassword(req.body.password),
            }

            UserModel.update({ 'userId': userDetails.userId }, options).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'User Controller:updatePasswordFunction', 10)
                    let apiResponse = response.generate(true, 'Failed To reset user Password', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No User Found with given Details', 'User Controller: updatePasswordFunction')
                    let apiResponse = response.generate(true, 'No User Found', 404, null)
                    reject(apiResponse)
                } else {


                    let apiResponse = response.generate(false, 'Password Updated successfully', 200, result)
                    resolve(apiResponse)
                    //Creating object for sending welcome email

                    let sendEmailOptions = {
                        email: userDetails.email,
                        subject: 'Password Updated for Meeting Planner website ',
                        html: `<h4> Hi ${userDetails.firstName}</h4>
                        <p>
                            Password updated successfully.
                        </p>
                        <h3> Thanks for using Meeting Planner </h3>
                        Meeting Planner  
                        <br><b>Ashish mangukiya</b>
                                    `
                    }

                    setTimeout(() => {
                        emailLib.sendEmail(sendEmailOptions);
                    }, 2000);


                }
            });// end user model update
        });
    }//end passwordUpdate

    findUser(req, res)
        .then(passwordUpdate)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Password Update Successfully', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })


}// end updatePasswordFunction


/* Function to change password and sending  email */
/* params : userId,oldPassword,newPassword
*/
// end updatePasswordFunction
let signUpAdminFunction=(req,res)=>{
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Email Does not met the requirement', 400, null)
                    reject(apiResponse)
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, '"password" parameter is missing"', 400, null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During User Creation', 'userController: createUser()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }// end validate user input

    let createAdmin = () => {
        return new Promise((resolve, reject) => {
            adminModel.findOne({ email: req.body.email })
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'userController: createUser', 10)
                        let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body)
                        let newUser = new UserModel({
                            adminId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName || '',
                            email: req.body.email.toLowerCase(),
                            mobileNumber: req.body.mobileNumber,
                            password: passwordLib.hashpassword(req.body.password),
                            createdOn: time.now()
                        })
                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'userController: createUser', 10)
                                let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject();

                                //Creating object for sending welcome email
                                let sendEmailOptions = {
                                    email: newUserObj.email,
                                    name: newUserObj.firstName + ' ' + newUserObj.lastName,
                                    subject: 'Welcome to meeting Planner website ',
                                    html: `<b> Dear ${newUserObj.firstName}</b><br> Hope you are doing well. 
                                    <br>thank you for using our Meeting Planner Website.<br>
                                    
                                    <b>CEO,Meeting Planner <br>
                                    Ashish mangukiya</b>
                                    `
                                }

                                setTimeout(() => {
                                    emailLib.sendEmail(sendEmailOptions);
                                }, 2000);

                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }// end create user function


    validateUserInput(req, res)
        .then(createAdmin)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'admin created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}

let getAllMessages=(req,res)=>{

    messageModel.find({'userId':req.body.userId},(err,result)=>{
        if(err){
            logger.error('error occured while finding message  ', 'userController: getAllMessages', 10)
            let apiResponse = response.generate(true, 'Failed To find message ', 500, null)
            res.send(apiResponse)
        }
        else if(check.isEmpty(result)){
            logger.error(`you don't have any schedule `, 'userController: getAllMessages', 10)
            let apiResponse = response.generate(true, `you don't have any schedule`, 500, null)
            res.send(apiResponse)
        }
        else{
            let apiResponse = response.generate(false, 'message list found', 200, result)
            res.send(apiResponse);
        }
    })
}

let accountVerify=(req,res)=>{
    let detail={
        account:`http://planner.ashishmangukiya.com/email-verify/user/${req.body.userId}/${req.body.secretId}`
    };
    console.log(detail)
    UserModel.find({accountVerification:detail.account},(err,userDetail)=>{
        if(err){
            logger.error('error occured while matching detail  ', 'userController: accountVerify', 10)
            let apiResponse = response.generate(true, 'Failed To verify account ', 500, null)
            res.send(apiResponse)
        }
        else if(check.isEmpty(userDetail)){
            logger.error('empty occured', 'userController: accountVerify', 10)
            let apiResponse = response.generate(true, 'detail not found', 500, null)
            res.send(apiResponse)
        }
        else{
            console.log(userDetail);
            let option={
                activated:true
            }
            UserModel.update({userId:req.body.userId},option,(err,result)=>{
                if(err){
                    logger.error('error occured while saving detail  ', 'userController: accountVerify', 10)
                    let apiResponse = response.generate(true, 'Failed To update info ', 500, null)
                    res.send(apiResponse)
                }
                else{
                    console.log(result);
                    let apiResponse = response.generate(false, 'account verified', 200, result)
                    res.send(apiResponse);
                }
              
            })

        }
    })



}

module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout,
    resetPasswordFunction: resetPasswordFunction,
    updatePasswordFunction: updatePasswordFunction,
    signUpAdminFunction:signUpAdminFunction,
    getAllMessages:getAllMessages,
    accountVerify:accountVerify
}// end exports

