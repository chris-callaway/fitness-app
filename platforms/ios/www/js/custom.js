// Wait for Cordova to load
//

//$(document).ready(function () {
//    onDeviceReady();
//});
document.addEventListener("deviceready", onDeviceReady, false);
speeds = new Array();

// Cordova is ready
//

//$(function () {
//    var options = {enableHighAccuracy: true};
//    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
//});

function onDeviceReady() {
    myPlugin.registerNotifications();
    var options = {enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    document.addEventListener("resume", onResume, true);
    $.mobile.changePage.defaults.allowSamePageTransition = true;
    //runTimer();
}

function songSelected(totalMinutes) {
    //Reset select music button styles
    showLoader();
    $('#totalSongDuration').html(totalMinutes);
}

function songPlaying() {
    var element = document.getElementById('position');
    element.innerHTML = 'Song playing';
}

function songOver() {
    var element = document.getElementById('position');
    if (element) {
        element.innerHTML = 'Song over';
    }
}

// onSuccess Geolocation
//
function onSuccess(position) {
    var element = document.getElementById('position');
    // element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
    // 'Longitude: '          + position.coords.longitude             + '<br />' +
    // 'Altitude: '           + position.coords.altitude              + '<br />' +
    // 'Accuracy: '           + position.coords.accuracy              + '<br />' +
    // 'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
    // 'Heading: '            + position.coords.heading               + '<br />' +
    // 'Speed: '              + position.coords.speed                 + '<br />' +
    // 'Timestamp: '          + position.timestamp                    + '<br />';
    speeds.push(position.coords.speed);
}

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

function runTimer() {

    //var runTimer = setInterval(function () {
    //    var options = {enableHighAccuracy: true};
    //    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    //}, 1000);

    //sum = 0;

    //setTimeout(function () {
    //    clearInterval(runTimer);
    //    $.each(speeds, function () {
    //        sum += parseFloat(this);
    //    });
    //    average = parseFloat(sum) / 100;
    //    var element = document.getElementById('average');
    //    element.innerHTML += 'Average is ' + average + '<br />';
    //    //$('#position').append('Average: ' + average);
    //}, 5000);

}

//function onResume() {
//    runTimer();
//}

//Additional

function gps_distance(lat1, lon1, lat2, lon2) {
    // http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // km
    var dLat = (lat2 - lat1) * (Math.PI / 180);
    var dLon = (lon2 - lon1) * (Math.PI / 180);
    var lat1 = lat1 * (Math.PI / 180);
    var lat2 = lat2 * (Math.PI / 180);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
}

document.addEventListener("deviceready", function () {

    if (navigator.network.connection.type == Connection.NONE) {
        $("#home_network_button").text('No Internet Access')
            .attr("data-icon", "delete")
            .button('refresh');
    }

});


var track_id = '';      // Name/ID of the exercise
var watch_id = null;    // ID of the geolocation
var tracking_data = []; // Array containing GPS position objects
var seconds = 0;
if (window.localStorage.getItem('total_runs')) {
    var total_runs = window.localStorage.getItem('total_runs');
}
else {
    var total_runs = 0;
}

function reset_mission_attempts() {
    one_x = 0;
    two_x = 0;
    three_x = 0;
    four_x = 0;
    five_x = 0;
    six_x = 0;
    seven_x = 0;
    eight_x = 0;
    nine_x = 0;
    ten_x = 0;
}

reset_mission_attempts();

tracking_data_mission1_paused = new Boolean();

//List mission amount of tries
mission_1_amount_of_tries = 0;
mission_2_amount_of_tries = 0;

//Make array for all averages
all_averages = new Array();
all_distances = new Array();

//Make progress canvas

function runProgress() {

    $('.percentage_bar').remove();

    var n, id, progress;

    progress = new CircularProgress({
        radius: 40,
        strokeStyle: '#00cccc',
        lineCap: 'square',
        lineJoin: 'round',
        lineWidth: 8,
        shadowBlur: 0,
        shadowColor: 'black',
        text: {
            font: 'lighter 20px Bariol_Regular',
            shadowBlur: 0,
        },
        initial: {
            strokeStyle: '#a1a1a1',
            lineCap: 'square',
            lineJoin: 'round',
            lineWidth: 8,
            shadowBlur: 0,
            shadowColor: 'black',
        }
    });

    var home = document.getElementById('mission_progress');
    home.appendChild(progress.el);

    n = 0;
    id = setInterval(function () {
        if (n == 100) clearInterval(id);
        // $('#progress').empty();
        // $('#progress').append(n.toString());
        if (!percent) {
            progress.update(0);
        } else {
            progress.update(percent);
        }
    }, 30);

    degrees = 180;
    $('canvas').css('-webkit-transform', 'rotate(' + degrees + 'deg)');
    $('canvas').css('margin', 'auto');
    $('canvas').css('display', 'block');
    $('canvas').css('margin-top', '-400px');

    $('canvas').wrap('<div class="percentage_bar"></div>');
    $('.percentage_bar').append('<div id="progress">0%</div>');

}

function getAverage(meters, seconds) {
    var average = meters / seconds;
    if (!isFinite(average) || average == "infinity") {
        average = 0;
    }
    return average;
}

//Start Tracking Mission 1
function playMission1() {

    runProgress();

    //If the game has been paused restore all data
    if (tracking_data_mission1_paused == true) {
        tracking_data_mission1 = tracking_data_mission1_paused_data;
        final_time_m = final_time_m_paused_data;
        final_time_s = final_time_s_paused_data;
        seconds_added = seconds_added_paused_data;
        one_x = parseInt(one_x);
        speeds = speeds_mission1_paused_data;
        average = average_mission1_paused_data;
    }
    //If the game has never been paused clear results
    else {
        tracking_data_mission1 = [];
        tracking_data_mission1.length = 0;
        speeds = [];
        final_time_m = 0;
        final_time_s = 0;
        one_x = parseInt(one_x + 1);
        seconds_added = 0;
        average = 0;
    }

    //Add next second
    var myTimer = setInterval(function () {

        var minutes = ((Math.round(final_time_m)));
        //if (minutes.length <= 1 || !minutes.length) {
        //    minutes = "0" + minutes;
        //}
        //console.log('minutes', minutes, 'length is ' + minutes.length);
        var seconds = ((Math.round(final_time_s)));
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        //Display current time in view
        $('.time-minutes').html(minutes + ":");
        $('.time-seconds').html(seconds);

        final_time_s = final_time_s + 1;
        seconds_added = seconds_added + 1;

    }, 1000);

    //Label mission attempt with correct title prefix
    mission_attempt = "Endurance - " + one_x;

    var item = "Endurance - " + one_x + '-additionalDetails';
    console.log(item);
    var obj = {
        date: new Date()
    };
    window.localStorage.setItem(item, JSON.stringify(obj));
    var failed = false;
    var secondStopped = 0;
    // Start tracking the User
    watch_mission_1 = navigator.geolocation.watchPosition(
        // Success
        function (position) {
            console.log('seconds', seconds_added);
            //Push position to array
            position.seconds = final_time_s;
            position.minutes = final_time_m;
            position.longitude = position.coords.longitude;
            position.latitude = position.coords.latitude;
            position.speed = position.coords.speed;
            position.altitude = position.coords.altitude;
            position.duration = duration;
            position.durationMinutes = final_time_m;
            position.durationSeconds = final_time_s;

            if (seconds_added > 1) {
                tracking_data_mission1.push(position);
            }

            //Collect speed
            speeds.push(position.coords.speed * 1000);

            //Save array to local storage
            window.localStorage.setItem(mission_attempt, JSON.stringify(tracking_data_mission1));

            // Get all the GPS data for the specific workout
            var data = window.localStorage.getItem(mission_attempt);
            // alert(data);

            // Turn the stringified GPS data back into a JS object
            data = JSON.parse(data);

            // Calculate the total distance travelled
            var total_km = 0;
            console.log(tracking_data_mission1);
            for (var i = 0; i < tracking_data_mission1.length; i++) {

                if (i == (tracking_data_mission1.length - 1)) {

                    break;

                }

                total_km += gps_distance(tracking_data_mission1[i].latitude, tracking_data_mission1[i].longitude, tracking_data_mission1[i + 1].latitude, tracking_data_mission1[i + 1].longitude);
                //total_km += gps_distance(120, 120, 120, 120);

            }

            total_km_rounded = parseFloat(total_km).toFixed(2);
            total_miles_rounded = total_km_rounded * 0.6214;
            total_m_rounded = total_km * 1000;

            current_speed_meters = position.coords.speed;
            current_speed_miles = parseFloat((position.coords.speed * 0.000621371) * 3600).toFixed(2);
            current_speed_kilometers = position.coords.speed * 3.6;

            console.log('total_km_distance', total_km_rounded);
            console.log('total_miles_rounded', total_miles_rounded);
            console.log('total_m_rounded', total_m_rounded);
            console.log('current_speed_meters', current_speed_meters);
            console.log('current_speed_miles', current_speed_miles);
            console.log('current_speed_kilometers', current_speed_kilometers);

            overallAverage = getAverage(total_m_rounded, seconds_added).toFixed(2);
            overallAverageInMeters = getAverage(total_m_rounded, seconds_added).toFixed(2);
            overallAverageInKilometers = getAverage(total_km_rounded, seconds_added).toFixed(2) * 3600;
            overallAverageInMiles = parseFloat(getAverage(total_miles_rounded, seconds_added) * 3600).toFixed(2);
            console.log('overall average in miles', overallAverageInMiles);

            var unit;
            unit = window.localStorage.getItem('selected_unit');
            if (!unit) {
                window.localStorage.setItem('selected_unit', 'MPH');
                unit = "mph";
            } else {
                unit = window.localStorage.getItem('selected_unit').toLowerCase();
            }

            var unit = window.localStorage.getItem('selected_unit').toLowerCase();
            var unitAbbreviation;
            var totalDistanceConverted = 0;
            if (total_km_rounded) {
                switch (unit) {
                    case 'meters':
                        // Display Total Distance
                        unitAbbreviation = "m/s";
                        totalDistanceConverted = (parseFloat(total_km_rounded) * 1000).toFixed(2);
                        $('#mission-1-distance').html(totalDistanceConverted + ' <br /><span class="lowercase">Meters</span>');

                        //Display current speed
                        $('#mission-1-pace').html(current_speed_meters + '<br /><span class="lowercase">' + unitAbbreviation + '</span>');

                        break;
                    case 'kilometers':
                        unitAbbreviation = "km/hr";
                        totalDistanceConverted = (parseFloat(total_km_rounded)).toFixed(2);
                        $('#mission-1-distance').html(totalDistanceConverted + ' <br /><span class="lowercase">Kilometers</span>');

                        //Display current speed
                        $('#mission-1-pace').html(current_speed_kilometers + '<br /><span class="lowercase">' + unitAbbreviation + '</span>');
                        break;
                    case 'mph':
                        unitAbbreviation = "mph";
                        totalDistanceConverted = (parseFloat(total_km_rounded) * 0.621371).toFixed(2);
                        $('#mission-1-distance').html(totalDistanceConverted + ' <br /><span class="lowercase">Miles</span>');

                        //Display current speed
                        $('#mission-1-pace').html(current_speed_miles + '<br /><span class="lowercase">' + unitAbbreviation + '</span>');

                        break;
                }

            }

            //Update current time
            start_time = new Date(data[0].timestamp).getTime();
            end_time = new Date(data[data.length - 1].timestamp).getTime();

            total_time_ms = end_time - start_time;
            total_time_s = total_time_ms / 1000;

            //Set time temps
            mission_attempt_final_time_m = final_time_m;
            mission_attempt_final_time_s = final_time_s;

            minutes_in_seconds = final_time_m * 60;
            remaining_seconds = final_time_s;
            total_seconds = minutes_in_seconds + remaining_seconds;

            num_to_float = total_m_rounded / seconds_added;
            //average = Math.round(parseFloat(num_to_float));
            average = position.coords.speed;

            //Prevent infinite average
            if (average <= 0 || average == "infinity") {
                average = 0;
            }

            position.averageInMiles = overallAverageInMiles;
            position.averageInKilometers = overallAverageInKilometers;
            position.averageInMeters = overallAverageInMeters;

            tracking_data_mission1.push(position);

            //Save current time

            window.localStorage.setItem('temp_time_m', final_time_m);
            window.localStorage.setItem('temp_time_s', final_time_s);

            var speakCurrentDistance = function () {
                var unit = getUnit();
                var totalDistanceConverted = 0;
                var unitString;
                if (total_km_rounded) {
                    switch (unit) {
                        case 'meters':
                            unitString = unit;
                            totalDistanceConverted = (parseFloat(total_km_rounded) * 1000).toFixed(2);
                            break;
                        case 'kilometers':
                            unitString = unit;
                            totalDistanceConverted = (parseFloat(total_km_rounded)).toFixed(2);
                            break;
                        case 'mph':
                            unitString = 'miles';
                            totalDistanceConverted = (parseFloat(total_km_rounded) * 0.621371).toFixed(2);
                            break;
                    }

                    myPlugin.speak('Current distance is ' + totalDistanceConverted + ' ' + unitString);
                }
            };

            var speakCurrentAverage = function () {
                var unit = getUnit();
                var unitString, convertedAverage;
                switch (unit) {
                    case 'meters':
                        convertedAverage = overallAverage;
                        unitString = 'meters per second';
                        break;
                    case 'kilometers':
                        convertedAverage = parseFloat(total_km_rounded / 1).toFixed(2);
                        unitString = 'kilometers per hour';
                        break;
                    case 'mph':
                        totalDistanceConverted = overallAverageInMiles;
                        unitString = 'miles per hour';
                        break;
                }

                myPlugin.speak('Average is ' + totalDistanceConverted + ' ' + unitString);
            };

            var getUnit = function () {
                var unit;
                unit = window.localStorage.getItem('selected_unit');
                if (!unit) {
                    window.localStorage.setItem('selected_unit', 'MPH');
                    unit = "mph";
                } else {
                    unit = window.localStorage.getItem('selected_unit').toLowerCase();
                }
                return unit;
            };

            var speakSpeedToBeat = function (speedInMeters) {
                var unit = getUnit();
                var unitString, convertedAverage;
                switch (unit) {
                    case 'meters':
                        unitString = 'meters per second';
                        break;
                    case 'kilometers':
                        convertedAverage = parseFloat(total_km_rounded / 1).toFixed(2);
                        unitString = 'kilometers per hour';
                        break;
                    case 'mph':
                        unitString = 'miles per hour';
                        break;
                }

                myPlugin.speak('Speed to beat is ' + parseFloat(speedInMeters).toFixed(2) + ' ' + unitString);
            };

            var getSpeedToBeat = function (percent) {
                var speedToBeat;
                var unit = getUnit();
                switch (unit) {
                    case 'meters':
                        speedToBeat = parseFloat((overallAverageInMeters * percent)) + parseFloat(overallAverageInMeters);
                        break;
                    case 'kilometers':
                        speedToBeat = parseFloat((overallAverageInKilometers * percent)) + parseFloat(overallAverageInKilometers);
                        break;
                    case 'mph':
                        speedToBeat = parseFloat((overallAverageInMiles * percent)) + parseFloat(overallAverageInMiles);
                        break;
                }
                return speedToBeat;
            };

            //Mission conditionals

            //If duration is 30 minutes
            if (duration == 30) {

                //Fill in progress bar
                if ($('#progress').html() != "100%") {
                    //Calculate percent
                    percent = Math.round((seconds_added / 1800) * 100);
                    $('#progress').empty();
                    $('#progress').append(percent.toString() + '%');
                }

                if (seconds_added == 5) {
                    speakCurrentDistance();
                }

                if (seconds_added == 12) {
                    speakCurrentAverage();
                }
                ////////////// Phase 1 //////////////

                //phase 1:
                //time: 0:30
                //goal: 15 percent faster for 30 seconds
                //dialog: task initializing.  you must run 15 percent faster for 30 seconds.  beginning in 10 seconds.

                //Determine if average is higher
                if (seconds_added == 30) {
                    myPlugin.playSound('mission_1_phase1_begin'); // 7 sec (17 total delay)
                    if (!failed) {
                        speed_to_beat = getSpeedToBeat(0.15);
                    }
                }

                if (seconds_added == 40) {
                    console.log('speed to beat is', speed_to_beat);
                    speakSpeedToBeat(speed_to_beat);
                }

                //Wait 10 seconds after clip stopped playing
                //Check conditions for goal
                if (seconds_added > 48 && seconds_added < 78) {

                    if ((current_speed_miles <= speed_to_beat) && !failed) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');
                    }
                }

                // retry

                if (seconds_added < 78 && failed) {
                    var startTime = secondStopped + 15;
                    var endTime = secondStopped + 25;
                    if (seconds_added >= startTime && seconds_added < endTime) {
                        var mph = (position.coords.speed * 2.23694);
                        if (mph < 7) {
                            mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                            myPlugin.playSound('missionFailed');
                            stopMission(mission_attempt, total_km_rounded);
                        }
                    }

                    if (seconds_added == endTime) {
                        myPlugin.speak('Retry successful.');
                        failed = false;
                        seconds_added = 25;
                    }
                }

                //User beat average speed challenge
                if (seconds_added == 76 && !failed) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 1 //////////////

                ////////////// Phase 2 //////////////

                //phase 2:
                //time: 3:00
                //goal: 3 miles an hour for 6 minutes
                //dialog: task initializing.  you must run 3 miles per hour for 4 minutes.  beginning in 10 seconds.

                if (seconds_added == 180) {
                    myPlugin.playSound('mission_1_phase2_begin'); // 7 sec (17 total delay)
                    failed = false;
                }

                //Check conditions
                if (seconds_added > 196 && seconds_added < 436) {
                    var mph = parseFloat(position.coords.speed * 2.23694).toFixed(2);
                    if (mph < 3 && !failed) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');

                        if (seconds_added < 436 && failed) {
                            var startTime = secondStopped + 15;
                            var endTime = secondStopped + 25;
                            if (seconds_added >= startTime && seconds_added < endTime) {
                                var mph = parseFloat(position.coords.speed * 2.23694).toFixed(2);
                                if (mph < 7) {
                                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                                    stopMission(mission_attempt, total_km_rounded);
                                    myPlugin.playSound('missionFailed');
                                }
                            }

                            if (seconds_added == endTime) {
                                myPlugin.speak('Retry successful.');
                                failed = false;
                                seconds_added = 175;
                            }
                        }
                    } else if (seconds_added == 226 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 271 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 316 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 361 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 406 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    }
                }

                //User beat average speed challenge
                if (seconds_added == 436 && !failed) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 2 //////////////

                // time: 09:16

                ////////////// Phase 3 //////////////

                //phase 3:
                //time: 13:00
                //goal: 4 miles an hour for 10 minutes
                //dialog: task initializing.  you must run 4 miles per hour for 10 minutes.  beginning in 10 seconds.

                if (seconds_added == 780) {
                    myPlugin.playSound('mission_1_phase3_begin'); // 7 sec (17 total delay)
                    failed = false;
                }

                //Check conditions
                if (seconds_added > 796 && seconds_added < 1396) {
                    var mph = parseFloat(position.coords.speed * 2.23694).toFixed(2);
                    if (mph < 4 && !failed) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');

                        if (seconds_added < 1396 && failed) {
                            var startTime = secondStopped + 15;
                            var endTime = secondStopped + 25;
                            if (seconds_added >= startTime && seconds_added < endTime) {
                                var mph = parseFloat(position.coords.speed * 2.23694).toFixed(2);
                                if (mph < 7) {
                                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                                    stopMission(mission_attempt, total_km_rounded);
                                    myPlugin.playSound('missionFailed');
                                }
                            }

                            if (seconds_added == endTime) {
                                myPlugin.speak('Retry successful.');
                                failed = false;
                                seconds_added = 775;
                            }
                        }
                    } else if (seconds_added == 841 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 886 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 931 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 976 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1021 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1066 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1111 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1156 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1201 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1246 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1291 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1336 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1381 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    }


                }


                //User beat average speed challenge
                if (seconds_added == 1396 && !failed) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 3 //////////////

                //time: 23:16

                ////////////// Phase 4 //////////////

                //phase 4:
                //time: 24:00
                //goal: 15 percent faster for 60 seconds
                //dialog: task initializing.  you must run 15 percent faster for 60 seconds.  beginning in 10 seconds.

                if (seconds_added == 1440) {
                    speed_to_beat = getSpeedToBeat(0.15);
                    myPlugin.playSound('mission_1_phase4_begin'); // 7 sec (17 total delay)
                    failed = false;
                }

                if (seconds_added == 1448) {
                    speakSpeedToBeat(speed_to_beat);
                }

                //Check conditions
                if (seconds_added > 1456 && seconds_added < 1516) {
                    if (average <= speed_to_beat && !failed) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');

                        if (seconds_added < 1516 && failed) {
                            var startTime = secondStopped + 15;
                            var endTime = secondStopped + 25;
                            if (seconds_added >= startTime && seconds_added < endTime) {
                                var mph = parseFloat(position.coords.speed * 2.23694).toFixed(2);
                                if (mph < 7) {
                                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                                    stopMission(mission_attempt, total_km_rounded);
                                    myPlugin.playSound('missionFailed');
                                }
                            }

                            if (seconds_added == endTime) {
                                myPlugin.speak('Retry successful.');
                                failed = false;
                                seconds_added = 1435;
                            }
                        }
                    } else if (seconds_added == 1501 && !failed) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    }
                }


                //User beat average speed challenge
                if (seconds_added == 1516 && !failed) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 4 //////////////

                //time: 25:16

                ////////////// Phase 5 //////////////

                //phase 5:
                //time: 27:00
                //goal: 6.5 miles an hour for 3 minutes
                //dialog: task initializing.  you must run 6 miles per hour for 3 minutes.  beginning in 10 seconds.

                if (seconds_added == 1620) {
                    myPlugin.playSound('mission_1_phase5_begin'); // 7 sec (17 total delay)
                    failed = false;
                }

                //Check conditions
                if (seconds_added > 1636 && seconds_added < 1800) {
                    var mph = parseFloat(position.coords.speed * 2.23694).toFixed(2);
                    if (mph < 6 && !failed) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');

                        if (seconds_added < 1800 && failed) {
                            var startTime = secondStopped + 15;
                            var endTime = secondStopped + 25;
                            if (seconds_added >= startTime && seconds_added < endTime) {
                                var mph = parseFloat(position.coords.speed * 2.23694).toFixed(2);
                                if (mph < 7) {
                                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                                    stopMission(mission_attempt, total_km_rounded);
                                    myPlugin.playSound('missionFailed');
                                }
                            }

                            if (seconds_added == endTime) {
                                myPlugin.speak('Retry successful.');
                                failed = false;
                                seconds_added = 1615;
                            }
                        }
                    } else if (seconds_added == 1681) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1726) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1771) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    }
                }

                ////////////// End Phase 5 //////////////

                //End of mission timer
                if (seconds_added == 1800 && !failed) {
                    //30 minutes hit
                    myPlugin.playSound('misson_complete');
                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                    stopMission(mission_attempt, total_km_rounded);
                }

            }

            //If duration is 45 minutes
            if (duration == 45) {

                //Fill in progress bar
                if ($('#progress').html() != "100%") {
                    //Calculate percent
                    percent = Math.round((seconds_added / 1800) * 100);
                    $('#progress').empty();
                    $('#progress').append(percent.toString() + '%');
                }

                ////////////// Phase 1 //////////////

                //phase 1:
                //time: 0:30
                //goal: 15 percent faster for 30 seconds
                //dialog: task initializing.  you must run 15 percent faster for 30 seconds.  beginning in 10 seconds.

                //Determine if average is higher
                if (seconds_added == 30) {
                    myPlugin.playSound('mission_1_phase1_begin'); // 7 sec (17 total delay)
                    if (!failed) {
                        speed_to_beat = getSpeedToBeat(0.15);
                    }
                }

                if (seconds_added == 40) {
                    console.log('speed to beat is', speed_to_beat);
                    speakSpeedToBeat(speed_to_beat);
                }

                //Wait 10 seconds after clip stopped playing
                //Check conditions for goal
                if (seconds_added > 48 && seconds_added < 78) {

                    if ((current_speed_miles <= speed_to_beat) && !failed) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');
                    }
                }

                // retry

                if (seconds_added < 78 && failed) {
                    var startTime = secondStopped + 15;
                    var endTime = secondStopped + 25;
                    if (seconds_added >= startTime && seconds_added < endTime) {
                        var mph = (position.coords.speed * 2.23694);
                        if (mph < 7) {
                            mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                            myPlugin.playSound('missionFailed');
                            stopMission(mission_attempt, total_km_rounded);
                        }
                    }

                    if (seconds_added == endTime) {
                        myPlugin.speak('Retry successful.');
                        failed = false;
                        seconds_added = 25;
                    }
                }

                //User beat average speed challenge
                if (seconds_added == 76 && !failed) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 1 //////////////

                ////////////// Phase 2 //////////////

                //phase 2:
                //time: 3:00
                //goal: 3 miles an hour for 6 minutes
                //dialog: task initializing.  you must run 3 miles per hour for 4 minutes.  beginning in 10 seconds.

                if (seconds_added == 180) {
                    myPlugin.playSound('mission_1_phase2_begin'); // 7 sec (17 total delay)
                }

                //Check conditions
                if (seconds_added > 196 && seconds_added < 436) {
                    var mph = parseFloat(position.coords.speed * 2.23694).toFixed(2);
                    if (mph < 5) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');

                        if (seconds_added < 436 && failed) {
                            var startTime = secondStopped + 15;
                            var endTime = secondStopped + 25;
                            if (seconds_added >= startTime && seconds_added < endTime) {
                                var mph = (position.coords.speed * 2.23694);
                                if (mph < 7) {
                                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                                    stopMission(mission_attempt, total_km_rounded);
                                    myPlugin.playSound('missionFailed');
                                }
                            }

                            if (seconds_added == endTime) {
                                myPlugin.speak('Retry successful.');
                                failed = false;
                                seconds_added = 175;
                            }
                        }
                    } else if (seconds_added == 226) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 271) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 316) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 361) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 406) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    }
                }

                //User beat average speed challenge
                if (seconds_added == 436 && !failed) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 2 //////////////

                // time: 09:16

                ////////////// Phase 3 //////////////

                //phase 3:
                //time: 13:00
                //goal: 4 miles an hour for 10 minutes
                //dialog: task initializing.  you must run 4 miles per hour for 10 minutes.  beginning in 10 seconds.

                if (seconds_added == 780) {
                    myPlugin.playSound('mission_1_phase3_begin'); // 7 sec (17 total delay)
                }

                //Check conditions
                if (seconds_added > 796 && seconds_added < 1396) {
                    var mph = (position.coords.speed * 2.23694);
                    if (mph < 4) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');

                        if (seconds_added < 1396 && failed) {
                            var startTime = secondStopped + 15;
                            var endTime = secondStopped + 25;
                            if (seconds_added >= startTime && seconds_added < endTime) {
                                var mph = (position.coords.speed * 2.23694);
                                if (mph < 7) {
                                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                                    stopMission(mission_attempt, total_km_rounded);
                                    myPlugin.playSound('missionFailed');
                                }
                            }

                            if (seconds_added == endTime) {
                                myPlugin.speak('Retry successful.');
                                failed = false;
                                seconds_added = 775;
                            }
                        }
                    } else if (seconds_added == 841) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 886) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 931) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 976) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1021) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1066) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1111) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1156) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1201) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1246) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1291) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1336) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1381) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    }


                }


                //User beat average speed challenge
                if (seconds_added == 1396 && !failed) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 3 //////////////

                //time: 23:16

                ////////////// Phase 4 //////////////

                //phase 4:
                //time: 24:00
                //goal: 15 percent faster for 60 seconds
                //dialog: task initializing.  you must run 15 percent faster for 60 seconds.  beginning in 10 seconds.

                if (seconds_added == 1440) {
                    speed_to_beat = getSpeedToBeat(0.15);
                    myPlugin.playSound('mission_1_phase4_begin'); // 7 sec (17 total delay)
                }

                if (seconds_added == 1448) {
                    speakSpeedToBeat(speed_to_beat);
                }

                //Check conditions
                if (seconds_added > 1456 && seconds_added < 1516) {
                    if (average <= speed_to_beat) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');

                        if (seconds_added < 1516 && failed) {
                            var startTime = secondStopped + 15;
                            var endTime = secondStopped + 25;
                            if (seconds_added >= startTime && seconds_added < endTime) {
                                var mph = (position.coords.speed * 2.23694);
                                if (mph < 7) {
                                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                                    stopMission(mission_attempt, total_km_rounded);
                                    myPlugin.playSound('missionFailed');
                                }
                            }

                            if (seconds_added == endTime) {
                                myPlugin.speak('Retry successful.');
                                failed = false;
                                seconds_added = 1435;
                            }
                        }
                    } else if (seconds_added == 841) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 886) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 931) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 976) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1021) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1066) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1111) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1156) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1201) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1246) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1291) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1336) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1381) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    }
                }


                //User beat average speed challenge
                if (seconds_added == 1516 && !failed) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 4 //////////////

                //time: 25:16

                ////////////// Phase 5 //////////////

                //phase 5:
                //time: 27:00
                //goal: 6.5 miles an hour for 3 minutes
                //dialog: task initializing.  you must run 6 miles per hour for 3 minutes.  beginning in 10 seconds.

                if (seconds_added == 1620) {
                    myPlugin.playSound('mission_1_phase5_begin'); // 7 sec (17 total delay)
                }

                //Check conditions
                if (seconds_added > 1636 && seconds_added < 1800) {
                    var mph = (position.coords.speed * 2.23694);
                    if (mph < 6) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');

                        if (seconds_added < 1800 && failed) {
                            var startTime = secondStopped + 15;
                            var endTime = secondStopped + 25;
                            if (seconds_added >= startTime && seconds_added < endTime) {
                                var mph = (position.coords.speed * 2.23694);
                                if (mph < 7) {
                                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                                    stopMission(mission_attempt, total_km_rounded);
                                    myPlugin.playSound('missionFailed');
                                }
                            }

                            if (seconds_added == endTime) {
                                myPlugin.speak('Retry successful.');
                                failed = false;
                                seconds_added = 1615;
                            }
                        }
                    } else if (seconds_added == 1681) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1726) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1771) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    }
                }

                if (seconds_added == 1800) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 5 //////////////

                //time: 30:00

                ////////////// Phase 6 //////////////

                //phase 6:
                //time: 33:00
                //goal: 5 miles an hour for 7 minutes
                //dialog: task initializing.  you must run 5 miles per hour for 7 minutes.  beginning in 10 seconds.

                if (seconds_added == 1980) {
                    myPlugin.playSound('mission_1_phase6_begin'); // 7 sec (17 total delay)
                }

                //Check conditions
                if (seconds_added > 1996 && seconds_added < 2416) {
                    var mph = (position.coords.speed * 2.23694);
                    if (mph < 5) {
                        mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                        stopMission(mission_attempt, total_km_rounded);
                        myPlugin.playSound('missionFailed');
                    }
                }

                if (seconds_added == 2416) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 6 //////////////

                ////////////// Phase 7 //////////////

                //phase 7:
                //time: 42:30
                //goal: 6 miles an hour for 1 minutes
                //dialog: task initializing.  you must run 6.5 miles per hour for 1 minute.  beginning in 10 seconds.

                if (seconds_added == 2550) {
                    myPlugin.playSound('mission_1_phase7_begin'); // 8 sec (18 total delay)
                }

                //Check conditions
                if (seconds_added > 2567 && seconds_added < 2627) {
                    var mph = (position.coords.speed * 2.23694);
                    if (mph < 6.5) {
                        mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                        stopMission(mission_attempt, total_km_rounded);
                        myPlugin.playSound('missionFailed');
                    }
                }

                if (seconds_added == 2627) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 7 //////////////

                ////////////// Phase 8 //////////////

                //phase 8:
                //time: 43:30
                //goal: 6.5 miles an hour for 1 minutes
                //dialog: task complete.  you must run 6.5 miles per hour for 1 minute.  beginning in 10 seconds.

                if (seconds_added == 2610) {
                    myPlugin.playSound('mission_1_phase8_begin'); // 8 sec (18 total delay)
                }

                //Check conditions
                if (seconds_added > 2627 && seconds_added < 2687) {
                    var mph = (position.coords.speed * 2.23694);
                    if (mph < 6.5) {
                        mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                        stopMission(mission_attempt, total_km_rounded);
                        myPlugin.playSound('missionFailed');
                    }
                }

                if (seconds_added == 2687) {
                    myPlugin.playSound('task_complete');
                }

                if (seconds_added == 2700) {
                    myPlugin.playSound('mission_complete');
                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                    stopMission(mission_attempt, total_km_rounded);
                }

                ////////////// End Phase 8 //////////////


            }

            //If duration is 60 minutes
            if (duration == 60) {
                //Fill in progress bar
                if ($('#progress').html() != "100%") {
                    //Calculate percent
                    percent = Math.round((seconds_added / 1800) * 100);
                    $('#progress').empty();
                    $('#progress').append(percent.toString() + '%');
                }

                ////////////// Phase 1 //////////////

                //phase 1:
                //time: 0:30
                //goal: 15 percent faster for 30 seconds
                //dialog: task initializing.  you must run 15 percent faster for 30 seconds.  beginning in 10 seconds.

                //Determine if average is higher
                if (seconds_added == 30) {
                    myPlugin.playSound('mission_1_phase1_begin'); // 7 sec (17 total delay)
                    if (!failed) {
                        speed_to_beat = getSpeedToBeat(0.15);
                    }
                }

                if (seconds_added == 40) {
                    console.log('speed to beat is', speed_to_beat);
                    speakSpeedToBeat(speed_to_beat);
                }

                //Wait 10 seconds after clip stopped playing
                //Check conditions for goal
                if (seconds_added > 48 && seconds_added < 78) {

                    if ((current_speed_miles <= speed_to_beat) && !failed) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');
                    }
                }

                // retry

                if (seconds_added < 78 && failed) {
                    var startTime = secondStopped + 15;
                    var endTime = secondStopped + 25;
                    if (seconds_added >= startTime && seconds_added < endTime) {
                        var mph = (position.coords.speed * 2.23694);
                        if (mph < 7) {
                            mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                            myPlugin.playSound('missionFailed');
                            stopMission(mission_attempt, total_km_rounded);
                        }
                    }

                    if (seconds_added == endTime) {
                        myPlugin.speak('Retry successful.');
                        failed = false;
                        seconds_added = 25;
                    }
                }

                //User beat average speed challenge
                if (seconds_added == 76 && !failed) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 1 //////////////

                ////////////// Phase 2 //////////////

                //phase 2:
                //time: 3:00
                //goal: 3 miles an hour for 6 minutes
                //dialog: task initializing.  you must run 3 miles per hour for 4 minutes.  beginning in 10 seconds.

                if (seconds_added == 180) {
                    myPlugin.playSound('mission_1_phase2_begin'); // 7 sec (17 total delay)
                }

                //Check conditions
                if (seconds_added > 196 && seconds_added < 436) {
                    var mph = parseFloat(position.coords.speed * 2.23694).toFixed(2);
                    if (mph < 5) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');

                        if (seconds_added < 436 && failed) {
                            var startTime = secondStopped + 15;
                            var endTime = secondStopped + 25;
                            if (seconds_added >= startTime && seconds_added < endTime) {
                                var mph = (position.coords.speed * 2.23694);
                                if (mph < 7) {
                                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                                    stopMission(mission_attempt, total_km_rounded);
                                    myPlugin.playSound('missionFailed');
                                }
                            }

                            if (seconds_added == endTime) {
                                myPlugin.speak('Retry successful.');
                                failed = false;
                                seconds_added = 175;
                            }
                        }
                    } else if (seconds_added == 226) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 271) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 316) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 361) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 406) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    }
                }

                //User beat average speed challenge
                if (seconds_added == 436 && !failed) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 2 //////////////

                // time: 09:16

                ////////////// Phase 3 //////////////

                //phase 3:
                //time: 13:00
                //goal: 4 miles an hour for 10 minutes
                //dialog: task initializing.  you must run 4 miles per hour for 10 minutes.  beginning in 10 seconds.

                if (seconds_added == 780) {
                    myPlugin.playSound('mission_1_phase3_begin'); // 7 sec (17 total delay)
                }

                //Check conditions
                if (seconds_added > 796 && seconds_added < 1396) {
                    var mph = (position.coords.speed * 2.23694);
                    if (mph < 4) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');

                        if (seconds_added < 1396 && failed) {
                            var startTime = secondStopped + 15;
                            var endTime = secondStopped + 25;
                            if (seconds_added >= startTime && seconds_added < endTime) {
                                var mph = (position.coords.speed * 2.23694);
                                if (mph < 7) {
                                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                                    stopMission(mission_attempt, total_km_rounded);
                                    myPlugin.playSound('missionFailed');
                                }
                            }

                            if (seconds_added == endTime) {
                                myPlugin.speak('Retry successful.');
                                failed = false;
                                seconds_added = 775;
                            }
                        }
                    } else if (seconds_added == 841) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 886) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 931) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 976) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1021) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1066) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1111) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1156) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1201) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1246) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1291) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1336) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1381) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    }


                }


                //User beat average speed challenge
                if (seconds_added == 1396 && !failed) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 3 //////////////

                //time: 23:16

                ////////////// Phase 4 //////////////

                //phase 4:
                //time: 24:00
                //goal: 15 percent faster for 60 seconds
                //dialog: task initializing.  you must run 15 percent faster for 60 seconds.  beginning in 10 seconds.

                if (seconds_added == 1440) {
                    speed_to_beat = getSpeedToBeat(0.15);
                    myPlugin.playSound('mission_1_phase4_begin'); // 7 sec (17 total delay)
                }

                if (seconds_added == 1448) {
                    speakSpeedToBeat(speed_to_beat);
                }

                //Check conditions
                if (seconds_added > 1456 && seconds_added < 1516) {
                    if (average <= speed_to_beat) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');

                        if (seconds_added < 1516 && failed) {
                            var startTime = secondStopped + 15;
                            var endTime = secondStopped + 25;
                            if (seconds_added >= startTime && seconds_added < endTime) {
                                var mph = (position.coords.speed * 2.23694);
                                if (mph < 7) {
                                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                                    stopMission(mission_attempt, total_km_rounded);
                                    myPlugin.playSound('missionFailed');
                                }
                            }

                            if (seconds_added == endTime) {
                                myPlugin.speak('Retry successful.');
                                failed = false;
                                seconds_added = 1435;
                            }
                        }
                    } else if (seconds_added == 841) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 886) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 931) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 976) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1021) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1066) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1111) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1156) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1201) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1246) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1291) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1336) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1381) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    }
                }


                //User beat average speed challenge
                if (seconds_added == 1516 && !failed) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 4 //////////////

                //time: 25:16

                ////////////// Phase 5 //////////////

                //phase 5:
                //time: 27:00
                //goal: 6.5 miles an hour for 3 minutes
                //dialog: task initializing.  you must run 6 miles per hour for 3 minutes.  beginning in 10 seconds.

                if (seconds_added == 1620) {
                    myPlugin.playSound('mission_1_phase5_begin'); // 7 sec (17 total delay)
                }

                //Check conditions
                if (seconds_added > 1636 && seconds_added < 1800) {
                    var mph = (position.coords.speed * 2.23694);
                    if (mph < 6) {
                        failed = true;
                        secondStopped = seconds_added;
                        myPlugin.speak('Mission failed.  If you would like to retry this phase you must run 7 miles per hour for 10 seconds.  Beginning in 5 seconds.');

                        if (seconds_added < 1800 && failed) {
                            var startTime = secondStopped + 15;
                            var endTime = secondStopped + 25;
                            if (seconds_added >= startTime && seconds_added < endTime) {
                                var mph = (position.coords.speed * 2.23694);
                                if (mph < 7) {
                                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                                    stopMission(mission_attempt, total_km_rounded);
                                    myPlugin.playSound('missionFailed');
                                }
                            }

                            if (seconds_added == endTime) {
                                myPlugin.speak('Retry successful.');
                                failed = false;
                                seconds_added = 1615;
                            }
                        }
                    } else if (seconds_added == 1681) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1726) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    } else if (seconds_added == 1771) {
                        myPlugin.speak('Current speed is ' + mph + ' miles per hour');
                    }
                }

                if (seconds_added == 1800) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 5 //////////////

                //time: 30:00

                ////////////// Phase 6 //////////////

                //phase 6:
                //time: 33:00
                //goal: 5 miles an hour for 7 minutes
                //dialog: task initializing.  you must run 5 miles per hour for 7 minutes.  beginning in 10 seconds.

                if (seconds_added == 1980) {
                    myPlugin.playSound('mission_1_phase6_begin'); // 7 sec (17 total delay)
                }

                //Check conditions
                if (seconds_added > 1996 && seconds_added < 2416) {
                    var mph = (position.coords.speed * 2.23694);
                    if (mph < 5) {
                        mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                        stopMission(mission_attempt, total_km_rounded);
                        myPlugin.playSound('missionFailed');
                    }
                }

                if (seconds_added == 2416) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 6 //////////////

                //time: 40:16

                ////////////// Phase 7 //////////////

                //phase 7:
                //time: 42:30
                //goal: 6 miles an hour for 1 minutes
                //dialog: task initializing.  you must run 6.5 miles per hour for 1 minute.  beginning in 10 seconds.

                if (seconds_added == 2550) {
                    myPlugin.playSound('mission_1_phase7_begin'); // 8 sec (18 total delay)
                }

                //Check conditions
                if (seconds_added > 2567 && seconds_added < 2627) {
                    var mph = (position.coords.speed * 2.23694);
                    if (mph < 6.5) {
                        mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                        stopMission(mission_attempt, total_km_rounded);
                        myPlugin.playSound('missionFailed');
                    }
                }

                if (seconds_added == 2627) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 7 //////////////

                // time: 43:47

                ////////////// Phase 8 //////////////

                //phase 8:
                //time: 43:30
                //goal: 6.5 miles an hour for 1 minutes
                //dialog: task complete.  you must run 6.5 miles per hour for 1 minute.  beginning in 10 seconds.

                if (seconds_added == 2610) {
                    myPlugin.playSound('mission_1_phase8_begin'); // 8 sec (18 total delay)
                }

                //Check conditions
                if (seconds_added > 2627 && seconds_added < 2687) {
                    var mph = (position.coords.speed * 2.23694);
                    if (mph < 6.5) {
                        mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                        stopMission(mission_attempt, total_km_rounded);
                        myPlugin.playSound('missionFailed');
                    }
                }

                if (seconds_added == 2687) {
                    myPlugin.playSound('task_complete');
                }

                if (seconds_added == 2700) {
                    myPlugin.playSound('mission_complete');
                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                    stopMission(mission_attempt, total_km_rounded);
                }

                ////////////// End Phase 8 //////////////

                // time: 45:00

                ////////////// Phase 9 //////////////

                //phase 9:
                //time: 50:00
                //goal: 4 miles an hour for 5 minutes
                //dialog: task complete.  you must run 4 miles per hour for 5 minutes.  beginning in 10 seconds.

                if (seconds_added == 3000) {
                    myPlugin.playSound('mission_1_phase9_begin'); // 7 sec (17 total delay)
                }

                //Check conditions
                if (seconds_added > 3016 && seconds_added < 3316) {
                    var mph = (position.coords.speed * 2.23694);
                    if (mph < 4) {
                        mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                        stopMission(mission_attempt, total_km_rounded);
                        myPlugin.playSound('missionFailed');
                    }
                }

                if (seconds_added == 3316) {
                    myPlugin.playSound('task_complete');
                }

                ////////////// End Phase 9 //////////////

                ////////////// Phase 10 //////////////

                //phase 10:
                //time: 57:00
                //goal: 5 miles an hour for 3 minutes
                //dialog: task complete.  you must run 5 miles per hour for 3 minutes.  beginning in 10 seconds.

                if (seconds_added == 3420) {
                    myPlugin.playSound('mission_1_phase10_begin'); // 7 sec (17 total delay)
                }

                //Check conditions
                if (seconds_added > 3436 && seconds_added < 3616) {
                    var mph = (position.coords.speed * 2.23694);
                    if (mph < 5) {
                        mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                        stopMission(mission_attempt, total_km_rounded);
                        myPlugin.playSound('missionFailed');
                    }
                }

                if (seconds_added == 3616) {
                    myPlugin.playSound('mission_complete');
                    mission_1_amount_of_tries = mission_1_amount_of_tries + 1;
                    stopMission(mission_attempt, total_km_rounded);
                }

                ////////////// End Phase 10 //////////////

                // time: 60:00
            }

            //Add next second
            // final_time_s = final_time_s + 1;
            // seconds_added = seconds_added + 1;

            //Reset seconds display each minute to 0
            if (final_time_s == 60) {
                final_time_s = 0;
                final_time_m = final_time_m + 1;
            }

        }
        ,

