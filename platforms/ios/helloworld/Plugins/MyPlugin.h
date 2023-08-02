#import <Cordova/CDV.h>
#import <MediaPlayer/MediaPlayer.h> 

@interface MyPlugin : CDVPlugin

- (void)sayHello:(CDVInvokedUrlCommand*)command;

@end