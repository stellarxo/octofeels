app.controller('feelCtrl', function($scope, $http) {
	$scope.derp = "Octofeeeeeeeels";

	// attachs the webcam to the camera
	Webcam.attach('#my_camera');

    $scope.take_snapshot = function() {
        Webcam.snap( function(data_uri) {
        	// TODO send to API
            document.getElementById('my_result').innerHTML = '<img src="'+ data_uri+'"/>';
        } );
    }

});