// Error
        function (error) {
            console.log(error);
        }
        ,

// Settings
        {
            frequency: 5000, enableHighAccuracy: true
        }
    )
    ;

// Tidy up the UI
    track_id = "Endurance";

}

//End of Mission 1

//Start Tracking Mission 2
function playMission2() {

    runProgress();

    //If the game has been paused restore all data
    if (tracking_data_mission2_paused == true) {
        tracking_data_mission2 = tracking_data_mission2_paused_data;
        final_time_m = final_time_m_paused_data;
        final_time_s = final_time_s_paused_data;
        seconds_added = seconds_added_paused_data;
        two_x = parseInt(two_x);
        speeds = speeds_mission2_paused_data;
        average = average_mission2_paused_data;
    }
    //If the game has never been paused clear results
    else {
        tracking_data_mission2 = [];
        tracking_data_mission2.length = 0;
        speeds = [];
        final_time_m = 0;
        final_time_s = 0;
        two_x = parseInt(two_x + 1);
        seconds_added = 0;
        average = 0;
    }

    //Add next second
    var myTimer = setInterval(function () {

        //Display current time in view
        $('.time-minutes').html(((Math.round(final_time_m))).toString() + ":");
        $('.time-seconds').html(((Math.round(final_time_s))).toString());

        final_time_s = final_time_s + 1;
        seconds_added = seconds_added + 1;

    }, 1000);

    //Label mission attempt with correct title prefix
    mission_attempt = "Speed - " + two_x;

    // Start tracking the User
    watch_mission_2 = navigator.geolocation.watchPosition(
        // Success
        function (position) {
            //Push position to array
            position.seconds = final_time_s;
            position.minutes = final_time_m;
            position.longitude = position.coords.longitude;
            position.latitude = position.coords.latitude;

            tracking_data_mission2.push(position);

            //Collect speed
            speeds.push(position.coords.speed * 1000);

            //Save array to local storage
            window.localStorage.setItem(mission_attempt, JSON.stringify(tracking_data_mission2));

            // Get all the GPS data for the specific workout
            var data = window.localStorage.getItem(mission_attempt);

            // Turn the stringified GPS data back into a JS object
            data = JSON.parse(data);

            // Calculate the total distance travelled
            total_km = 0;

            for (i = 0; i < data.length; i++) {

                if (i == (data.length - 1)) {

                    break;

                }

                total_km += gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i + 1].coords.latitude, data[i + 1].coords.longitude);

            }

            total_km_rounded = total_km.toFixed(2);
            total_miles_rounded = total_km_rounded * 0.6214;
            total_m_rounded = total_km_rounded * 1000;
            //Update current distance
            $('#mission-2-distance').html(total_km_rounded + ' km');

            //Update current time
            start_time = new Date(data[0].timestamp).getTime();
            end_time = new Date(data[data.length - 1].timestamp).getTime();

            total_time_ms = end_time - start_time;
            total_time_s = total_time_ms / 1000;

            //Set time temps
            mission_attempt_final_time_m = final_time_m;
            mission_attempt_final_time_s = final_time_s;

            minutes_in_seconds = final_time_m * 60;
            remaining_seconds = final_time_s;
            total_seconds = minutes_in_seconds + remaining_seconds;

            num_to_float = total_m_rounded / seconds_added;
            average = Math.round(parseFloat(num_to_float));

            //Prevent infinite average
            if (average <= 0 || average == "infinity") {
                average = 0;
            }

            //Display current time in view
            // $('.time-minutes').html(((Math.round(final_time_m))).toString() + " minutes ");
            // $('.time-seconds').html(((Math.round(final_time_s))).toString() + " seconds");

            //Display average speed
            $('#mission-2-pace').html(getAverage(total_m_rounded, seconds_added).toFixed(2).toString() + ' m per sec');

            //Mission conditionals

            //If duration is 30 minutes
            if (duration == 30) {

                //Fill in progress bar
                if ($('#progress').html() != "100%") {
                    //Calculate percent
                    percent = Math.round((seconds_added / 1800) * 100);
                    $('#progress').empty();
                    $('#progress').append(percent.toString() + '%');
                }

                //Determine if average is higher
                if (seconds_added == 15) {
                    //15 seconds hit
                    current_average = getAverage(total_m_rounded, seconds_added);
                    speed_to_beat = (current_average * 0.20) + current_average;
                }

                //Wait 5 seconds for user to start running faster

                //Check average every second after average is set
                if (seconds_added > 19 && seconds_added < 51) {

                    if (average < speed_to_beat) {
                        myPlugin.pauseMusic();
                        myPlugin.soundNegative();
                        mission_2_amount_of_tries = mission_2_amount_of_tries + 1;
                        stopMission();
                    }
                }

                //User beat average speed challenge
                if (seconds_added == 51) {
                    //User ran 15% faster for 30 seconds
                    myPlugin.pauseMusic();
                    myPlugin.soundPositive();
                }

                //End of mission timer
                if (seconds_added == 1800) {
                    //30 minutes hit
                    mission_2_amount_of_tries = mission_2_amount_of_tries + 1;
                    stopMission();
                }

            }

            //If duration is 45 minutes
            if (duration == 45) {

                //Fill in progress bar
                if ($('#progress').html() != "100%") {
                    //Calculate percent
                    percent = Math.round((seconds_added / 2700) * 100);
                    $('#progress').empty();
                    $('#progress').append(percent.toString() + '%');
                }

                //Determine if average is higher
                if (seconds_added == 15) {
                    //15 seconds hit
                    current_average = getAverage(total_m_rounded, seconds_added);
                    speed_to_beat = (current_average * 0.20) + current_average;
                }

                //Wait 5 seconds for user to start running faster

                //Check average every second after average is set
                if (seconds_added > 19 && seconds_added < 51) {

                    //If user falls below 15% higher during this time
                    if (average < speed_to_beat) {
                        myPlugin.pauseMusic();
                        myPlugin.soundNegative();
                        mission_2_amount_of_tries = mission_2_amount_of_tries + 1;
                        stopMission();
                    }

                }

                //User beat average speed challenge
                if (seconds_added == 51) {
                    //User ran 15% faster for 30 seconds
                    myPlugin.pauseMusic();
                    myPlugin.soundPositive();
                }

                //End of mission timer
                if (seconds_added == 2700) {
                    //30 minutes hit
                    mission_2_amount_of_tries = mission_2_amount_of_tries + 1;
                    stopMission();
                }

            }

            //If duration is 60 minutes
            if (duration == 60) {
                //Fill in progress bar
                if ($('#progress').html() != "100%") {
                    //Calculate percent
                    percent = Math.round((seconds_added / 3600) * 100);
                    $('#progress').empty();
                    $('#progress').append(percent.toString() + '%');
                }

                //Determine if average is higher
                if (seconds_added == 15) {
                    //15 seconds hit
                    current_average = getAverage(total_m_rounded, seconds_added);
                    speed_to_beat = (current_average * 0.20) + current_average;
                }

                //Wait 5 seconds for user to start running faster

                //Check average every second after average is set
                if (seconds_added > 19 && seconds_added < 51) {

                    //If user falls below 15% higher during this time
                    if (average < speed_to_beat) {
                        myPlugin.pauseMusic();
                        myPlugin.soundNegative();
                        mission_2_amount_of_tries = mission_2_amount_of_tries + 1;
                        stopMission();
                    }

                }

                //User beat average speed challenge
                if (seconds_added == 51) {
                    //User ran 15% faster for 30 seconds
                    myPlugin.pauseMusic();
                    myPlugin.soundPositive();
                }

                //End of mission timer
                if (seconds_added == 3600) {
                    //30 minutes hit
                    mission_2_amount_of_tries = mission_2_amount_of_tries + 1;
                    stopMission();
                }
            }

            //Add next second
            // final_time_s = final_time_s + 1;
            // seconds_added = seconds_added + 1;

            //Reset seconds display each minute to 0
            if (final_time_s == 60) {
                final_time_s = 0;
                final_time_m = final_time_m + 1;
            }

        },

        // Error
        function (error) {
            console.log(error);
        },

        // Settings
        {frequency: 3000, enableHighAccuracy: true});

    // Tidy up the UI
    track_id = "Speed";

}

