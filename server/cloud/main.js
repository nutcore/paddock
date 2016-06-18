Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  if (!request.object.get("authData") && !request.object.get("email")) {
    response.error("email is required for signup");
  } else {
    response.success();
  }
});

Parse.Cloud.beforeSave("GameScore", function(request, response) {
  request.object.set("createdBy", request.user);
  response.success();
});
