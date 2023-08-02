#import "MyPlugin.h"
#import "CDV.h"

@implementation MyPlugin

@synthesize myPlayer;
@synthesize audioPlayer;
//@synthesize theAudio = _theAudio;
int *externalAudioPlayer = 0;

- (void)sayHello:(CDVInvokedUrlCommand*)command
{
  CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin 2:)"];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    // Override point for customization after application launch.
    
    // instantiate a music player
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    
    // assign a playback queue containing all media items on the device
    [myPlayer setQueueWithQuery: [MPMediaQuery songsQuery]];
    
    // start playing from the beginning of the queue
    //[myPlayer play];
    
    //Shows Media Picker
    
    MPMediaPickerController *picker =
    [[MPMediaPickerController alloc]
     initWithMediaTypes: MPMediaTypeAnyAudio];
    
    [picker setDelegate: self];
    [picker setAllowsPickingMultipleItems: YES];
    picker.prompt =
    NSLocalizedString (@"Add songs to play",
                       "Prompt in media item picker");
    
    [[self viewController] presentModalViewController : picker animated: YES];
    
    if ([myPlayer playbackState] == MPMusicPlaybackStatePlaying) {
        
        //[[self webView] stringByEvaluatingJavaScriptFromString:@"songPlaying()"];
        
    } else {
        
       //[[self webView] stringByEvaluatingJavaScriptFromString:@"songOver()"];
        
    }
    
    //Ends Show Media Picker
    
}

//Updates playlist queue when user selects a song and hides the media picker

- (void) mediaPicker: (MPMediaPickerController *) mediaPicker didPickMediaItems: (MPMediaItemCollection *) collection {
    
    externalAudioPlayer = 0;
    [self updatePlayerQueueWithMediaCollection: collection];
    
    [[self viewController] dismissModalViewControllerAnimated: YES];
    
    // get total playback time
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    int totalMinutes = 0;
    int totalSeconds = 0;
    int length = [collection count];
    NSLog(@"Length is %d", length);

    for (int i = 0; i < length; i++){
        MPMediaItem *currentItem = collection.items[i];
        NSNumber *value=[currentItem valueForProperty:MPMediaItemPropertyPlaybackDuration];
        NSInteger totalPlaybackTime = [value integerValue];
        //long totalPlaybackTime = [[[myPlayer nowPlayingItem] valueForProperty: @"playbackDuration"] longValue];
        int tHours = (totalPlaybackTime / 3600);
        int tMins = ((totalPlaybackTime/60) - tHours*60);
        int tSecs = (totalPlaybackTime % 60 );
        totalMinutes += tMins;
        totalSeconds += tSecs;
    }

    NSLog(@"Total is %d", totalMinutes);
    
    //Tell the app that the song has been selected
    
//    [[self webView] stringByEvaluatingJavaScriptFromString:@"songSelected()"];
    [self.webView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"songSelected('%d')",totalMinutes]];
    
//    NSString *durationSet = [self.webView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"getDuration('%@')"]];
//    
//    NSLog(@"Duration set is %d", durationSet);
    
}

//Plays the song from the beginning once the media picker is hidden

- (void) updatePlayerQueueWithMediaCollection: (MPMediaItemCollection *) mediaItemCollection {
    
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    
    [myPlayer setQueueWithItemCollection: mediaItemCollection];
    myPlayer.currentPlaybackTime = 0;
//    NSNumber *duration=[mediaItemCollection valueForProperty:MPMediaItemPropertyPlaybackDuration];
//    int totalPlaybackTime = [[myPlayer nowPlayingItem] valueForProperty: @"playbackDuration"];
//    NSLog(@"My duration is %id", totalPlaybackTime);
    //[myPlayer play];
    
    //Run native function
    
    //[self songPlayed:(CDVInvokedUrlCommand *)self];
}

//Handle playback state change

- (void) registerMediaPlayerNotifications
{
    
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    
    NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];
    
    [notificationCenter addObserver: self
                           selector: @selector (handle_NowPlayingItemChanged:)
                               name: MPMusicPlayerControllerNowPlayingItemDidChangeNotification
                             object: myPlayer];
    
    [notificationCenter addObserver: self
                           selector: @selector (handle_PlaybackStateChanged:)
                               name: MPMusicPlayerControllerPlaybackStateDidChangeNotification
                             object: myPlayer];
    
    [myPlayer beginGeneratingPlaybackNotifications];
    
}

//When song naturally changes tracks

int amount_of_plays = 0;

