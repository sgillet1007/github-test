var myApp = angular.module('myApp', []);

myApp.controller('userController', function($scope, $http) {
	$scope.editing = false;
	
	$http.get('/users/get').then(function(response){
		var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var joinedYear = response.data.created_at.slice(0, 4);
		var joinedMonth = monthNames[Number(response.data.created_at.slice(5, 7))-1];
		var joinedDate = joinedMonth + ", " + joinedYear;
		$scope.userData = {
			_id				   : String(response.data.id),
			name 			   : response.data.name,
			location		   : response.data.location,
			email			   : response.data.email,
			company			   : response.data.company,
			hireable		   : response.data.hireable,
			bio				   : response.data.bio,
			githubProfile	   : response.data.html_url,
			githubSince		   : joinedDate,
			reposNum		   : response.data.public_repos,
			followers		   : response.data.followers,
			starredRepos	   : response.data.starred_url,
			starredReposArray  : [],
			languagesList      : [],
			languagesSumStrings: [],
			profilePhoto	   : response.data.avatar_url
		};
	}).then(function(){
		return $http.get('/user/languages');
	}).then(function(response){
		$scope.userData.starredReposArray = response.data;
		var languagesArray =[];
		for(var i = 0; i<response.data.length;i++){
			languagesArray.push(response.data[i].language);
		}
		return languagesArray
	}).then(function(response){
		$scope.userData.languagesList = response;
		var langCount = $scope.count($scope.userData.languagesList);
		var langStringArray = [];
		for (i in langCount){
			langStringArray.push("* "+i+" ("+String(langCount[''+i+'']) +" starred repos)");
		}
		$scope.userData.languagesSumStrings = langStringArray.join();
		// console.log('$scope.userData.languagesSumStrings: ', $scope.userData.languagesSumStrings);
	}).then(function(){
		console.log("*** CHECKING $scope.userData before POST: ", $scope.userData)
		$http.post('/users/create', $scope.userData);
	}).then(function(){
		return $http.get('/users/getUser');
	}).then(function(responseData){
		$scope.userData = responseData.data;
	}), function(error){
		console.log("Error: ", error);
	};
	
	$scope.editToggle = function(){
		$scope.editing = !$scope.editing;
	};
	
	$scope.updateUser = function(){
		$http.post('/users/putUser', $scope.userData).then(function(response){
			console.log('User updated!!')
		}), function(error){
		console.log("Error: ", error);
		};
		$scope.editing = !$scope.editing;
	};
	//returns object with counts of each unique element from input array
	$scope.count = function(array, classifier) {
    	return array.reduce(function(counter, item) {
        	var p = (classifier || String)(item);
        	counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
        	return counter;
    		}, {})
	};
});

myApp.controller('rolodexController', function($scope, $http){
	$http.get('/getUsers').then(function(response){
		$scope.rolodex = response.data;
		console.log("$scope.rolodex: ", $scope.rolodex)
	}),function(error){
		console.log("Rolodex Error: ", error);
	};

});