//End of Mission 2

function stopMissionConfirmation() {
    //Enable confirmation overlay
    $('#stopMissionConfirmation').show();
}

function closeStopMissionConfirmation() {
    //Enable confirmation overlay
    $('#stopMissionConfirmation').hide();

}

function stopMission(name, total) {

    //Stop music
    //myPlugin.stopMusic();

    console.log('total is', total);
    showLoader();

    var item = name + '-finished';
    var obj = {
        totalDistance: total
    };
    if (!window.localStorage.getItem(item)) {
        window.localStorage.setItem(item, JSON.stringify(obj));
    }

    $('div[data-role="footer"]').show();

    //Stop timer
    for (var i = 1; i < 99999; i++) {
        window.clearInterval(i);
    }

    //Disable confirmation overlay
    $('#stopMissionConfirmation').hide();

    //Store average speed
    all_averages.push(average);

    var total_average = window.localStorage.getItem('total_average');
    if (total_average) {
        window.localStorage.setItem('total_average', all_averages);
    }
    else {
        window.localStorage.setItem('total_average', []);
    }

    //Store total runs
    total_runs++;
    window.localStorage.setItem('total_runs', total_runs);

    //Store distance
    all_distances.push(total_m_rounded);

    var total_distance = window.localStorage.getItem('total_distance');
    if (total_distance) {
        added_distance = total_distance + total_m_rounded;
    }
    else {
        added_distance = total_m_rounded;
    }
    window.localStorage.setItem('total_distance', added_distance);

    //Store time variables
    var total_duration = window.localStorage.getItem('total_duration');
    var total_duration = parseInt(total_duration) + parseInt(seconds_added);
    window.localStorage.setItem('total_duration', total_duration);

    var temp_m = window.localStorage.getItem('temp_time_m');
    var temp_s = window.localStorage.getItem('temp_time_s');

    var prev_m = window.localStorage.getItem('final_time_m');
    var prev_s = window.localStorage.getItem('final_time_s');

    var total_m = (+temp_m) + (+prev_m);
    var total_s = (+temp_s) + (+prev_s);

    window.localStorage.setItem('final_time_m', total_m);
    window.localStorage.setItem('final_time_s', total_s);

    if (mission1 == true) {
        // Stop tracking the user
        navigator.geolocation.clearWatch(watch_mission_1);

        // Reset watch_id and tracking_data
        var watch_id = null;
        var tracking_data_mission1 = [];
        tracking_data_mission1_paused = false;

    }

    if (mission2 == true) {
        // Stop tracking the user
        navigator.geolocation.clearWatch(watch_mission_2);

        // Reset watch_id and tracking_data
        var watch_id = null;
        var tracking_data_mission2 = [];
        tracking_data_mission2_paused = false;

    }

    //Reset pause
    $('#pauseMission').show();
    $('#continueMission').hide();

    //Reset time
    final_time_m = 0;
    final_time_s = 0;

    //Go to mission history screen
    var title = mission_attempt;
    $("#track_info").attr("track_id", title);
    $.mobile.changePage($("#track_info"), {transition: "slide"});

    //$.mobile.changePage($("#history"), {'transition': 'slide'});

    //Check for mission unlocks
    //if (mission_1_amount_of_tries > 3) {
    //    mission2_unlocked = true;
    //    $('.mission2_status').html('<img src="../img/icons/icons_checked.png" /><span class="next-arrow">&rsaquo;</span>');
    //}
    //if (mission_2_amount_of_tries > 3) {
    //    mission3_unlocked = true;
    //    $('.mission3_status').html('<img src="../img/icons/icons_checked.png" /><span class="next-arrow">&rsaquo;</span>');
    //}

}

