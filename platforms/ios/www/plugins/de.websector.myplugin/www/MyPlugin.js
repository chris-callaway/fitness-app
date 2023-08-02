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

    function soundPositive() {
    }

    MyPlugin.prototype.soundPositive = function () {
        exec(function (result) {
                // result handler
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "soundPositive",
            []
        );
    }

    function soundRunFaster() {
    }

    MyPlugin.prototype.soundRunFaster = function () {
        exec(function (result) {
                // result handler
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "soundRunFaster",
            []
        );
    }

    function soundNegative() {
    }

    MyPlugin.prototype.soundNegative = function () {
        exec(function (result) {
                // result handler
            },
            function (error) {
                // error handler
                alert("Error" + error);
            },
            "MyPlugin",
            "soundNegative",
            []
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
    }

    var myPlugin = new MyPlugin();
    module.exports = myPlugin

// Mission selection

// Mission 1

    function startMission() {
    }

    MyPlugin.prototype.startMission = function () {
        exec(function (result) {

                update_song_title();

                if ($('#options_select_duration_label').html() == "(30/45/60)" || $('#options_select_playlist').html() == "(Select Playlist)" || $('#options_select_playlist').html() == "(null)" || $('#options_select_playlist').html() == "›") {
                    alert('Please complete option settings');
                }
                else {
                    //Go to mission progress screen
                    $.mobile.changePage("#mission_progress", {transition: "slide"});

                    // Initiate music
                    myPlugin.playMusic();

                    //Determine mission
                    if (mission1 == true) {

                        playMission1();

                        //Label mission title
                        $('#current_mission').empty();
                        $('#current_mission').append('Stuxnet');

                        $('.distance').empty();
                        $('.pace').empty();
                        $('.time-minutes').empty();
                        $('.time-seconds').empty();

                        $('.distance').append('<div id="mission-1-distance"></div>');
                        $('.pace').append('<div id="mission-1-pace"></div>');

                    }

                    if (mission2 == true && mission2_unlocked == true) {

                        //Label mission title
                        $('#current_mission').empty();
                        $('#current_mission').append('Genesis');

                        $('.distance').empty();
                        $('.pace').empty();
                        $('.time-minutes').empty();
                        $('.time-seconds').empty();

                        $('.distance').append('<div id="mission-2-distance"></div>');
                        $('.pace').append('<div id="mission-2-pace"></div>');

                    }

                    if (mission3 == true && mission3_unlocked == true) {

                        //Label mission title
                        $('#current_mission').empty();
                        $('#current_mission').append('Bing');

                        $('.distance').empty();
                        $('.pace').empty();
                        $('.time-minutes').empty();
                        $('.time-seconds').empty();

                        $('.distance').append('<div id="mission-3-distance"></div>');
                        $('.pace').append('<div id="mission-3-pace"></div>');

                    }

                    if (mission4 == true && mission4_unlocked == true) {

                        //Label mission title
                        $('#current_mission').empty();
                        $('#current_mission').append('Adventures In');

                        $('.distance').empty();
                        $('.pace').empty();
                        $('.time-minutes').empty();
                        $('.time-seconds').empty();

                        $('.distance').append('<div id="mission-4-distance"></div>');
                        $('.pace').append('<div id="mission-4-pace"></div>');

                    }

                    if (mission5 == true && mission5_unlocked == true) {

                        //Label mission title
                        $('#current_mission').empty();
                        $('#current_mission').append('Uncoded');

                        $('.distance').empty();
                        $('.pace').empty();
                        $('.time-minutes').empty();
                        $('.time-seconds').empty();

                        $('.distance').append('<div id="mission-5-distance"></div>');
                        $('.pace').append('<div id="mission-5-pace"></div>');

                    }

                    if (mission6 == true && mission6_unlocked == true) {

                        //Label mission title
                        $('#current_mission').empty();
                        $('#current_mission').append('Digital Dawn');

                        $('.distance').empty();
                        $('.pace').empty();
                        $('.time-minutes').empty();
                        $('.time-seconds').empty();

                        $('.distance').append('<div id="mission-6-distance"></div>');
                        $('.pace').append('<div id="mission-6-pace"></div>');

                    }

                    if (mission7 == true && mission7_unlocked == true) {

                        //Label mission title
                        $('#current_mission').empty();
                        $('#current_mission').append('Mission 7');

                        $('.distance').empty();
                        $('.pace').empty();
                        $('.time-minutes').empty();
                        $('.time-seconds').empty();

                        $('.distance').append('<div id="mission-7-distance"></div>');
                        $('.pace').append('<div id="mission-7-pace"></div>');

                    }

                    if (mission8 == true && mission8_unlocked == true) {

                        //Label mission title
                        $('#current_mission').empty();
                        $('#current_mission').append('Satellites');

                        $('.distance').empty();
                        $('.pace').empty();
                        $('.time-minutes').empty();
                        $('.time-seconds').empty();

                        $('.distance').append('<div id="mission-8-distance"></div>');
                        $('.pace').append('<div id="mission-8-pace"></div>');

                    }

                    if (mission9 == true && mission9_unlocked == true) {

                        //Label mission title
                        $('#current_mission').empty();
                        $('#current_mission').append('Thunder Trail');

                        $('.distance').empty();
                        $('.pace').empty();
                        $('.time-minutes').empty();
                        $('.time-seconds').empty();

                        $('.distance').append('<div id="mission-9-distance"></div>');
                        $('.pace').append('<div id="mission-9-pace"></div>');

                    }

                    if (mission10 == true && mission10_unlocked == true) {

                        //Label mission title
                        $('#current_mission').empty();
                        $('#current_mission').append('Mission 10');

                        $('.distance').empty();
                        $('.pace').empty();
                        $('.time-minutes').empty();
                        $('.time-seconds').empty();

                        $('.distance').append('<div id="mission-10-distance"></div>');
                        $('.pace').append('<div id="mission-10-pace"></div>');

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
