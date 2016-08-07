Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  if (!request.object.get("authData") && !request.object.get("email")) {
    response.error("Email is required for signup");
  } else {
    response.success();
  }
});

Parse.Cloud.beforeSave("GameScore", function(request, response) {
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
        request.object.set("createdBy", request.user);
        response.success();
      }
    },
    error: function(error) {
      response.error(error);
    }
  });

});