$('#settings').live('pageshow', function () {

    var unit = window.localStorage.getItem('selected_unit');
    if (!unit) {
        window.localStorage.setItem('selected_unit', 'MPH');
        $('#currentUnit').html('MPH');
    } else {
        $('#currentUnit').html(unit);
    }
});

//User views mission selection screen
$('#mission_select').live('pageshow', function () {

    //Set current view
    currentPage = '#mission_select';

    //Set menu active state
    missionsButtonActive();

    //$('span.list-number:eq(0)').css('background', '#00cccc');
    //$('span.push:eq(0)').css('color', '#000');
    //$('span.list-number:eq(1)').css('background', '#00cccc');
    //$('span.push:eq(1)').css('color', '#000');
    //$('.mission:eq(1)').addClass('active');

    //if (mission2_unlocked == true) {
    //    $('span.list-number:eq(1)').css('background', '#00cccc');
    //    $('span.push:eq(1)').css('color', '#000');
    //    $('.mission:eq(1)').addClass('active');
    //}

});

$("#home_clearstorage_button").bind('touchend', function () {
    window.localStorage.clear();
    reset_mission_attempts();

});

// When the user views the main dashboard
$('#home').live('pageshow', function () {

    //Set current view
    currentPage = '#home';

    //Set menu active state
    homeButtonActive();

    //Show overall average speed

    //If missions have been played and saved average speed

    var total_average = window.localStorage.getItem('total_average');

    if (total_average && total_average.length > 0) {
        $.each(total_average, function (index, item) {
            //Add all averages
            sum = parseInt(sum) + parseInt(item);
        });

        //Determine about to be divided to calculate average
        amount_of_averages = parseInt(total_average.length);

        //Get total average
        total_average = parseInt(sum / amount_of_averages);

        var unit = window.localStorage.getItem('selected_unit');
        if (!unit) {
            window.localStorage.setItem('selected_unit', 'MPH');
            unit = window.localStorage.getItem('selected_unit').toLowerCase();
        } else {
            unit = window.localStorage.getItem('selected_unit').toLowerCase();
        }
        //Display average in view
        if (isNaN(total_average)) {
            switch (unit) {
                case 'meters':
                    break;
                case 'kilometers':
                    $('#total_average').html('0 km/hr');
                    break;
                case 'mph':
                    $('#total_average').html('0 mph');
                    break;
            }
        }
        else {
            switch (unit) {
                case 'meters':
                    $('#total_average').html(total_average + ' meters/sec');
                    break;
                case 'kilometers':
                    var kilometers = total_average * 3.6;
                    $('#total_average').html(kilometers.toFixed(2) + ' km/hr');
                    break;
                case 'mph':
                    var mph = total_average * 2.23694;
                    $('#total_average').html(mph.toFixed(2) + ' mph');
                    break;
            }
        }
    } else {
        var unit = window.localStorage.getItem('selected_unit');
        if (!unit) {
            window.localStorage.setItem('selected_unit', 'MPH');
            unit = window.localStorage.getItem('selected_unit').toLowerCase();
        } else {
            unit = window.localStorage.getItem('selected_unit').toLowerCase();
        }
        switch (unit) {
            case 'meters':
                break;
            case 'kilometers':
                $('#total_average').html('0 km/hr');
                break;
            case 'mph':
                $('#total_average').html('0 mph');
                break;
        }
    }

    //Show total distance traveled

    //If missions have been played and saved distance
    // if (all_distances.length>0){
    //   $.each(all_distances, function(index, item) {
    //     //Add all distances
    //     total_distance = parseInt(total_distance) + parseInt(item);
    //   });

    //Display total distance in view
    //   var total_average = window.localStorage.getItem('total_distance');
    //   if (isNaN(total_average)){
    //     $('#total_distance').html(total_distance + ' meters');
    //   }
    //   else{
    //     $('#total_distance').html('0' + ' meters');
    //   }
    // }

    //Show total runs
    var total_runs_stat = window.localStorage.getItem('total_runs');
    if (total_runs_stat) {
        $('#total_runs').html(total_runs_stat);
    }
    else {
        $('#total_runs').html('0');
    }

    //Show total duration

    var total_s = window.localStorage.getItem('final_time_s');
    var total_m = window.localStorage.getItem('final_time_m');

    total_m_float = total_s / 60;
    total_m = total_m_float.toFixed(0);

    var hours = Math.floor(total_s / (60 * 60));

    var divisor_for_minutes = total_s % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    $('#total_duration').html(hours + ':' + minutes + ':' + seconds);

});