- (void) handle_NowPlayingItemChanged: (id) notification
{
    
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    
    MPMediaItem *currentItem = [myPlayer nowPlayingItem];
    NSString *songtitle = [currentItem valueForProperty:MPMediaItemPropertyTitle];
    UIImage *artworkImage = [UIImage imageNamed:@"noArtworkImage.png"];
    MPMediaItemArtwork *artwork = [currentItem valueForProperty: MPMediaItemPropertyArtwork];
    
//    long totalPlaybackTime = [[[myPlayer nowPlayingItem] valueForProperty: @"playbackDuration"] longValue];
//    int tHours = (totalPlaybackTime / 3600);
//    int tMins = ((totalPlaybackTime/60) - tHours*60);
//    int tSecs = (totalPlaybackTime % 60 );
//    NSLog(@"My minutes is %d", tMins);
//    NSLog(@"My seconds is %d", tSecs);
    
    //Update mission option select playlist
    NSString *str  = @"hi ya";
    [self.webView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"update_music_options('%@')",songtitle]];
    
    //Check playback state when song changes or stops

    MPMusicPlaybackState playbackState = self.myPlayer.playbackState;
    
    //Wait for playrate back to change
    sleep(1);
    
    //Declare playback rate as a variable
    float playbackRate = [[MPMusicPlayerController iPodMusicPlayer] currentPlaybackRate];
    
    NSLog(@"%f",playbackRate);
    if([[MPMusicPlayerController iPodMusicPlayer] currentPlaybackRate] == 1){
        NSLog(@"Song is playing state change");
        [[self webView] stringByEvaluatingJavaScriptFromString:@"songPlaying()"];
        amount_of_plays++;
        if (amount_of_plays>2){
            NSLog(@"played more than twice");
        }
    }
    else{
        NSLog(@"Song has stopped state change");
        [[self webView] stringByEvaluatingJavaScriptFromString:@"songOver()"];
    }
    
}


// When the playback state changes at all

- (void)handle_PlaybackStateChanged:(id)notification {
//    
//    sleep(5);
//    
//    MPMusicPlaybackState playbackState = self.myPlayer.playbackState;
//   if (playbackState == MPMusicPlaybackStatePaused || playbackState == MPMusicPlaybackStateStopped) {
//        //[self.playPauseButton setTitle:@"Play" forState:UIControlStateNormal];
//        NSLog(@"Song has stopped state change playback state");
//        [[self webView] stringByEvaluatingJavaScriptFromString:@"songOver()"];
//      
//    }
//    else if (playbackState == MPMusicPlaybackStatePlaying) {
//        //[self.playPauseButton setTitle:@"Pause" forState:UIControlStateNormal];
//        NSLog(@"Song playing state change playback state");
//        [[self webView] stringByEvaluatingJavaScriptFromString:@"songPlaying()"];
//    }
}

//Additional plugin calls from JavaScript

//Check music play state upon load

- (void)registerNotifications:(CDVInvokedUrlCommand*)command
{

    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin 2:)"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    [self registerMediaPlayerNotifications];
    
    NSLog(@"notifications registered");

}


//Additional plugin calls from JavaScript

//- (void)songPlayed:(CDVInvokedUrlCommand*)command
//{
//    
//    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin 2:)"];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//    
//    NSLog(@"song played");
//    
//}

//Additional plugin calls from JavaScript

//Stop song

- (void)stopMusic:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin 2:)"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    
    if (externalAudioPlayer == 1){
        [self.theAudio stop];
    } else{
        [myPlayer stop];
    }

}

//Play song

- (void)playMusic:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin 2:)"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
 
    if (externalAudioPlayer == 1){
        [self.theAudio play];
    } else{
        [myPlayer play];
    }

}

//Pause song

- (void)pauseMusic:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin 2:)"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    
    if (externalAudioPlayer == 1){
        [self.theAudio pause];
    } else{
        [myPlayer pause];
    }
//    if (externalAudioPlayer == 1){
//        [myPlayer pause];
//    }

}

//Skip to next song

- (void)skipToNextItem:(CDVInvokedUrlCommand*)command{
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin 2:)"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    
    [myPlayer skipToNextItem];
    
}

//Skip to previous song

- (void)skipToPreviousItem:(CDVInvokedUrlCommand*)command{
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin 2:)"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    
    [myPlayer skipToPreviousItem];
    
} 

//Additional plugin calls from JavaScript

//Start mission

- (void)startMission:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin 2:)"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

//    MPMusicPlayerController* myPlayer =
//    [MPMusicPlayerController iPodMusicPlayer];
//    
//    [myPlayer stop];
}

//Responds to the user tapping done having chosen no music

- (void) mediaPickerDidCancel: (MPMediaPickerController *) mediaPicker
{
    
	[[self viewController] dismissModalViewControllerAnimated: YES];
    
	[[UIApplication sharedApplication] setStatusBarStyle: UIStatusBarStyleBlackOpaque animated:YES];
    
    [self.webView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"no_songs_selected('%d')"]];
    
    [self prepareExternalAudio];
    
    externalAudioPlayer = 1;
}

- (void) prepareExternalAudio
{
    NSString *soundPath =[[NSBundle mainBundle] pathForResource:@"burntheclock" ofType:@"mp3"];
    NSURL *soundURL = [NSURL fileURLWithPath:soundPath];
    NSError *error;
    
    _theAudio = [[AVAudioPlayer alloc] initWithContentsOfURL:soundURL error:&error];
    [self.theAudio setDelegate:self];
    [self.theAudio setNumberOfLoops:-1];
    
    [self.theAudio prepareToPlay];
}

