module.exports = function (app) {
  app.models.Role.create([{
    name: 'admin',
    description: 'admin role created when first system runs and assign to user whose id = 1.',
  },{
    name: 'user',
    description: 'user role created when first system runs and assign to user whose id > 1.',
  }], function (err, role) {
    //creating admin user...
    app.models.appuser.create({
      "email": "admin@gmail.com",
      "username": "admin",
      "mobile": 000111222333,
      "lat": 50,
      "lng": 50,
      "emailVerified": true,
      "dob": "29/10/1995",
      "password": "admin"
    }, function (err, user) {
      if (user) {
        app.models.Role.find (function (err, roles) {
          app.models.RoleMapping.create({
            principalType: 'USER',
            principalId: user.id,
            roleId: roles[0].id
          }, function (err, roleMap) {
            console.log("Admin user created, email : admin@gmail.com, password : admin");
            console.log("Admin is verified by default");
          })
        })
      }
    })
  })
}
