'user strict'

app.controller('profileCtrl', function(profile){
	var prof = this;
	prof.currentUser = profile;
})