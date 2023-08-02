#import "MyPlugin.h"
#import <Cordova/CDV.h>

@implementation MyPlugin

- (void)sayHello:(CDVInvokedUrlCommand*)command
{
  CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Play music"];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

   MPMusicPlayerController* myPlayer =
    [MPMusicPlayerController iPodMusicPlayer];
    
    [myPlayer play];

}

@end 