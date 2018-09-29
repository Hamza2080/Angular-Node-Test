'use strict';

var nodemailer = require('nodemailer');
var myEmail = 'hamzajaved2080@gmail.com';
var myPassword = 'blackmetal114';
var jwt = require("jsonwebtoken");
var tokenSecret = "secretissecet";

module.exports = function (Appuser) {

  /**
   * 
   * @description send verification email to user
   * 
   */
  Appuser.sendEmail = function (emailObj, cb) {
    // nodemailer requires transport service to send an email
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: myEmail,
        pass: myPassword
      }
    });

    const mailOptions = {
      from: emailObj.from, // sender address
      to: emailObj.to, // list of receivers
      subject: emailObj.subject, // Subject line
      html: emailObj.html // plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        cb(err)
      else
        cb(null, info);
    });
  }

  Appuser.remoteMethod('sendEmail', {
    accepts: {
      arg: 'emailObj',
      type: 'object'
    },
    returns: {
      arg: 'emailObj',
      type: 'object'
    }
  });

  /**
   *  @description operation hook attached on create method on appuser model, which attach 
   * jsonwebtoken with user.
   */

  Appuser.observe('before save', function (ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      //Assigning token
      var token = jwt.sign({
          id: ctx.instance.username
        },
        tokenSecret, // Token Secret that we sign it with
        {
          expiresIn: "1d" // Token Expire time
        }
      );
      ctx.instance.jwtoken = token;
      next();
    } else next()
  });

  /**
   *  @description operation hook attached on create method on appuser model, which send verification
   * email to user.
   */

  Appuser.observe('after save', function (ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      if (ctx.instance.username != "admin") {
        let emailObj = {
          from: 'hamzajaved2080@gmail.com',
          to: ctx.instance.email,
          subject: 'Email verification',
          html: `Please click on the given link and verify your email <a href="http://localhost:3000/confirmEmail/${ctx.instance.id}/${ctx.instance.jwtoken}">http:localhost:3000/confirmEmail/${ctx.instance.id}/${ctx.instance.jwtoken}</a> <br /> if you not recognize the email please ignore it.`
        }
        Appuser.sendEmail(emailObj, function (error, emailDetail) {
          if (error) next(error);
          else {
            Appuser.app.models.RoleMapping.create({
              principalType: 'USER',
              principalId: ctx.instance.id,
              roleId: 2
            }, function (err, roleMap) {
              if (err) next(err);
              else next();
            })
          }
        })
      } else next();
    } else next()
  });

  /**
   *  @description remote hook attach with model login function and add user role inside return object of login function.
   */

  Appuser.afterRemote('login', function (ctx, userObj, next) {
    if (userObj.userId) {
      Appuser.findById(userObj.userId,
        function (err, user) {
          if (user.username == 'admin') {
            userObj.userRole = "admin"
            next();
          } else {
            userObj.userRole = "user"
            next();
          }
        })
    } else next("user role not found");
  });


  /**
   *  @description remote method returns all user to admin
   */
  Appuser.getAllUser = function (cb) {
    Appuser.find(function (error, data) {
      if (error) cb(error);
      else
        cb(null, data);
    })
  }

  Appuser.remoteMethod('getAllUser', {
    http: {
      path: '/getAllUser',
      verb: 'get'
    },
    returns: {
      arg: 'user',
      type: 'object'
    }
  });
};
