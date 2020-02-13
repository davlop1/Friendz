'use strict'

app.controller('AuthCtrl', function(Auth, $state){
	var auth = this;

	auth.login = function(){
		console.log('Bouton connexion cliqué');

		return Auth.login().then(function(result){
			$state.go('app.home');
		});
		
	};

	auth.logout = function(){
		Auth.logout();
	};
});