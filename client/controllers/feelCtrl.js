app.controller('feelCtrl', function($scope, $http) {
	$scope.derp = "Octofeeeeeeeels";

	// attachs the webcam to the camera
	Webcam.attach('#camera');

    $scope.takeSnapshot = function() {    	
        Webcam.snap( function(data_uri) {
        	// TODO send to API

        	// temporarily show it on the page
            document.getElementById('result').innerHTML = '<img src="'+ data_uri+'"/>';
        } );
    }

});