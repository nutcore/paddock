Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  if (!request.object.get("authData") && !request.object.get("email")) {
    response.error("Email is required for signup");
  } else {
    response.success();
  }
});

Parse.Cloud.beforeSave("BugScore", function(request, response) {
  if (!request.user) {
    response.error("User is required");
  }

  Parse.Cloud.useMasterKey();

  var query = new Parse.Query(Parse.User);
  query.get(request.user.id, {
    success: function(user) {
      if (!user.get("authData") && !user.get('emailVerified')) {
        response.error("You haven't verified your mail yet");
      } else {
        var acl = new Parse.ACL(request.user);
        acl.setPublicReadAccess(true);

        request.object.set("createdBy", request.user);
        request.object.setACL(acl);

        response.success();
      }
    },
    error: function(error) {
      response.error(error);
    }
  });

});
