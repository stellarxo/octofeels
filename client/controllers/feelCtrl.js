app.controller('feelCtrl', function($scope, $http) {
    $scope.derp = "Octofeeeeeeeels";
    redditUrl = "https://www.reddit.com/r/"

    // attachs the webcam to the camera
    Webcam.attach('#camera');

    $scope.audio = document.getElementById('myAudio');

    //graph log
    $scope.feelingNumbers = {
        "anger": [0,0,0,0,0,0,0,0,0,0],
        "contempt": [0,0,0,0,0,0,0,0,0,0],
        "disgust": [0,0,0,0,0,0,0,0,0,0],
        "fear": [0,0,0,0,0,0,0,0,0,0],
        "happiness": [0,0,0,0,0,0,0,0,0,0],
        "neutral": [0,0,0,0,0,0,0,0,0,0],
        "sadness": [0,0,0,0,0,0,0,0,0,0],
        "surprise": [0,0,0,0,0,0,0,0,0,0]
    };
    var chart = null;
    initGraph();

    // emtions dictionary 
    $scope.angerImageList = [
        "anger1.jpg",
        "anger2.jpg",
        "anger3.gif",
        "anger4.jpg",
        "anger5.jpg",
        "anger6.jpg",
        "anger7.jpg",
        "anger8.jpg",
        "anger9.jpeg",
        "anger10.jpeg",
        "anger11.jpg"
    ];

    $scope.subreddits = {
        "anger": "",
        "contempt": "cringepics+cringe",
        "disgust": "WTF+popping+vomit+puke+poop+gross",
        "fear": "creepy+FearMe+scaredshitless",
        "happiness": "aww+cute+cats+eyebleach+puppies+dogs+kittens",
        "neutral": "boring",
        "sadness": "MorbidReality+baww+HorriblyDepressing+sad",
        "surprise": "WTF+Unexpected"
    }

    $scope.phrase = "Welcome!";
    $scope.currentImage = "img/hi.gif";
    $scope.feels = ['Happiness', 'Surprise', 'Sadness', 'Neutral', 'Anger', 'Contempt', 'Disgust', 'Fear'];
    $scope.selectedFeel;
    $scope.makeFeelImage;
    $scope.showSplitScreen;
    $scope.refreshIntervalID;
    $scope.loading;
    $scope.buttonText = "Make me octofeel  ";
    $scope.showNextButton = false;

    // attaches the webcam to the camera
    Webcam.attach('#camera');

    function setRedditPhoto(e){
        $scope.loading = true;
        var req = {
            method: 'GET',
            url: redditUrl + $scope.subreddits[e] + '/top/.json?limit=100&sort=top&t=all'
        }
        $http(req).then(function successCallback(result){
            var photoList = result.data.data.children;
            setRandomPhoto(photoList)
        }, function errorCallback(result){
            console.log("Failed while retrieving reddit data from " + subreddits[e]);
        });
    }

    function setRandomPhoto(photoList){
        console.log("length: " + photoList.length);
        var imageUrl;
        while(true){
            var rObject = photoList[Math.round(Math.random()*photoList.length)];
            if (rObject != null) {
                imageUrl = rObject.data.url
                if (imageUrl.indexOf("i.imgur") !== -1) {
                    // console.log("Before: " + imageUrl);
                    imageUrl = jpgFormat(imageUrl);
                    // console.log("After: " + imageUrl);
                    break;
                }; 
            }
        }
        // console.log(rObject.data.url);
        // console.log(rObject.data.score);
        $scope.makeFeelImage = imageUrl;
        $scope.showSplitScreen = true;
        $scope.loading = false;
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
            $scope.currentImage = "img/" + $scope.emotion + ".gif";
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
            console.log("Before : " + $scope.feelingNumbers[key]);
            $scope.feelingNumbers[key].shift();
            console.log("After : " + $scope.feelingNumbers[key]);
            $scope.feelingNumbers[key].push(parseFloat(arr[key]));
        }
        updateGraph();
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
        if (fromButton) {
            // $scope.loading = true;
            // pause in case playing previous music
            $scope.audio.pause()
            $scope.makeFeelImage = null;

            // if there is not a current feeling found for the user
            if(!$scope.phrase.includes('feeling')){
                $scope.phrase = "";
            }
        }
        Webcam.snap( function(data_uri) {
            var file = new File([dataURItoBlob(data_uri)], 'fileName.jpeg', {type: "'image/jpeg"});
            var req = {
                method: 'POST',
                url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
                headers: {
                    'Content-Type' : 'application/octet-stream',
                    'Ocp-Apim-Subscription-Key' : 'bb1c37dc206b428082c31ef6fd8bc1f3',
                    'Access-Control-Allow-Origin': '*'
                },
                data: file,
            }

            $http(req).then(function successCallback(result){
                if (fromButton) {
                    $scope.showSplitScreen = false;
                    $scope.showNextButton = false;
                    clearInterval($scope.refreshIntervalID);
                }
                processResult(result);
                $scope.loading = false;

            }, function errorCallback(result){
                console.log("Failed to access microsoft's emotion api");
            });

            // shows image that was taken on the page
            // document.getElementById('result').innerHTML = '<img src="'+ data_uri+'"/>';
        } );
    }

    // Change feels
    $scope.changeFeel = function(item, playNew) {
        console.log(item);
        if (item == 'surprise_me') {
            $scope.selectedFeel = $scope.feels[Math.floor(Math.random() * 8)].toLowerCase();
        }
        else {
            $scope.selectedFeel = item.toLowerCase();
        }
        if($scope.selectedFeel == 'anger'){
            $scope.makeFeelImage = 'img/anger/' + $scope.angerImageList[Math.floor(Math.random() * $scope.angerImageList.length)];
        }
        else{
            setRedditPhoto($scope.selectedFeel);
        }
        $scope.buttonText = item + " ";
        // console.log("Selected " + $scope.selectedFeel);
        // var random = Math.floor(Math.random() * 1) + 1;
        // $scope.currentImage = "makeFeels/" + $scope.selectedFeel + random + ".gif";
        // $scope.currentImage = getRedditPhoto($scope.selectedFeel);
        $scope.phrase = "Do you feel " + $scope.selectedFeel + " yet???"

        $scope.showNextButton = true;

        if(playNew) {
            // start playing the audio from beginning
            $scope.playAudio();
        }
        

        $scope.refreshIntervalID = setInterval(function(){
            $scope.takeSnapshot(false);
        }, 1500)
        
    }

    // start playing a song from the beginning
    $scope.playAudio = function() {
        // pause in case playing previous music
        $scope.audio.pause()

        // set new src and load it
        $scope.audioFile = 'music/' + $scope.selectedFeel + '.mp3'
        $scope.audio.load();

        // play yay! :D
        $scope.audio.play();
    }

    // Show next picture of same feels
    $scope.showNext = function() {
        $scope.makeFeelImage = null;
        $scope.changeFeel($scope.selectedFeel.toProperCase(), false);
    }

    function initGraph(){
        var myColumns = generateColumns();
        chart = c3.generate({
            size: {
                height: 150,
                width: 400
            },
            data: {
                columns: myColumns
            }
        });
    }

    function generateColumns(){
        var myColumns = [];
        for(c in $scope.feelingNumbers){
            myColumns.push(generateColumn(c, $scope.feelingNumbers[c]));
        }
        return myColumns;
    }

    function generateColumn(label, values){
        var myColumn = [label];
        for(v in values){
            myColumn.push(values[v]);
        } 
        return myColumn;
    }

    function updateGraph(){
        for(feel in $scope.feelingNumbers){
            chart.load({
                columns: [generateColumn(feel, $scope.feelingNumbers[feel])]
            });
        }
    }

    String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

});