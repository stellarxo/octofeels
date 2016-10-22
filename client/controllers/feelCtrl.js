app.controller('feelCtrl', function($scope, $http) {
    $scope.derp = "Octofeeeeeeeels";
    redditUrl = "https://www.reddit.com/r/"

    // attachs the webcam to the camera
    Webcam.attach('#camera');

    // emtions dictionary

    $scope.subreddits = {
        "anger": "angry",
        "contempt": "ugh",
        "disgust": "gross",
        "fear": "scary",
        "happiness": "aww+cute",
        "neutral": "meh",
        "sadness": "sad+tears",
        "surprise": "surprise"
    }

    $scope.phrase = "Welcome!";
    $scope.currentImage = "img/hi.png";
    $scope.feels = ['Happiness', 'Surprise', 'Sadness', 'Neutral', 'Anger', 'Contempt', 'Disgust', 'Fear'];
    $scope.selectedFeel;
    $scope.makeFeelImage;
    $scope.showSplitScreen;

    // attaches the webcam to the camera
    Webcam.attach('#camera');

    function setRedditPhoto(e){
        var req = {
            method: 'GET',
            url: redditUrl + $scope.subreddits[e] + '/top/.json?sort=top&t=all'
        }
        $http(req).then(function successCallback(result){
            var photoList = result.data.data.children;
            setRandomPhoto(photoList)
        }, function errorCallback(result){
            console.log("you fucked up");
        });
    }

    function setRandomPhoto(photoList){
        var imageUrl;
        while(true){
            var rObject = photoList[Math.round(Math.random()*photoList.length)];
            imageUrl = rObject.data.url
            if(imageUrl.indexOf("i.imgur") !== -1) {
                console.log("Before: " + imageUrl);
                imageUrl = jpgFormat(imageUrl);
                console.log("After: " + imageUrl);
                break;
            }; 
        }
        
        // console.log(rObject.data.url);
        // console.log(rObject.data.score);
        $scope.makeFeelImage = imageUrl;
        $scope.showSplitScreen = true;
        return imageUrl;
    }

    function jpgFormat(imageUrl){
        var chunks = imageUrl.split('.');
        if(chunks[chunks.length-1]=='jpg') return imageUrl;
        else {
            chunks[chunks.length-1] = 'jpg';
            return chunks.join('.');
        }
    }

    function processResult(response)
    {
        var data = response.data;
        if(data.length > 0){
            $scope.emotion = getMax(data[0].scores)
            console.log($scope.emotion);
            $scope.phrase = "You are feeling " + $scope.emotion;
            $scope.currentImage = "img/" + $scope.emotion + ".png";
            // console.log($scope.emotion);
        }
        else{
            // console.log("Didn't find faces");
            $scope.phrase = "I don't know what you're feeling, weirdo";
            $scope.currentImage = "img/404.gif";
        }
    }

    // returns the max element of an array
    function getMax(arr) {
        var max;
        for (var key in arr) {
            if (!max || parseFloat(arr[key]) > parseFloat(arr[max])) max = key;
        }
        return max;
    }

    // turns a data URI into a binary blob
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

    // takes a screenshot of the image currently being viewed from the webcam and gets the emotion
    $scope.takeSnapshot = function(fromButton) {      
        Webcam.snap( function(data_uri) {
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
                if (fromButton) {
                    $scope.showSplitScreen = false;
                }
                processResult(result);

            }, function errorCallback(result){
                console.log("you fucked up");
            });

            // shows image that was taken on the page
            // document.getElementById('result').innerHTML = '<img src="'+ data_uri+'"/>';
        } );
    }

    // Change feels
    $scope.changeFeel = function(item) {
        console.log(item);
        if (item == 'surprise_me') {
            $scope.selectedFeel = $scope.feels[Math.floor(Math.random() * 8)].toLowerCase();
        }
        else {
            $scope.selectedFeel = item.toLowerCase();
        }
        setRedditPhoto($scope.selectedFeel);
        // console.log("Selected " + $scope.selectedFeel);
        // var random = Math.floor(Math.random() * 1) + 1;
        // $scope.currentImage = "makeFeels/" + $scope.selectedFeel + random + ".gif";
        // $scope.currentImage = getRedditPhoto($scope.selectedFeel);
        console.log($scope.currentImage);
        $scope.phrase = "Do you feel " + $scope.selectedFeel + " yet???"

        setInterval(function(){
            $scope.takeSnapshot(false);
        }, 1500)
        
    }

});