var jwt = require("jsonwebtoken");
var tokenSecret = "secretissecet";

module.exports = function (app) {

  // install a route confirmEmail which verifies user.
  app.get('/confirmEmail/:userId/:token', function (req, res) {
    jwt.verify(
      req.params.token, // The token to be verified
      tokenSecret, // Same token we used to sign
      function (err, _token) {
        if (err) {
          res.send("Email verification link is wrong");
        } else {
          if (req.params.userId) {
            app.models.appuser.findById(req.params.userId, function (err, user) {
              if (err) res.send(error);
              else {
                if (user) {
                  if (user.jwtoken == req.params.token) {
                    user.emailVerified = true;
                    app.models.appuser.replaceById(user.id, user, function (error, response) {
                      if (error) res.send('We are unable to verify you and redirect to login page please try again');
                      else {
                        res.redirect('http://localhost:4200/login');
                      }
                    })
                  } else res.send("Email verification link is wrong");
                } else res.send(`We are unable to find user with id ${req.params.userId}`);

              }
            })
          } else res.send('unable to find user Id in request parameters');
        }
      })
  });
}