- (void) playExternalAudio:(CDVInvokedUrlCommand*)command
{
    [self.theAudio play];
}

- (void) pauseExternalAudio:(CDVInvokedUrlCommand*)command
{
    [self.theAudio pause];
}

- (void) stopExternalAudio:(CDVInvokedUrlCommand*)command
{
    [self.theAudio stop];
}

//Additional sounds during missions

//Stop all other sounds
- (void) stopAudioPlayer:(CDVInvokedUrlCommand*)command
{
    [audioPlayer stop];
}

//Music fade out
- (void) musicFadeOut:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin 2:)"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    
    int64_t delay = 2LL * NSEC_PER_SEC;
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,delay), dispatch_get_current_queue(), ^{
        while (myPlayer.volume>.1){
            myPlayer.volume -= .1;
            [NSThread sleepForTimeInterval:0.1];
        }
    });

}

//Music fade in
- (void) musicFadeIn:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin 2:)"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    
    int64_t delay = 2LL * NSEC_PER_SEC;
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,delay), dispatch_get_current_queue(), ^{
        while (myPlayer.volume<.1){
            myPlayer.volume += .1;
            [NSThread sleepForTimeInterval:0.1];
        }
    });
    
}

//Sound positive
- (void) soundPositive:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin 2:)"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
 
    NSURL *url = [NSURL fileURLWithPath:[NSString stringWithFormat:@"%@/missionComplete.mp3", [[NSBundle mainBundle] resourcePath]]];
	
	NSError *error;
	audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:url error:&error];
	audioPlayer.numberOfLoops = 0;
	
	if (audioPlayer == nil)
		NSLog([error description]);
	else
        audioPlayer.delegate = self;
		[audioPlayer play];

}

//Sound negative
- (void) soundNegative:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin 2:)"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    NSURL *url = [NSURL fileURLWithPath:[NSString stringWithFormat:@"%@/missionFailed.mp3", [[NSBundle mainBundle] resourcePath]]];
	
	NSError *error;
	audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:url error:&error];
	audioPlayer.numberOfLoops = 0;
	
	if (audioPlayer == nil)
		NSLog([error description]);
	else
        audioPlayer.delegate = self;
    
    [audioPlayer play];
}

//Play sound

int missionFailed = 0;

- (void) playSound:(CDVInvokedUrlCommand*)command
{
    NSArray* list = command.arguments;
    NSString *name = list[0];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin 2:)"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

    NSString *str = @"%@/";
    str = [str stringByAppendingString:name];
    str = [str stringByAppendingString:@".mp3"];
    NSLog(@"Your name is %@", str);
    NSURL *url = [NSURL fileURLWithPath:[NSString stringWithFormat:str, [[NSBundle mainBundle] resourcePath]]];
    
    NSError *error;
    audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:url error:&error];
    audioPlayer.numberOfLoops = 0;
    
    if (audioPlayer == nil)
        NSLog([error description]);
    else
        audioPlayer.delegate = self;
    //[audioPlayer play];
    
    if ([name isEqualToString:@"missionFailed"])
    {
        [audioPlayer play];
        [myPlayer stop];
        missionFailed = 1;
    } else{
        missionFailed = 0;
        [audioPlayer play];

    }
    
}

//Sound effect finished
-(void)audioPlayerDidFinishPlaying:
(AVAudioPlayer *)audioPlayer successfully:(BOOL)flag
{
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    
    if (missionFailed == 0){
        if (externalAudioPlayer == 1){
            [self.theAudio play];
        } else{
            [myPlayer play];
        }
    }

    NSLog(@"audio finished");
}

AVSpeechSynthesizer *synthesizer; //property
AVSpeechUtterance *utterance;  //declared as propert

//text to speech
-(void) speak:(CDVInvokedUrlCommand*)command
{
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    
    if (externalAudioPlayer == 1){
        [self.theAudio pause];
    } else{
        [myPlayer pause];
    }
    
//    if (externalAudioPlayer == 1){
//        [myPlayer pause];
//    } else{
//        [self pauseExternalAudio:NULL];
//    }
    
    NSArray* list = command.arguments;
    NSString *text = list[0];
    NSString *str = @"/";
    str = [str stringByAppendingString:text];
    synthesizer = [[AVSpeechSynthesizer alloc] init];
    synthesizer.delegate = self;
    utterance = [[AVSpeechUtterance alloc] initWithString:str];
    [synthesizer speakUtterance:utterance];
}

- (void)speechSynthesizer:(AVSpeechSynthesizer *)synthesizer didFinishSpeechUtterance:(AVSpeechUtterance *)utterance
{
    NSLog(@"speaking finished");
    MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    if (externalAudioPlayer == 1){
        [self.theAudio play];
    } else{
        [myPlayer play];
    }
    
    //[self playExternalAudio:NULL];
    //NSLog(@"external player is is %d", externalAudioPlayer);
//    if (externalAudioPlayer == 1){
//        [myPlayer play];
//    } else{
//        [self playExternalAudio:NULL];
//    }
    
}

@end


