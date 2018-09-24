const config=require('./../config/configuration');
const controller=require('./../controllers/adminController');
const auth=require('../middlewares/adminAuth');

let setRouter=(app)=>{
let baseUrl=config.version+'/admin';

app.post(baseUrl+'/signup',controller.signUpFunction);
/**
 * @apiGroup admin
 * @apiVersion 0.0.1
 * @api {post} /api/v1/admin/signup to create new admin
 *
 * @apiParam {string} firstName first name of the admin.(body params)(required)
 * @apiParam {string} lastName last name of the admin.(body params)(required)
 * @apiParam {string} email email id of the admin.(body params)(required)
 * @apiParam {number} mobileNumber mobileNumber of the admin.(body params)(required)
 * @apiParam {strign} country admin's country name.(body params)(required)
 * @apiParam {string} password password of the admin.(body params)(required)
 * 
 * @apiSuccess {object} apiResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} success-response:
{
    "error": false,
    "message": "admin created",
    "status": 200,
    "data": {
        "adminId": "kauJhCLvW",
        "firstName": "sherul",
        "userName": "sherul-admin",
        "lastName": "patel",
        "activated": false,
        "country": "IN",
        "email": "sherulpatel97@gmail.com",
        "mobileNumber": "8087977048",
        "recoveryPassword": "",
        "_id": "5ba7340ad080cb0ac34a117e",
        "__v": 0
    }
}
@apiErrorExample {json} error-response:
{
    "error": true,
    "message": "Admin Already Present With this Email",
    "status": 403,
    "data": null
}
*/

app.post(baseUrl+'/login',controller.loginFunction);
/**
 * @apiGroup admin
 * @apiVersion 0.0.1
 * @api {post} /api/v1/admin/login to login admin
 * 
 * @apiParam {string} email email id of the admin.(body params)(required)
 * @apiParam {string} password password of the admin.(body params)(required)
 * 
 * @apiSuccess {object} apiResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} success-response:
{
    "error": false,
    "message": "Login Successful",
    "status": 200,
    "data": {
        "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IkhHM2puRklXQSIsImlhdCI6MTUzNzY4OTEwMDIyMiwiZXhwIjoxNTM3Nzc1NTAwLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJtZWV0aW5nUGxhbm5lciIsImRhdGEiOnsiYWRtaW5JZCI6ImwxUVA4R240MSIsInVzZXJOYW1lIjoiYXNoaXNoLWFkbWluIiwiZmlyc3ROYW1lIjoiYXNoaXNoIiwibGFzdE5hbWUiOiJtYW5ndWtpeWEiLCJhY3RpdmF0ZWQiOnRydWUsImNvdW50cnkiOiJJTiIsImFjY291bnRWZXJpZmljYXRpb24iOiJodHRwOi8vbG9jYWxob3N0OjQyMDAvZW1haWwtdmVyaWZ5L2FkbWluL2wxUVA4R240MS9ibUwyMDRGNldOIiwibW9iaWxlTnVtYmVyIjoiOTE4NDQ2NjgwNjQ4IiwiZW1haWwiOiJhc2hpc2htYW5ndWtpeWE5N0BnbWFpbC5jb20iLCJyZWNvdmVyeVBhc3N3b3JkIjoiZG1odGRWWG5BIn19.LphrbyAQemnYgPLFG9JeVgSND5Kj69tCoiuj1PAV2ks",
        "adminDetails": {
            "adminId": "l1QP8Gn41",
            "userName": "ashish-admin",
            "firstName": "ashish",
            "lastName": "mangukiya",
            "activated": true,
            "country": "IN",
            "mobileNumber": "918446680648",
            "email": "ashishmangukiya97@gmail.com",
            "recoveryPassword": "dmhtdVXnA"
        }
    }
}
@apiErrorExample {json} error-response:
{
    "error": true,
    "message": "admin detail not found",
    "status": 404,
    "data": null
}
 */

app.post(baseUrl+'/resetPassword',controller.resetPasswordFunction);
/**
 * @apiGroup admin
 * @apiVersion 0.0.1
 * @api {post} /api/v1/admin/resetPassword to reset admin's password
 *
 * @apiParam {string} email email id of the admin.(body params)(required)
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
    "message": "no admin details found",
    "status": 404,
    "data": null
}
 */
app.post(baseUrl+'/updatePassword',controller.updatePasswordFunction);
/**
 * @apiGroup admin
 * @apiVersion 0.0.1
 * @api {post} /api/v1/admin/updatePassword to update admin's password
 *
 * @apiParam {strign} recoveryPassword recoveryPassword of the admin.(body params)(required)
 * @apiParam {string} password new password of the admin.(body params)(required)
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
    "message": "No admin Details Found",
    "status": 404,
    "data": null
}
 */
app.post(baseUrl+'/logout',auth.isAuthorized,controller.logout);
/**
 * @apiGroup admin
 * @apiVersion 0.0.1
 * @api {post} /api/v1/admin/logout to logout admin
 *
 * @apiParam {string} authToken authToken of the admin.(body params)(required)
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
@apiErrorExample {josn} error-response:
{
    "error": true,
    "message": "Already Logged Out or Invalid admin",
    "status": 404,
    "data": null
}
*/
app.post(baseUrl+'/get/all/users',auth.isAuthorized,controller.getAllUserList);
/**
 * @apiGroup admin
 * @apiVersion 0.0.1
 * @api {post} /api/v1/admin/get/all/users to get all the users list
 *
 * @apiParam {string} adminId adminId of the admin.(body params)(required)
 * @apiParam {string} authToken authToken of the admin.(body params)(required)
 * 
 * @apiSuccess {object} apiResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} success-response:
{
    "error": "false",
    "message": "user list found",
    "status": 200,
    "data": [
        {
            "userId": "Ww_nL_ZGq",
            "firstName": "ashish",
            "lastName": "patel",
            "activated": true,
            "country": "IN",
            "email": "ashishmangukiyapm@gmail.com",
            "mobileNumber": "918446680648",
            "recoveryPassword": "-eRdWE4pk",
            "_id": "5ba32ee9c6b96616b511c9da",
            "__v": 0
        }
    ]
}
@apiErrorExample {json} error-response:
{
    "error": "true",
    "message": "admin detail not found",
    "status": 404,
    "data": null
}
*/
app.post(baseUrl+'/get/all/events',auth.isAuthorized,controller.getAllEvents);
/**
 * @apiGroup admin
 * @apiVersion 0.0.1
 * @api {post} /api/v1/admin/get/all/events to get all meeting schedules which are created by admin for perticular user 
 *
 * @apiParam {string} adminId adminId of the admin.(body params)(required)
 * @apiParam {string} userId userId of the user.(body params)(required)
 * @apiParam {string} authToken authToken of the admin.(body params)(required)
 * 
 * @apiSuccess {object} apiResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} success-response:
{
    "error": false,
    "message": "event list found",
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
            "title": "New event",
            "userId": "Ww_nL_ZGq",
            "userName": "ashish",
            "alert": true,
            "description": "",
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
    "error": "true",
    "message": "not yet created any schedule",
    "status": 404,
    "data": null
}
*/

app.post(baseUrl+'/get/user/detail',auth.isAuthorized,controller.getUserDetail);
/**
 * @apiGroup admin
 * @apiVersion 0.0.1
 * @api {post} /api/v1/admin/signup to get user detail 
 *
 * @apiParam {string} userId userId of the user.(body params)(required)
 * @apiParam {string} authToken authToken of the admin.(body params)(required)
  * 
 * @apiSuccess {object} apiResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} success-response:
{
    "error": false,
    "message": "user detail found",
    "status": 200,
    "data": [
        {
            "userId": "Ww_nL_ZGq",
            "firstName": "ashish",
            "lastName": "patel",
            "activated": true,
            "country": "IN",
            "email": "ashishmangukiyapm@gmail.com",
            "mobileNumber": "918446680648",
            "recoveryPassword": "-eRdWE4pk",
            "_id": "5ba32ee9c6b96616b511c9da",
            "__v": 0
        }
    ]
}
@apiErrorExample {json} error-response:
{
    "error": "true",
    "message": "user detail not found",
    "status": 404,
    "data": null
}
*/
app.post(baseUrl+'/account/verify',controller.accountVerify)
/**
 * @apiGroup admin
 * @apiVersion 0.0.1
 * @api {post} /api/v1/admin/account/verify to verify admin's account
 *
 * @apiParam {string} adminId adminId of the admin.(body params)(required)
 * @apiParam {string} secretId secretId of the admin.(body params)(required)
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
@apiErrorExample {json} error-response:
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