// When the user views the mission options page
$('#mission_options').live('pageshow', function () {

    //Set current view
    currentPage = '#mission_options';

    //Set menu active state
    missionsButtonActive();

    //Collect mission specific data
    current_mission = $('#mission_options h1').html();
    current_mission_description = $('#mission_options p.mission_description').html();

    //Reapply loading message for next mission
    $('#loading').html('Starting Mission...');

    //Check song title for null
    if ($('#options_select_playlist').html() == "(null)") {
        $('#options_select_playlist').html('&rsaquo;');
    }

});

//Select duration view

$('#options_select_duration').live('pageshow', function () {

    //Set current view
    currentPage = '#options_select_duration';

    //Set menu active state
    missionsButtonActive();

});

// When the user views the history page
$('#history').live('pageshow', function () {

    setTimeout(function () {
        $('.loader').hide();
    }, 500);

    //Set current view
    currentPage = '#history';

    //Set menu active state
    historyButtonActive();

    //Stop music
    myPlugin.stopMusic();
    myPlugin.stopAudioPlayer();

    // Count the number of entries in localStorage and display this information to the user
    tracks_recorded = window.localStorage.length;
    //$("#tracks_recorded").html("<strong>" + tracks_recorded + "</strong> workout(s) recorded");

    // Empty the list of recorded tracks
    $("#history_tracklist").empty();

    //Create empty arrays for mission sorting
    mission_1_set = new Array();
    temp_index_1 = new Array();
    mission_2_set = new Array();
    temp_index_2 = new Array();

    // Iterate over all of the recorded tracks, populating the list
    for (i = 0; i < tracks_recorded; i++) {
        //Sort data by mission
        var item_full = window.localStorage.key(i);

        var item = item_full.split(" - ");
        if (item[1] && item[1].indexOf('additionalDetails') == -1 && item[1].indexOf('finished') == -1) {
            if (item[0] == "Endurance") {
                mission_1_set.push(item_full);
                temp_index_1.push(item[1]);
            }

            if (item[0] == "Speed") {
                mission_2_set.push(item_full);
                temp_index_2.push(item[1]);
            }

        }
    }

    // current total measurement in kilometers
    var unitAbbreviaton;
    var unit = window.localStorage.getItem('selected_unit').toLowerCase();
    console.log('current unit is ', unit);
    switch (unit) {
        case 'meters':
            unitAbbreviaton = "m";
            break;
        case 'kilometers':
            unitAbbreviaton = "km";
            break;
        case 'mph':
            unitAbbreviaton = " miles";
            break;
    }


    //Mission 1 data
    temp_index_1.sort();
    $.each(temp_index_1, function (index, item) {
        var key = 'Endurance - ' + item + '-additionalDetails';
        var finish = 'Endurance - ' + item + '-finished';
        var data = window.localStorage.getItem(key);
        var json = JSON.parse(data) ? JSON.parse(data) : null;
        var date = '';
        if (json && json.date) {
            date = json.date;
        }
        var dateString = moment(date).format('MMM DD') + ', ' + moment(date).format('YYYY') + ' - ' + moment(date).format('h') + ':' + moment(date).format('mmA');
        var finished = window.localStorage.getItem(finish);
        var finishedJson = JSON.parse(finished);
        var distance = '';
        if (finishedJson && finishedJson.totalDistance) {
            distance = finishedJson.totalDistance;
        }
        var unit = window.localStorage.getItem('selected_unit').toLowerCase();
        var totalDistanceConverted = 0;
        if (distance) {
            switch (unit) {
                case 'meters':
                    totalDistanceConverted = (parseFloat(distance) * 1000).toFixed(2);
                    break;
                case 'kilometers':
                    totalDistanceConverted = (parseFloat(distance)).toFixed(2);
                    break;
                case 'mph':
                    totalDistanceConverted = (parseFloat(distance) * 0.621371).toFixed(2);
                    break;
            }

        }

        var distanceString = totalDistanceConverted + unitAbbreviaton;

        $("#history_tracklist").append("<li><img class=\"table-row-icon\" src=\"img/icons/Shoes_gray.png\" /><a class='track_info' href='#'>" + 'Endurance - ' + item + "</a><div class='table-row-subtitle'>" + dateString + "</div><div class='table-row-right-label'>" + distanceString + "</div></li>");
    });

    //Mission 2 data
    temp_index_2.sort();
    $.each(temp_index_2, function (index, item) {
        var key = 'Speed - ' + item + '-additionalDetails';
        var finish = 'Speed - ' + item + '-finished';
        var data = window.localStorage.getItem(key);
        var json = JSON.parse(data) ? JSON.parse(data) : null;
        var date = '';
        if (json && json.date) {
            date = json.date;
        }
        var dateString = moment(date).format('MMM DD') + ', ' + moment(date).format('YYYY') + ' - ' + moment(date).format('h') + ':' + moment(date).format('mmA');
        var finished = window.localStorage.getItem(finish);
        var finishedJson = JSON.parse(finished);
        var distance = '';
        if (finishedJson && finishedJson.totalDistance) {
            distance = finishedJson.totalDistance;
        }
        var unit = window.localStorage.getItem('selected_unit').toLowerCase();
        var totalDistanceConverted = 0;
        if (distance) {
            switch (unit) {
                case 'meters':
                    totalDistanceConverted = (parseFloat(distance) * 1000).toFixed(2);
                    break;
                case 'kilometers':
                    totalDistanceConverted = (parseFloat(distance)).toFixed(2);
                    break;
                case 'mph':
                    totalDistanceConverted = (parseFloat(distance) * 0.621371).toFixed(2);
                    break;
            }

        }

        var distanceString = totalDistanceConverted + unitAbbreviaton;
        $("#history_tracklist").append("<li><img class=\"table-row-icon\" src=\"img/icons/Shoes_gray.png\" /><a class='track_info' href='#'>" + 'Speed - ' + item + "</a><div class='table-row-subtitle'>" + dateString + "</div><div class='table-row-right-label'>" + distanceString + "</div></li>");
    });

    //Store initial view
    var history_all = $('#history_tracklist').html();

    //View options

    //Sort history by all
    $('#history_all').bind('touchend', function () {
        resetExtendedHeaderButtons();
        $(this).addClass('active');
        $('#history_by_mission_list').hide();
        $('#history_tracklist').html(history_all);
        $('#history_tracklist').show();

        // Tell jQueryMobile to refresh the list
        $("#history_tracklist").listview('refresh');

    });

    //Sort history by mission
    $('#history_by_mission').bind('touchend', function () {
        resetExtendedHeaderButtons();
        $(this).addClass('active');
        $('#history_by_mission_list').show();
        $('#history_tracklist').hide();

    });

    //Individual mission history view
    $('.history_by_mission').live('click', function () {

        //Hide mission list
        $('#history_by_mission_list').hide();
        $('#history_tracklist').empty();
        $('#history_tracklist').show();

        //List display for view by individual mission screen
        if ($(this).html() == "Endurance") {
            $.each(temp_index_1, function (index, item) {
                var key = 'Endurance - ' + item + '-additionalDetails';
                var finish = 'Endurance - ' + item + '-finished';
                var data = window.localStorage.getItem(key);
                var json = JSON.parse(data);
                var date = '';
                if (json && json.date) {
                    date = json.date;
                }
                var dateString = moment(date).format('MMM DD') + ', ' + moment(date).format('YYYY') + ' - ' + moment(date).format('h') + ':' + moment(date).format('mmA');
                var finished = window.localStorage.getItem(finish);
                var finishedJson = JSON.parse(finished);
                var distance = '';
                if (finishedJson && finishedJson.totalDistance) {
                    distance = finishedJson.totalDistance;
                }
                var unit = window.localStorage.getItem('selected_unit').toLowerCase();
                var totalDistanceConverted = 0;
                if (distance) {
                    switch (unit) {
                        case 'meters':
                            totalDistanceConverted = (parseFloat(distance) * 1000).toFixed(2);
                            break;
                        case 'kilometers':
                            totalDistanceConverted = (parseFloat(distance)).toFixed(2);
                            break;
                        case 'mph':
                            totalDistanceConverted = (parseFloat(distance) * 0.621371).toFixed(2);
                            break;
                    }

                }

                var distanceString = totalDistanceConverted + unitAbbreviaton;
                $("#history_tracklist").append("<li><img class=\"table-row-icon\" src=\"img/icons/Shoes_gray.png\" /><a class='track_info' href='#'>" + "Endurance - " + item + "</a><div class='table-row-subtitle'>" + dateString + "</div><div class='table-row-right-label'>" + distanceString + "</div></li>");
            });
        }

        if ($(this).html() == "Speed") {
            if (temp_index_2.length > 0) {
                $.each(temp_index_2, function (index, item) {
                    var key = 'Speed - ' + item + '-additionalDetails';
                    var finish = 'Speed - ' + item + '-finished';
                    var data = window.localStorage.getItem(key);
                    var json = JSON.parse(data);
                    var date = '';
                    if (json && json.date) {
                        date = json.date;
                    }
                    var dateString = moment(date).format('MMM DD') + ', ' + moment(date).format('YYYY') + ' - ' + moment(date).format('h') + ':' + moment(date).format('mmA');
                    var finished = window.localStorage.getItem(finish);
                    var finishedJson = JSON.parse(finished);
                    var distance = '';
                    if (finishedJson && finishedJson.totalDistance) {
                        distance = finishedJson.totalDistance;
                    }
                    var unit = window.localStorage.getItem('selected_unit').toLowerCase();
                    var totalDistanceConverted = 0;
                    if (distance) {
                        switch (unit) {
                            case 'meters':
                                totalDistanceConverted = (parseFloat(distance) * 1000).toFixed(2);
                                break;
                            case 'kilometers':
                                totalDistanceConverted = (parseFloat(distance)).toFixed(2);
                                break;
                            case 'mph':
                                totalDistanceConverted = (parseFloat(distance) * 0.621371).toFixed(2);
                                break;
                        }

                    }

                    var distanceString = totalDistanceConverted + unitAbbreviaton;

                    $("#history_tracklist").append("<li><img class=\"table-row-icon\" src=\"img/icons/Shoes_gray.png\" /><a class='track_info' href='#'>" + "Speed - " + item + "</a><div class='table-row-subtitle'>" + dateString + "</div><div class='table-row-right-label'>" + distanceString + "</div></li>");
                });
            } else {
                $("#history_tracklist").append("<li><div class='table-row-subtitle'>No results</div><div class='table-row-right-label'></div></li>");
            }
        }

        // Tell jQueryMobile to refresh the list
        $("#history_tracklist").listview('refresh');

    });

    //Remove duration saved data from list
    $('li a.track_info').each(function () {

        if ($(this).html() == 'duration') {
            $(this).closest('li').remove();
        }

    });

    // Tell jQueryMobile to refresh the list
    $("#history_tracklist").listview('refresh');

});

