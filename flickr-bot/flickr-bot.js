/**
 * Bot for replying to trees on where is tree
 * any flickr images tagged with "whattree" with geo info
 * we will response with the location detail
 * 
 * @author sketchytechky
 */


var http = require('http');
var tag = "whattree";
var interval = 3; // 3s

var url = ('api.flickr.com')
var flickr = http.createClient(80, url);


/**
 * listen to new images that appeared with the tag within timeline
 */
function listenAndReply(callback) {
    //http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e8e24ff321b65e61d0b7d699d1ff0692&text=cherry&has_geo=1&lat=49.237988&lon=-123.034966&radius=20&format=json&nojsoncallback=1 
    // only serach within interval
    var timestamp = Math.floor((new Date()).getTime()/1000) - interval;
    
    var requestUrl = '/services/rest/?method=flickr.photos.search&api_key=7061c9040394d90934aec559f690cc2c&tags='+tag+'&has_geo=1'
        //+'&min_upload_date='+timestamp
        +'&format=json&nojsoncallback=1';
    console.log("[START] listening to URL: "+requestUrl);
    var request = flickr.request('GET', requestUrl, 
                  {"host": "api.flickr.com"});
    request.end();
     
    request.addListener('response', function (response) {
        var body = '';
     
        response.addListener('data', function (chunk) {
            body += chunk;
        });
     
        response.addListener("end", function() {
            //console.log(body);
            var data = JSON.parse(body);
            //console.log(JSON.stringify(jsonData));
            /**
                example data format:
            {"photos":{"page":1, "pages":1, "perpage":250, "total":"1", "photo":[{"id":"6794426178", "owner":"85734830@N00", "secret":"d4a8f837d5", "server":"7202", "farm":8, "title":"ueno-sakura", "ispublic":1, "isfriend":0, "isfamily":0}]}, "stat":"ok"}
            */

            if (callback) {
                for (var i=0; i<data.photos.photo.length; i++) {
                    var photo = data.photos.photo[i];
                    callback(photo);
                }
            }
        })
    });
}

/**
 * reply to permission
 * 
 */
function reply(p) {
    // TODO: reply to flickr images
    console.log("[REPLY]"+JSON.stringify(p));

    //XXX: replace with search function
    var text="[Sakuramap.com] do you read JSON? "+JSON.stringify({
                "source": "http://www.vcbf.ca/images/stories/20100318_austreymchardy_akebono_cutler_dsc05535.jpg",
                "locationID": "1084",
                "Name": "1084",
                "Lon": "-123.034966",
                "Lat": "49.237988",
                "Desc": "Austrey Ave from McHardy to Joyce; Renfrew-Collingwood - Several big old 'Akebono' line both sides of Austrey from McHardy to Joyce"
            });

    // TODO: find closest trees, dump data
    var requestUrl = '/services/rest/?method=flickr.photos.comments.addComment&api_key=7061c9040394d90934aec559f690cc2c'
        +'&id='+p.id
        +'&comment_text'+escape(text);
    console.log("[REPLY] posting to URL: "+requestUrl);
    var request = flickr.request('GET', requestUrl, 
                  {"host": "api.flickr.com"});
    request.end();
     
    request.addListener('response', function (response) {
        var body = '';
     
        response.addListener('data', function (chunk) {
            body += chunk;
        });
     
        response.addListener("end", function() {
            console.log("[REPLY] response: "+body);
            //XXX
            console.log("[REPLY] This is obviously broken and require write auth from http://www.flickr.com/services/api/auth.oauth.html");
        })
    });

}

/**
 * Main function!
 */
listenAndReply(reply);
