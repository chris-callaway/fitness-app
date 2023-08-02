cordova.define("de.websector.myplugin.MyPlugin", function (require, exports, module) {
    var exec = require('cordova/exec');

    /**
     * Constructor
     */

    function MyPlugin() {
    }

    MyPlugin.prototype.sayHello = function () {
        exec(function (result) {
                // result handler
                //alert(result);
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "sayHello",
            []
        );
    }

    function registerNotifications() {
    }

    MyPlugin.prototype.registerNotifications = function () {
        exec(function (result) {
                // result handler
                //alert(result);
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "registerNotifications",
            []
        );
    }

    function stopMusic() {
    }

    MyPlugin.prototype.stopMusic = function () {
        exec(function (result) {
                // result handler
                //alert(result);
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "stopMusic",
            []
        );
    }

    function playMusic() {
    }

    MyPlugin.prototype.playMusic = function () {
        exec(function (result) {
                // result handler
                $('#pause_song').show();
                $('#play_song').hide();
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "playMusic",
            []
        );
    }

    function pauseMusic() {
    }

    MyPlugin.prototype.pauseMusic = function () {
        exec(function (result) {
                // result handler
                $('#pause_song').hide();
                $('#play_song').show();
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "pauseMusic",
            []
        );
    }

    function stopAudioPlayer() {
    }

    MyPlugin.prototype.stopAudioPlayer = function () {
        exec(function (result) {
                // result handler
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "stopAudioPlayer",
            []
        );
    }

    function pauseExternalAudio() {
    }

    MyPlugin.prototype.pauseExternalAudio = function () {
        exec(function (result) {
                // result handler
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "pauseExternalAudio",
            []
        );
    }

    function playExternalAudio() {
    }

    MyPlugin.prototype.playExternalAudio = function () {
        exec(function (result) {
                // result handler
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "playExternalAudio",
            []
        );
    }

    function stopExternalAudio() {
    }

    MyPlugin.prototype.stopExternalAudio = function () {
        exec(function (result) {
                // result handler
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "stopExternalAudio",
            []
        );
    }

    function pauseMusic() {
    }

    function musicFadeOut() {
    }

    MyPlugin.prototype.musicFadeOut = function () {
        exec(function (result) {
                // result handler
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "musicFadeOut",
            []
        );
    }

    function playSound() {
    }

    MyPlugin.prototype.playSound = function (name) {
        myPlugin.pauseMusic();
        //if (externalAudioPlayer) {
        //    myPlugin.pauseExternalAudio();
        //} else {
        //    myPlugin.pauseMusic();
        //}
        exec(function (result) {
                // result handler
                setTimeout(function () {
                    //if (externalAudioPlayer) {
                    //    console.log('external player active on callback');
                    //    myPlugin.playExternalAudio();
                    //} else {
                    //    myPlugin.playMusic();
                    //}
                    if (name != "missionFailed") {
                        //myPlugin.playMusic();
                    }
                }, 7000);
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "playSound",
            [name]
        );
    }

    function skipToPreviousItem() {
    }

    MyPlugin.prototype.skipToPreviousItem = function () {
        exec(function (result) {

                setTimeout(function () {

                    update_music_options();

                    if ($('#options_current_song').html() == "(null)") {
                        myPlugin.playMusic();
                    }

                }, 2000);

            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "skipToPreviousItem",
            []
        );
    }

    function skipToNextItem() {
    }

    MyPlugin.prototype.skipToNextItem = function () {
        exec(function (result) {

                setTimeout(function () {

                    update_music_options();

                    if ($('#options_current_song').html() == "(null)") {
                        myPlugin.playMusic();
                    }

                }, 2000);

            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "skipToNextItem",
            []
        );
    };

    function speak() {
    }

    MyPlugin.prototype.speak = function (text) {
        //myPlugin.pauseMusic();
        exec(function (result) {
                // result handler
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "speak",
            [text]
        );
    };

    var myPlugin = new MyPlugin();
    module.exports = myPlugin

// Mission selection

// Mission 1

    function startMission() {
    }

    MyPlugin.prototype.startMission = function () {
        exec(function (result) {
                var unit;
                unit = window.localStorage.getItem('selected_unit');
                if (!unit) {
                    unit = window.localStorage.setItem('selected_unit', 'MPH');
                }

                if ($('#options_select_duration_label').html() == "(30/45/60)" || $('#options_select_playlist').html() == "(Select Playlist)" || $('#options_select_playlist').html() == "(null)" || $('#options_select_playlist').html() == "›") {
                    alert('Please complete option settings');
                } else {
                    //Go to mission progress screen
                    $.mobile.changePage($("#mission_progress"), {transition: "slide"});

                    // Update UI
                    $('div[data-role="footer"]').hide();
                    update_song_title();

                    // Initiate music
                    myPlugin.playMusic();

                    //Determine mission
                    if (mission1 == true) {

                        playMission1();

                        //Label mission title
                        $('#current_mission').empty();
                        $('#current_mission').append('Endurance');

                        $('.distance').empty();
                        $('.pace').empty();
                        $('.time-minutes').html("0:");
                        $('.time-seconds').html("00");

                        $('.distance').append('<div id="mission-1-distance"></div>');
                        $('.pace').append('<div id="mission-1-pace"></div>');

                    }

                    if (mission2 == true && mission2_unlocked == true) {

                        //Label mission title
                        $('#current_mission').empty();
                        $('#current_mission').append('Speed');

                        $('.distance').empty();
                        $('.pace').empty();
                        $('.time-minutes').empty();
                        $('.time-seconds').empty();

                        $('.distance').append('<div id="mission-2-distance"></div>');
                        $('.pace').append('<div id="mission-2-pace"></div>');

                    }

                }
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "startMission",
            []
        );
    }

});
