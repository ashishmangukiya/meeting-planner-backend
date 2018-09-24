const config=require('./../config/configuration');
const controller=require('./../controllers/userController');
const auth=require('../middlewares/auth');

let setRouter=(app)=>{
let baseUrl=config.version+'/user';

app.post(baseUrl+'/signup',controller.signUpFunction);
/**
 * @apiGroup user
 * @apiVersion 0.0.1
 * @api {post} /api/v1/user/signup to create new user
 * 
 * @apiParam {string} firstName first name of the user.(body params)(required)
 * @apiParam {string} lastName last name of the user.(body params)(required)
 * @apiParam {string} email email id of the user.(body params)(required)
 * @apiParam {number} mobileNumber mobileNumber of the user.(body params)(required)
 * @apiParam {strign} country user's country name.(body params)(required)
 * @apiParam {string} password password of the user.(body params)(required)
 * 
 * @apiSuccess {object} apiResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} Success-response:
 * {
    "error": false,
    "message": "User created",
    "status": 200,
    "data": {
        "userId": "kauJhCLvW",
        "firstName": "sherul",
        "lastName": "patel",
        "activated": false,
        "country": "IN",
        "email": "sherulpatel@gmail.com",
        "mobileNumber": "8087977048",
        "recoveryPassword": "",
        "_id": "5ba7340ad080cb0ac34a117e",
        "__v": 0
   }       }
   @apiErrorExample {json} Error-Response:
   {
    "error": true,
    "message": "User Already Present With this Email",
    "status": 403,
    "data": null
    }
 */
app.post(baseUrl+'/login',controller.loginFunction);
/**
 * @apiGroup user
 * @apiVersion 0.0.1
 * @api {post} /api/v1/user/login to login user
 * 
 * @apiParam {string} email email id of the user.(body params)(required)
 * @apiParam {string} password password of the user.(body params)(required)
 * 
 * @apiSuccess {object} apiResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} success-response:
 * { 
    "error": false,
    "message": "Login Successful",
    "status": 200,
    "data": {
        "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IjVDbUt1aTV0RyIsImlhdCI6MTUzNzY4NTI5MjA1MywiZXhwIjoxNTM3NzcxNjkyLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJtZWV0aW5nUGxhbm5lciIsImRhdGEiOnsidXNlcklkIjoiV3dfbkxfWkdxIiwiZmlyc3ROYW1lIjoiYXNoaXNoIiwibGFzdE5hbWUiOiJwYXRlbCIsImFjdGl2YXRlZCI6dHJ1ZSwiYWNjb3VudFZlcmlmaWNhdGlvbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDIwMC9lbWFpbC12ZXJpZnkvdXNlci9Xd19uTF9aR3EvN212MU8yYWRzTiIsImNvdW50cnkiOiJ1bmRlZmluZWQiLCJlbWFpbCI6ImFzaGlzaG1hbmd1a2l5YXBtQGdtYWlsLmNvbSIsIm1vYmlsZU51bWJlciI6IjkxODQ0NjY4MDY0OCIsInJlY292ZXJ5UGFzc3dvcmQiOiI5QkFFQWxKYy0ifX0.bUlz_UkGJwD1rFCY0ns0WgmM5RSMYJgKooad4U21vlk",
        "userDetails": {
            "userId": "Ww_nL_ZGq",
            "firstName": "ashish",
            "lastName": "patel",
            "activated": true,
            "country": "IN",
            "email": "ashishmangukiyapm@gmail.com",
            "mobileNumber": "918446680648",
            "recoveryPassword": "9BAEAlJc-"
        }
    }
}
@apiErrorExample {json} error-response:
{
    "error": true,
    "message": "no user detail found",
    "status": 404,
    "data": null
}
 */
app.post(baseUrl+'/resetPassword',controller.resetPasswordFunction);
/**
 * @apiGroup user
 * @apiVersion 0.0.1
 * @api {post} /api/v1/user/resetPassword to reset user's password
 * 
 * @apiParam {string} email email id of the user.(body params)(required)
 *  
 * @apiSuccess {object} apiResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} success-response:
    {
    "error": false,
    "message": "Password reset Successfully",
    "status": 200,
    "data": {
        "error": false,
        "message": "Password reset successfully",
        "status": 200,
        "data": {
            "n": 1,
            "nModified": 1,
            "ok": 1
        }
    }
}
@apiErrorExample {json} error-response:
{
    "error": true,
    "message": "no user found",
    "status": 404,
    "data": null
}
 */
app.post(baseUrl+'/updatePassword',controller.updatePasswordFunction);
/** 
 * @apiGroup user
 * @apiVersion 0.0.1
 * @api {post} /api/v1/user/updatePassword to update user's password
 * 
 * @apiParam {string} recoveryPassword recoveryPassword of the user.(body params)(required)
 * @apiParam {string} password new password of the user.(body params)(required)
 * 
 * @apiSuccess {object} apiResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} success-response:
{
    "error": false,
    "message": "Password Update Successfully",
    "status": 200,
    "data": {
        "error": false,
        "message": "Password Updated successfully",
        "status": 200,
        "data": {
            "n": 1,
            "nModified": 1,
            "ok": 1
        }
    }
}
@apiErrorExample {json} error-response:
{
    "error": true,
    "message": "No User Details Found",
    "status": 404,
    "data": null
}
 */
app.post(baseUrl+'/logout',auth.isAuthorized,controller.logout);
/**
 * @apiGroup user
 * @apiVersion 0.0.1
 * @api {post} /api/v1/user/logout to logout user
 * 
 * @apiParam {string} authToken authToken of the user.(body params)(required)
 * 
 * @apiSuccess {object} apiResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} success-response:
{
    "error": false,
    "message": "Logged Out Successfully",
    "status": 200,
    "data": null
}
@apiErrorExample {json} error-response:
{
    "error": true,
    "message": "Already Logged Out or Invalid User",
    "status": 404,
    "data": null
}
*/
app.post(baseUrl+'/get/all/message',auth.isAuthorized,controller.getAllMessages)
/** 
 * @apiGroup user
 * @apiVersion 0.0.1
 * @api {post} /api/v1/user/get/all/message to get all meeting schedules of user
 * 
 * @apiParam {string} userId userId of the user.(body params)(required)
 * @apiParam {string} authToken authToken of the user.(body params)(required)
 * 
 * @apiSuccess {object} apiResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} success-response:
{
    "error": false,
    "message": "message list found",
    "status": 200,
    "data": [
        {
            "color": {
                "primary": "#ad2121",
                "secondary": "#FAE3E3"
            },
            "resizable": {
                "beforeStart": true,
                "afterEnd": true
            },
            "messageId": "TcG_0scnX",
            "title": "interview at google",
            "userId": "Ww_nL_ZGq",
            "userName": "ashish",
            "alert": true,
            "description": "bring two resume copy",
            "userEmailId": "ashishmangukiyapm@gmail.com",
            "adminId": "l1QP8Gn41",
            "adminName": "ashish-admin",
            "start": "2018-09-22T15:33:00.000Z",
            "end": "2018-09-22T18:29:59.999Z",
            "draggable": true,
            "_id": "5ba644faef95f51643e4a0cc",
            "__v": 0
        }   
    ]
}
@apiErrorExample {json} error-response:
{
    "error": true,
    "message": "you don't have any schedule",
    "status": 500,
    "data": null
}
 */
app.post(baseUrl+'/account/verify',controller.accountVerify)
/**
 * @apiGroup user
 * @apiVersion 0.0.1
 * @api {post} /api/v1/user/account/verify to verify user's account
 * 
 * @apiParam {string} userId  userId of the user.(body params)(required)
 * @apiParam {string} secretId secretId of the user.(body params)(required)
 * 
 * @apiSuccess {object} apiResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} success-response:
{
    "error": false,
    "message": "account verified",
    "status": 200,
    "data": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    }
}
@apiErrorExample {object} error-response:
{
    "error": true,
    "message": "detail not found",
    "status": 500,
    "data": null
}
*/
}
module.exports={
setRouter:setRouter
}