//#import <Cordova/CDV.h>

//@interface MyPlugin : CDVPlugin

//- (void)sayHello:(CDVInvokedUrlCommand*)command;

//@end

//#import <Foundation/Foundation.h>
//#import <Cordova/CDV.h>
//
//@interface MyPlugin : CDVPlugin
//
//- (void)sayHello:(CDVInvokedUrlCommand*)command;

//@end

#import <UIKit/UIKit.h>
#import <MediaPlayer/MediaPlayer.h>
#import <Foundation/Foundation.h>
#import "CDV.h"
#import "HelloPhoneGapAppDelegate.h"
#import <AVFoundation/AVFoundation.h>

@interface MyPlugin : CDVPlugin{

NSString * successCallback;
NSString * failureCallback;

MPMediaItemCollection * selectedSong;
    
}

@property (nonatomic, retain) NSString * successCallback;
@property (nonatomic, retain) NSString * failureCallback;
@property (nonatomic, retain) MPMusicPlayerController *myPlayer;
@property (strong, nonatomic) AVSpeechSynthesizer *synthesizer;
@property (strong, nonatomic) AVAudioPlayer * theAudio;
//@property (nonatomic, retain) MPMediaItemCollection * selectedSong;

@property (nonatomic, retain) MPMusicPlayerController *musicPlayer;

@property (strong, nonatomic) AVAudioPlayer *audioPlayer;
@property (strong, nonatomic) IBOutlet UISlider *volumeControl;
- (IBAction)adjustVolume:(id)sender;
- (IBAction)playAudio:(id)sender;
- (IBAction)stopAudio:(id)sender;

- (void) registerMediaPlayerNotifications;

- (void)sayHello:(CDVInvokedUrlCommand*)command;
- (void)stopMusic:(CDVInvokedUrlCommand*)command;
- (void)playMusic:(CDVInvokedUrlCommand*)command;
- (void)songPlayed:(CDVInvokedUrlCommand*)command;

- (void) selectSong:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) playSong:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) showMediaPicker;
- (void) updatePlayerQueueWithMediaCollection: (MPMediaItemCollection *) mediaItemCollection;
- (void) mediaPicker: (MPMediaPickerController *) mediaPicker didPickMediaItems: (MPMediaItemCollection *) collection;
- (void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag;

@end


