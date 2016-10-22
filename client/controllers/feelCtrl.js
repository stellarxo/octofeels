app.controller('feelCtrl', function($scope, $http) {
	$scope.derp = "Octofeeeeeeeels";

	// attachs the webcam to the camera
	Webcam.attach('#camera');

    function processResult(response)
    {
        console.log(response);
        var data = response.data;
        console.log(data.length);
        $scope.result = getMax(data);
    }

    function dataURItoBlob(dataURI) {

        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    }

    $scope.takeSnapshot = function() {    	
        Webcam.snap( function(data_uri) {
        	// TODO send to API
            var file = new File([dataURItoBlob(data_uri)], 'fileName.jpeg', {type: "'image/jpeg"});
            var req = {
                method: 'POST',
                url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
                headers: {
                    'Content-Type' : 'application/octet-stream',
                    'Ocp-Apim-Subscription-Key' : 'bb1c37dc206b428082c31ef6fd8bc1f3'
                },
                data: file,
            }

            $http(req).then(function successCallback(result){
                processResult(result);
                console.log(result);
            }, function errorCallback(result){
                console.log("you fucked up")
            });
        	// temporarily show it on the page
            document.getElementById('result').innerHTML = '<img src="'+ data_uri+'"/>';
        } );
    }

});