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

// XXX: from data/jcbf.json
var locations;  // defined at bottom
var url = ('api.flickr.com')
var flickr = http.createClient(80, url);

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
    // TODO: listen to images
}

function reply(p) {
    // TODO: reply to flickr images
    console.log("[REPLY]"+JSON.stringify(p));
    // TODO: find closest trees, dump data

}

/**
 * Main function!
 */
listenAndReply(reply);

locations = {
    "images": {
        "image": [
            {
                "source": "http://www.vcbf.ca/images/stories/20100318_austreymchardy_akebono_cutler_dsc05535.jpg",
                "locationID": "1084",
                "Name": "1084",
                "Lon": "-123.034966",
                "Lat": "49.237988",
                "Desc": "Austrey Ave from McHardy to Joyce; Renfrew-Collingwood - Several big old 'Akebono' line both sides of Austrey from McHardy to Joyce"
            },
            {
                "source": "http://www.vcbf.ca/images/stories/20100414_19thinverness_kanzan_cutler_p1000613.jpg",
                "locationID": "1413",
                "Name": "1413",
                "Lon": "-123.0796",
                "Lat": "49.25365",
                "Desc": "Kensington-Cedar Cottage - 'Kanzan' line both sides of 19th and Inverness "
            },
            {
                "source": "http://www.vcbf.ca/images/stories/events/class_3-06_copy_copy.jpg",
                "locationID": "1042",
                "Name": "Plein-Air Blossom Painting",
                "icon": "http://www.vcbf.ca/maps/images/painting_logo.png",
                "info_url": "http://www.vcbf.ca/events/plein-air-blossom-painting",
                "Lon": "-123.13329",
                "Lat": "49.24047",
                "Desc": "Every Saturday, from April 2nd - April 23rd, 2011 11:00am - 2:00pm VanDusen Botanical Garden"
            },
            {
                "source": "http://www.vcbf.ca/images/stories/Blossom_Jam_0131.jpg",
                "locationID": "1236",
                "Name": "Cherry Jam Downtown ",
                "icon": "http://www.vcbf.ca/maps/images/cherryjam_logo.png",
                "info_url": "http://www.vcbf.ca/events/cherry-jam-downtown",
                "Lon": "-123.11962",
                "Lat": "49.28572",
                "Desc": "Thursday, March 31, 2011 12:00pm - 1:30pm At the indoor concourse of Burrard Skytain station."
            },
            {
                "source": "http://www.vcbf.ca/images/stories/20100304_keefercarrall_akebono_cutlerdsc05320.jpg",
                "locationID": "1419",
                "Name": "1419",
                "Lon": "-123.10606",
                "Lat": "49.27906",
                "Desc": "'Akebono' at Andy Livingstone Park, Keefer and Carrall; three or four trees in an attractive setting"
            },
            {
                "source": "http://www.vcbf.ca/images/stories/20100304_keefercarrall_akebono_cutler_dsc05318r.jpg",
                "locationID": "1419",
                "Name": "1419",
                "Lon": "-123.10606",
                "Lat": "49.27906",
                "Desc": "'Akebono' at Andy Livingstone Park, Keefer and Carrall; three or four trees in an attractive setting"
            },
            {
                "source": "http://www.vcbf.ca/images/stories/20100303_planetarium_somei-yoshino_lin_3866.jpg",
                "locationID": "1334",
                "Name": "1334",
                "Lon": "-123.143799",
                "Lat": "49.275696",
                "Desc": "Vanier Park near Planetarium; Kitsilano - 'Somei-yoshino' and four Star Cherry trees at Vanier Park near Planetarium"
            },
            {
                "source": "http://www.vcbf.ca/images/stories/20100305_burrardarmory_somei-yoshino_cutler_dsc05440.jpg",
                "locationID": "1318",
                "Name": "1318",
                "Lon": "-123.145264",
                "Lat": "49.271271",
                "Desc": "Burrard, near Cornwall at the Armory in Kitsilano - one very nice 'Somei-yoshino', east side of Burrard at the Armory "
            },
            {
                "source": "http://www.vcbf.ca/images/stories/20100315_pred62_afterglow_eng_4690.jpg",
                "locationID": "1031",
                "Name": "1031",
                "Lon": "-123.097984",
                "Lat": "49.214626",
                "Desc": "Prince Edward, 61st to 62nd in Sunset - 'Afterglow' on both sides of the street"
            },
            {
                "source": "http://www.vcbf.ca/images/stories/20100419_16thOak_Shirofugen_Cutler_P1010087r.jpg",
                "locationID": "1409",
                "Name": "1409",
                "Lon": "-123.1264",
                "Lat": "49.25708",
                "Desc": "16th east of Oak - South Cambie - Several 'Shirofugen' in front of apartment building"
            }
        ]
    }
};
