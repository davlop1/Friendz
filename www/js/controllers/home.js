'use strict'

app.controller('HomeCtrl', function(Auth, $ionicLoading, $scope, Like, uid){
	var home = this;

	home.currentIndex = null;
	home.currentCardUid = null;

	var currentUid = uid;

	var maxAge = null;
	var men = null;
	var women = null;

	$scope.show = function(){
		$ionicLoading.show({
			template: '<ion-spinner icon="bubbles"></ion-spinner>'
		});
	};

	$scope.hide = function(){
		$ionicLoading.hide();
	};

	function init(){
		$scope.show();

		home.profiles = []

		maxAge = JSON.parse(window.localStorage.getItem('maxAge')) || 30;
		men = JSON.parse(window.localStorage.getItem('men'));
		men = men === null? true : men;
		women = JSON.parse(window.localStorage.getItem('women'));
		women = women === null? true : women;

		Auth.getProfilesByAge(maxAge).$loaded().then(function(data){
			for(var i = 0; i < data.length; i++){
				var item = data[i]

				if((item.gender == 'male' && men) || (item.gender == 'female' && women)){
					if(item.$id != currentUid){
						home.profiles.push(item);
					};
				}
			}
			home.profiles = sort(home.profiles);

			Like.allLikesByUser(currentUid).$loaded().then(function(likesList){
				home.profiles = _.filter(home.profiles, function(obj){
					return _.isEmpty(_.where(likesList, {$id: obj.$id}));
				})
			});

			if (home.profiles.length > 0){
				home.currentIndex = home.profiles.length - 1;
				home.currentCardUid = home.profiles[home.currentIndex].$id;
			}

			$scope.hide();
		});
	};

	function sort(array){
		return array.sort(function(){
			return .5 - Math.random();
		});
	};


	$scope.$on('$ionicView.enter', function(e){
		init();
	});

	home.nope = function(index, like_uid){
		Like.addNope(currentUid, like_uid);
		home.cardRemoved(index);
		console.log('Refus - balayage à gauche');
	};

	home.like = function(index, like_uid){
		Like.addLike(currentUid, like_uid);
		home.cardRemoved(index);
		console.log('Like - balayage à droite');
	};

	home.cardRemoved = function(index){
		home.profiles.splice(index, 1);
		console.log('suppression de la carte');

		if (home.profiles.length > 0){
			home.currentIndex = home.profiles.length - 1;
			home.currentCardUid = home.profiles[home.currentIndex].$id;
		}
		console.log('User id du profil actuellement affiché:' + home.currentCardUid);
	};

});