// When the user clicks a link to view track info, set/change the track_id attribute on the track_info page.
$("#history_tracklist li").live('click', function () {
    $("#track_info").attr("track_id", $(this).find('a.track_info').text());
    $.mobile.changePage($("#track_info"), {transition: "slide"});
});


// When the user views the Track Info page
$('#track_info').live('pageshow', function () {

    setTimeout(function () {
        $('.loader').hide();
        //Stop music
        myPlugin.stopMusic();
    }, 2000);

    //Set current view
    currentPage = '#track_info';

    //Stop music
    // if (externalAudioPlayer) {
    //myPlugin.stopExternalAudio();
    //} else {
    // myPlugin.stopAudioPlayer();
    //}

    //Set menu button active
    historyButtonActive();

    // Find the track_id of the workout they are viewing
    var key = $(this).attr("track_id");

    // Update the Track Info page header to the track_id
    $("#track_info div[data-role=header] h1").text(key);

    tracks_recorded = window.localStorage.length;

    //  for(i=0; i<tracks_recorded; i++){
    //   alert(window.localStorage.key(i));
    // }

    // Get all the GPS data for the specific workout
    console.log('key is ', key);
    var data = window.localStorage.getItem(key);
    //console.log('data', data);

    // Turn the stringified GPS data back into a JS object
    data = JSON.parse(data);
    console.log(data);
    //alert(JSON.stringify(data));

    // Calculate the total distance travelled
    total_km = 0;

    for (i = 0; i < data.length; i++) {

        if (i == (data.length - 1)) {
            break;
        }
        y = i + 1;
        total_km += gps_distance(data[i].latitude, data[i].longitude, data[y].latitude, data[y].longitude);
    }

    total_km_rounded = total_km.toFixed(2);
    total_miles_rounded = total_km_rounded * 0.6214;

    // Calculate the total time taken for the track
    // start_time = new Date(data[0].timestamp).getTime();
    // end_time = new Date(data[data.length-1].timestamp).getTime();

    // total_time_ms = end_time - start_time;
    // total_time_s = total_time_ms / 1000;

    final_time_m = data[data.length - 1].minutes;
    final_time_s = data[data.length - 1].seconds;
    var durationMinutes = data[data.length - 1].durationMinutes;
    var durationSeconds = data[data.length - 1].durationSeconds;
    if (durationSeconds < 10) {
        durationSeconds = "0" + durationSeconds;
    }

    // 'Longitude: '          + position.coords.longitude             + '<br />' +
    // 'Altitude: '           + position.coords.altitude              + '<br />' +
    // 'Accuracy: '           + position.coords.accuracy              + '<br />' +
    // 'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
    // 'Heading: '            + position.coords.heading               + '<br />' +
    // 'Speed: '              + position.coords.speed                 + '<br />' +
    // 'Timestamp: '          + position.timestamp                    + '<br />';

    //var duration = data[0].duration;

    var foundAverageInMeters, foundAverageInKilometers, foundAverageInMiles, averageInMeters, averageInKilometers, averageInMiles;

    for (var i = data.length; i > 0; i--) {

        if (data[i] && data[i].averageInMeters && !foundAverageInMeters) {
            foundAverageInMeters = true;
            averageInMeters = parseFloat(data[i].averageInMeters).toFixed(2);
            console.log('found average in meters', averageInMeters);
        }

        if (data[i] && (data[i].averageInKilometers == 0 || data[i].averageInKilometers) && !foundAverageInKilometers) {
            foundAverageInKilometers = true;
            averageInKilometers = data[i].averageInKilometers.toFixed(2);
            console.log('found average in kilometers', averageInKilometers);
        }

        if (data[i] && data[i].averageInMiles && !foundAverageInMiles) {
            foundAverageInMiles = true;
            averageInMiles = parseFloat(data[i].averageInMiles).toFixed(2);
            console.log('found average in miles', averageInMiles);
        }

    }

    var getUnit = function () {
        var unit;
        unit = window.localStorage.getItem('selected_unit');
        if (!unit) {
            window.localStorage.setItem('selected_unit', 'MPH');
            unit = "mph";
        } else {
            unit = window.localStorage.getItem('selected_unit').toLowerCase();
        }
        return unit;
    };

    var unit = getUnit();
    var avg_pace;
    switch (unit) {
        case 'meters':
            avg_pace = averageInMeters;
            break;
        case 'kilometers':
            avg_pace = averageInKilometers;
            break;
        case 'mph':
            avg_pace = averageInMiles;
            break;
    }

    var max_speed = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].speed > max_speed) {
            max_speed = data[i].speed;
        }
    }

    console.log('switch unit', unit);
    switch (unit) {
        case 'meters':
            max_speed = max_speed.toFixed(2);
            break;
        case 'kilometers':
            max_speed = (max_speed * 0.001).toFixed(2);
            break;
        case 'mph':
            max_speed = (max_speed * 0.000621371).toFixed(2);
            break;
    }

    var elevation = 0;
    var initial_altitude = 0;

    for (var i = 0; i < data.length; i++) {
        if (i == 0) {
            initial_altitude = data[i].altitude;
        }
        if (data[i].altitude > elevation && data[i].altitude > initial_altitude) {
            elevation = data[i].altitude - initial_altitude;
        }
    }

    var totalDistance = 0;
    var distanceUnit;
    switch (unit) {
        case 'meters':
            totalDistance = parseFloat(total_km_rounded * 1000).toFixed(2);
            console.log('total distance meters', totalDistance);
            distanceUnit = "m";
            break;
        case 'kilometers':
            totalDistance = parseFloat(total_km_rounded).toFixed(2);
            distanceUnit = "km";
            break;
        case 'mph':
            totalDistance = parseFloat(total_km_rounded * 0.621371).toFixed(2);
            distanceUnit = "mi";
            break;
    }

    // Display total distance and time
    $("#track_info_info").html('Travelled <strong>' + Math.round(total_miles_rounded).toFixed(2) + '</strong> miles in <strong>' + Math.round(final_time_m) + 'm</strong> and <strong>' + Math.round(final_time_s) + 's</strong>');

    $('.tile-label:contains("Distance")').html('Distance (' + distanceUnit + ')');
    $('#track_distance').html(totalDistance);
    $('#track_duration').html(durationMinutes + ":" + durationSeconds);
    $('#track_avg_pace').html(avg_pace + '');
    $('#track_elevation').html(Math.round(elevation.toFixed(2)) + 'm');
    $('#track_max_speed').html(max_speed);

    $('#history_play_mission').unbind('touchend');
    $('#history_play_mission').bind('touchend', function () {
        var mission = key.split('-')[0].toLowerCase().trim();

        //Get title of mission
        var title = key.split('-')[0].trim();
        $('.selected_mission').html(title);

        switch (mission) {
            case 'endurance':
                //Apply description to view
                description = "Improve your endurance as you gradually must increase your speed for longer periods of time to complete the training session.";
                $('.mission_description').html(description);
                mission1_active();
                break;
            case 'speed':
                //Apply description to view
                description = "Improve your overall speed as you gradually have to run faster sprints to complete the training session.";
                $('.mission_description').html(description);
                mission2_active();
                break;
        }
    });

    // Set the initial Lat and Long of the Google Map
    var myLatLng = new google.maps.LatLng(data[0].latitude, data[0].longitude);

    // Google Map options
    var myOptions = {
        zoom: 15,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Create the Google Map, set options
    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    var trackCoords = [];

    // Add each GPS entry to an array
    for (i = 0; i < data.length; i++) {
        trackCoords.push(new google.maps.LatLng(data[i].latitude, data[i].longitude));
    }

    // Plot the GPS entries as a line on the Google Map
    var trackPath = new google.maps.Polyline({
        path: trackCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    // Apply the line to the map
    trackPath.setMap(map);

});

function resetExtendedHeaderButtons() {
    $('.extended-header button').each(function () {
        $(this).removeClass('active');
    });
}

// Mission Options Screen

//Declare all missions as booleans and give them locks
mission1 = new Boolean;
mission1_unlocked = new Boolean();
mission2 = new Boolean;
mission2_unlocked = new Boolean();

//Initially lock/unlock missions
mission1_unlocked = true;
mission2_unlocked = true;

//Resets all mission states so a new one can be declared
function missions_off() {
    mission1 = false;
    mission2 = false;
}

function go_to_mission_options() {
    $.mobile.changePage($("#mission_options"), {transition: "slide"});
}

function mission1_active() {
    missions_off();
    mission1 = true;
    go_to_mission_options();
}

function mission2_active() {
    missions_off();
    mission2 = true;
    if (mission2_unlocked == true) {
        go_to_mission_options();
    }
    else {
        $('.mission2_status').css('color', 'red');
        setTimeout(function () {
            $('.mission2_status').css('color', '#000');
        }, 500);
    }
}

//Delegate mission name to title
$('.mission').bind('touchend', function () {

    //Get title of mission
    var title = $(this).find('.push').html();
    console.log('title is', title);
    //Apply title to view
    $('.selected_mission').html(title);

    //Get mission description based off mission title
    if (title == "Endurance") {
        description = "Improve your endurance as you gradually must increase your speed for longer periods of time to complete the training session.";
    }

    if (title == "Speed") {
        description = "Improve your overall speed as you gradually have to run faster sprints to complete the training session.";
    }

    //Apply description to view
    $('.mission_description').html(description);

});

//Go to select mission duration view
$('#select_duration_button').bind('touchend', function (e) {
    $.mobile.changePage($("#options_select_duration"), {transition: "slide"});
});

// Select Duration
$('a.select_duration').bind('touchend', function (e) {

    //Go back to mission selection screen
    $.mobile.changePage($("#mission_options"), {transition: "slide"});

    //Get current duration
    duration = parseInt($(this).html().split(' ')[0]);

    //Save duration to local storage
    window.localStorage.setItem('duration', duration);

    //Update view with selected duration
    var duration_selected = document.getElementById('options_select_duration_label');
    duration_selected.innerHTML = duration;

    //Alert duration via local storage
    duration_saved = window.localStorage.getItem(duration);

    return false;
});

function showLoader() {
    $('.loader').show();
    setTimeout(function () {
        $('.loader').hide();
    }, 1500);

    setTimeout(function () {
        if ($('.loader').is(':visible')) {
            $('.loader').hide();
        }
    }, 4000);
}

// Select Music
$('#select_music_button').bind('touchstart', function (e) {
    showLoader();
    //Open media player
    myPlugin.sayHello();
});

// Update view with song
function update_music_options(songtitle) {
    $('#options_select_playlist').html(songtitle);
    $('#options_current_song').html(songtitle);
}

function verifySongs(songtitle) {
    var songDuration = parseInt($('#totalSongDuration').html());
    var durationSet = parseInt($('#options_select_duration_label').html());
    console.log('song duration', songDuration);
    console.log('duration set ', durationSet);
    if (songDuration < durationSet) {
        alert('Your current playlist is shorter than your duration so your tracks will auto loop until you are finished.');
    }
}

function no_songs_selected() {
    $('#options_select_playlist').html('Burn the Clock');
    alert('You have not selected any music so you will be assigned a track.');
}

function update_song_title() {

    //Get the current song
    currentSong = $('#options_select_playlist').html();

    //Update song title
    $('#options_current_song').html(currentSong);

    if ($('#options_current_song').html() == "(null") {
        myPlugin.playMusic();
    }

}

// Select Tracking Device
$('button.select_tracking_device').live('touchend', function () {

    //Get current duration
    var tracking = $(this).html();

    //Save duration to local storage
    window.localStorage.setItem('tracking', tracking);

    //Go back to mission selection screen
    $.mobile.changePage($("#mission_options"), {transition: "slide"});

    //Update view with selected duration
    var tracking_device_selected = document.getElementById('options_select_tracking');
    tracking_device_selected.innerHTML = tracking;

});

//Pause mission

function pauseMission() {

    //Stop timer
    for (var i = 1; i < 99999; i++) {
        window.clearInterval(i);
    }

    myPlugin.pauseMusic();

    $('#pauseMission').hide();
    $('#continueMission').css('display', 'inline-block');

    if (mission1 == true) {
        navigator.geolocation.clearWatch(watch_mission_1);

        //Save tracking data
        tracking_data_mission1_paused = true;
        tracking_data_mission1_paused_data = tracking_data_mission1;
        speeds_mission1_paused_data = speeds;
        average_mission1_paused_data = average;

    }

    if (mission2 == true) {
        navigator.geolocation.clearWatch(watch_mission_2);

        //Save tracking data
        tracking_data_mission2_paused = true;
        tracking_data_mission2_paused_data = tracking_data_mission2;
        speeds_mission2_paused_data = speeds;
        average_mission2_paused_data = average;

    }

    //Save time data
    final_time_m_paused_data = final_time_m;
    final_time_s_paused_data = final_time_s;
    seconds_added_paused_data = seconds_added;

}

//Continue mission

function continueMission() {

    myPlugin.playMusic();

    $('#pauseMission').show();
    $('#continueMission').hide();

    if (mission1 == true) {
        playMission1();
    }

    if (mission2 == true) {
        playMission2();
    }

}

//Media player buttons
$('#previous_song').bind('touchend', function (e) {
    myPlugin.skipToPreviousItem();
});

$('#pause_song').bind('touchend', function (e) {
    myPlugin.pauseMusic();
});

$('#play_song').bind('touchend', function (e) {
    myPlugin.playMusic();
});

$('#next_song').bind('touchend', function (e) {
    myPlugin.skipToNextItem();
});


//Footer icons

function grayOut() {
    //Stats
    $('a[data-icon="home"]').attr('style', 'background-image: url("img/icons/nav_bottom_stats_gray.png") !important;');
    //Missions
    $('a[data-icon="missions"]').attr('style', 'background-image: url("img/icons/nav_bottom_mission_gray.png") !important;');
    //History
    $('a[data-icon="star"]').attr('style', 'background-image: url("img/icons/nav_bottom_history_gray.png") !important;');
    //Change text to black
    //$('span.ui-btn-text').attr('style', 'color:#000 !important;');
}

function homeButtonActive() {
    grayOut();
    $('a[data-icon="home"]').attr('style', 'background-image: url("img/icons/nav_bottom_stats_green.png") !important;');
    //Remove borders
    // $('li.ui-block-b').attr('style', 'border-bottom: none !important;');
    // $('li.ui-block-c').attr('style', 'border-bottom: none !important;');
    //Remove colors from menu
    $('li.ui-block-a .ui-btn-text').removeClass('active');
    $('li.ui-block-b .ui-btn-text').removeClass('active');
    $('li.ui-block-c .ui-btn-text').removeClass('active');
    $('li.ui-block-a').removeClass('active');
    $('li.ui-block-b').removeClass('active');
    $('li.ui-block-c').removeClass('active');
    //Apply new border
    $('li.ui-block-a').addClass('active');
    //Apply colored text
    $('li.ui-block-a .ui-btn-text').addClass('active');
}

function missionsButtonActive() {
    grayOut();
    $('a[data-icon="missions"]').attr('style', 'background-image: url("img/icons/nav_bottom_mission_green.png") !important;');
    //Remove borders
    // $('li.ui-block-a').attr('style', 'border-bottom: none !important;');
    // $('li.ui-block-c').attr('style', 'border-bottom: none !important;');
    //Remove colors from menu
    $('li.ui-block-a .ui-btn-text').removeClass('active');
    $('li.ui-block-b .ui-btn-text').removeClass('active');
    $('li.ui-block-c .ui-btn-text').removeClass('active');
    $('li.ui-block-a').removeClass('active');
    $('li.ui-block-b').removeClass('active');
    $('li.ui-block-c').removeClass('active');
    //Apply new border
    $('li.ui-block-b').addClass('active');
    //Apply colored text
    $('li.ui-block-b .ui-btn-text').addClass('active');
}

function historyButtonActive() {
    grayOut();
    $('a[data-icon="star"]').attr('style', 'background-image: url("img/icons/nav_bottom_history_green.png") !important;');
    //Remove borders
    // $('li.ui-block-a').attr('style', 'border-bottom: none !important;');
    // $('li.ui-block-b').attr('style', 'border-bottom: none !important;');
    //Remove colors from menu
    $('li.ui-block-a .ui-btn-text').removeClass('active');
    $('li.ui-block-b .ui-btn-text').removeClass('active');
    $('li.ui-block-c .ui-btn-text').removeClass('active');
    $('li.ui-block-a').removeClass('active');
    $('li.ui-block-b').removeClass('active');
    $('li.ui-block-c').removeClass('active');
    //Apply new border
    $('li.ui-block-c').addClass('active');
    //Apply colored text
    $('li.ui-block-c .ui-btn-text').addClass('active');
}

function getCurrentPage() {
    var url = window.location.href;
    var hash = url.substring(url.indexOf('#') + 1).toString();
    return hash;
}

function openSettings() {
    $.mobile.changePage($("#settings"), {transition: "slideup"});
}

function closeSettings() {
    $.mobile.changePage($(currentPage), {transition: "slidedown"});

    //Apply dynamic data for mission options screen
    $('#mission_options h1').html(current_mission);
    $('#mission_options p.selected_mission').html(current_mission);
    $('#mission_options p.mission_description').html(current_mission_description);

}

////Go to home view
//$('a[data-icon="home"]').bind('touchstart mousedown', function (e) {
//    homeButtonActive();
//});
//
////Go to mission selection view
//$('a[data-icon="missions"]').bind('touchstart mousedown', function (e) {
//    missionsButtonActive();
//});
//
////Go to history view
//$('a[data-icon="star"]').bind('touchstart mousedown', function (e) {
//    historyButtonActive();
//});

//Open settings
$('.settings_icon').bind('touchend', function () {
    openSettings();
});

//Close settings
$('#settings_icon_active').bind('touchend', function () {
    closeSettings();
});

//Initiate opening home page
homeButtonActive();

//Back up for initiating home page on window load
window.onload = function () {
    homeButtonActive();
};

$('a[data-icon="home"]').bind('touchend', function (e) {
    e.stopPropagation();
    e.preventDefault();
    homeButtonActive();
    $.mobile.changePage($('#home'), {transition: "slide"});
    return false;
});

$('a[data-icon="missions"]').bind('touchend', function (e) {
    e.stopPropagation();
    e.preventDefault();
    missionsButtonActive();
    $.mobile.changePage($('#mission_select'), {transition: "slide"});
    return false;
});

$('a[data-icon="star"]').bind('touchend', function (e) {
    e.stopPropagation();
    e.preventDefault();
    historyButtonActive();
    $.mobile.changePage($('#history'), {transition: "slide"});
    return false;
});

$('#history_back_button').bind('touchend', function (e) {
    e.stopPropagation();
    e.preventDefault();
    historyButtonActive();
    $.mobile.changePage($('#history'), {transition: "slide"});
});

$('#settings_back_button').bind('touchend', function (e) {
    e.stopPropagation();
    e.preventDefault();
    historyButtonActive();
    $.mobile.changePage($('#settings'), {transition: "slide"});
});

$('.mission-play-button').bind('touchend', function () {
    var mission = $(this).find('.push').text().toLowerCase();
    switch (mission) {
        case 'endurance':
            mission1_active();
            break;
        case 'speed':
            mission2_active();
            break;
    }
});

$('.start_mission').bind('touchend', function () {
    myPlugin.startMission();
});

$('#stopMission').bind('touchend', function (e) {
    stopMissionConfirmation();
});

$('#pauseMission').bind('touchend', function (e) {
    pauseMission();
});

$('#continueMission').bind('touchend', function (e) {
    continueMission();
});

$('#stopMission_no').bind('touchend', function (e) {
    closeStopMissionConfirmation();
});

$('#stopMission_yes').bind('touchend', function (e) {
    stopMission();
});

$('#select_unit_button').bind('touchend', function () {
    $.mobile.changePage($('#distance-unit-page'), {transition: "slide"});
});

$('.select_distance_unit').bind('touchend', function () {
    var unit = $(this).find('a').text().trim();
    window.localStorage.setItem('selected_unit', unit);
    $.mobile.changePage($('#settings'), {transition: "slide"});
});

