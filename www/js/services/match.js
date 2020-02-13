'use strict'

app.factory('Match', function($firebaseArray, $ionicPopup){
	var ref = firebase.database().ref();

	var Match = {
		allMatchesByUser: function(uid){
			return $firebaseArray(ref.child('matches').child(uid));
		},

		checkMatch: function(uid1, uid2){
			var check = ref.child('likes').child(uid2).child(uid1);

			check.on('value', function(snap){
				if (snap.val() != null){
					ref.child('matches').child(uid1).child(uid2).set(true);
					ref.child('matches').child(uid2).child(uid1).set(true);

					$ionicPopup.alert({
						title: "It's a match !",
						template: "Il semblerait qu'il y ait du feeling dans l'air ;)"
					});
				}
			})
		},

		removeMatch: function(uid1, uid2){
			ref.child('matches').child(uid1).child(uid2).remove();
			ref.child('matches').child(uid2).child(uid1).remove();
		}
	};

	return Match;
});