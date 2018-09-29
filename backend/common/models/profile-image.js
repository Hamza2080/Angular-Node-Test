'use strict';

var app = require('../../server/server.js');
var async = require('async');
var sharp = require('sharp');

module.exports = function (Profileimage) {
  let urlBase = 'http://localhost:3000/api';
  /*************************************************** */
  // upload image remote method...

  //----------------------------------------------------------------------------------------
  /*
  name        : imageUpload
  description : Upload Image to server

  @input      : image
              : container = string
  */

  Profileimage.remoteMethod('imageUpload', {
    accepts: [{
        arg: 'req',
        type: 'object',
        'http': {
          source: 'req'
        }
      },
      {
        arg: 'res',
        type: 'object',
        'http': {
          source: 'res'
        }
      },
      {
        arg: "userId",
        type: "string",
        required: true
      },
      {
        arg: "container",
        type: "string",
        required: true
      },
    ],
    http: {
      path: '/user/:userId/container/:container/uploadImage',
      verb: 'post'
    },
    returns: {
      arg: 'object',
      type: 'object'
    }
  });

  // method definition
  Profileimage.imageUpload = function (req, res, userId, container, cb) {
    var ImageDetail;
    Profileimage.app.models.appuser.findById(userId, function (err, user) {
      if (err) cb(err);
      else {
        if (user) {
          Profileimage.upload(req, res, function (err, response) {
            if (err) cb(err.message);
            else {
              var key = '';
              var file = response.files.image[0].name;

              var inputPath = './images/image/' + file;
              var ImagePath = './images/profile_image/';
              async.waterfall([
                function (callback) {
                  findImageByUserId(userId, callback)
                },
                function (callback) {
                  saveImageDetail(userId, file, callback);
                },
                function (imageObj, callback) {
                  changeOriginalSource(imageObj, inputPath, ImagePath, Profileimage, container, file, callback)
                }
              ], function (err, result) {
                if (err) throw err;
                cb(null, result)
              });
            }
          });
        } else cb(`user of id ${userId} not found`);
      }
    })
  }

  //find Image by userID
  function findImageByUserId(userId, callback) {
    Profileimage.app.models.profileImageData.find({
      where: {
        appuserId: userId
      }
    }, function (err, res) {
      if (err) callback(err);
      else {
        if (res.length > 0) {
          Profileimage.app.models.profileImageData.deleteById(res[0].id, function (err) {
            if (err) callback(err);
            else {
              Profileimage.removeFile('profile_image', res[0].id + res[0].extension, function (err) {
                callback();
              })
            }
          })
        } else callback();
      }
    })
  }

  //save image detail...
  function saveImageDetail(userId, file, callback) {
    var profileImageDataModel = app.models.profileImageData;
    profileImageDataModel.create({
      "image": file.substr(0, file.indexOf('.')),
      "extension": file.substr(file.lastIndexOf('.'), file.length - 1),
      "container": "profile_image",
      "filePath": "./images/profile_image/" + file,
      "appuserId": userId
    }, function (err, response) {
      if (err) callback(err)
      else callback(null, response);
    });
  }
  //cut and paste original file into another container...
  function changeOriginalSource(imageObj, inputPath, imagePath, Profileimage, container, file, callback) {
    sharp(inputPath)
      .toFile(imagePath + imageObj.id + imageObj.extension)
      .then(function () {
        Profileimage.removeFile(container, file, function (err, data) {
          if (err) throw err;
          else
            callback(null, imageObj);
        })
      })
  }

  //----------------------------------------------------------------------------------------
  /*
    name        : imageUrlDownload
    description : Download Image url from server against and imageId

    @input      : id : imageId = string

    @output     : image : object            
    */
  Profileimage.remoteMethod('imageUrlDownload', {
    accepts: [{
      arg: "id",
      type: "string",
      required: true
    }],
    http: {
      path: '/:id/imageUrlDownload',
      verb: 'get'
    },
    returns: {
      arg: 'image',
      type: 'object'
    }
  });

  Profileimage.imageUrlDownload = function (id, cb) {
    var profileImageDataModel = app.models.profileImageData;

    profileImageDataModel.find({
      where: {
        appuserId: id
      }
    }, function (err, imageObj) {
      if (err) throw err;
      else if (imageObj.length > 0) {
        var image = {};
        var url = urlBase + `/profileImages/profile_image/download/${imageObj[0].id}${imageObj[0].extension}`;
        image.url = url;
        image.id = imageObj[0].id,
        image.name = imageObj[0].image;
        image.extension = imageObj[0].extension;
        cb(null, image);
      } else cb(null, 'File not found')
    })
  }

  /*
  name        : disableRemoteMethods
  description : disable all remote methods of ImaeContainer Model(defalt remomte methods)
  */
  disableRemoteMethods(Profileimage);

  //disable remote methods...
  function disableRemoteMethods(Profileimage) {
    Profileimage.disableRemoteMethodByName("getContainers", false);
    Profileimage.disableRemoteMethodByName("getContainer", false);
    Profileimage.disableRemoteMethodByName("createContainers", false);
    Profileimage.disableRemoteMethodByName("destroyContainers", false);
    Profileimage.disableRemoteMethodByName("getFiles", false);
    Profileimage.disableRemoteMethodByName("getFile", false);
    Profileimage.disableRemoteMethodByName("removeFile", false);
    Profileimage.disableRemoteMethodByName("upload", false);
    // Profileimage.disableRemoteMethodByName("download", false);
    Profileimage.disableRemoteMethodByName("uploadStream", false);
    Profileimage.disableRemoteMethodByName("downloadStream", false);
  }
};
