cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/de.websector.myplugin/www/MyPlugin.js",
        "id": "de.websector.myplugin.MyPlugin",
        "clobbers": [
            "myPlugin"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.statusbar/www/statusbar.js",
        "id": "org.apache.cordova.statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "de.websector.myplugin": "0.1.0",
    "org.apache.cordova.statusbar": "0.1.8"
}
// BOTTOM OF METADATA
});