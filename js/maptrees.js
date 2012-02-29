/**
 * function for drawing the flower map
 * <code>
 * SAKURA.renderMap('#gmap-2', '#map_canvas');
 * </code>
 */
var SAKURA = {}
//XXX: global data
var div;
SAKURA.data = null;
SAKURA.renderMap = function(container, div1) {
    div = div1;
    $(container).live("pageshow", function() {

        $(div).gmap({'center': getLatLng(), 'zoom': 11, 'callback': function() {

                // TODO: get the list of trees
                $.getJSON('/data/vcbf.json', {},
                    function (data) {
                        SAKURA.data = data.images.image;
                        //XXX: a hack to show state transition
                        var boundry = Math.floor(SAKURA.data.length/2);
                        for (var i=0; i<SAKURA.data.length; i++) {
                            var t = SAKURA.data[i];
                            /**
                              2 kind of trees: 
                              - flower - /img/flowers.png
                              - tree - ???
                            */
                            if (i>boundry) {
                                t.autumn = 0;
                                t.fromMonth = 3-Math.floor(Math.random()*2);
                                t.toMonth = 6+Math.floor(Math.random()*2);
                            } else {
                                t.autumn = 1;
                                t.fromMonth = 8-Math.floor(Math.random()*2);
                                t.toMonth = 12+Math.floor(Math.random()*2);
                            }
                        }

                        SAKURA.showMonth();
                    }
                    );
            }
        });
        function getLatLng() {
            if ( google.loader.ClientLocation != null ) {
                return new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);	
            }
            // sweden!
            //return new google.maps.LatLng(59.3426606750, 18.0736160278);

            // vancouver?
            return new google.maps.LatLng(49.216666667, -123.1);
        }

        /**
         render tree. source data:
            {
                source:'http://www.vcbf.ca/images/stories/20100318_austreymchardy_akebono_cutler_dsc05535.jpg',
                locationid:1084,
                name:1084,
                icon:{
                },
                info_url:{
                },
                lon:-123.034966,
                lat:49.237988,
                desc:'Austrey Ave from McHardy to Joyce; Renfrew-Collingwood - Several big old \'Akebono\' line both sides of Austrey from McHardy to Joyce'
            },
        */
    });
};


/** show flower in the month */
SAKURA.showMonth = function(month) {

    if (month) {
        // if given month...
        /*
        $(div).gmap({'callback':function() {
                $(div).gmap('clear', 'markers');
        }});
        */
        $(div).gmap('clearMarkers');
    }
    month = (month===undefined) ? 3 : month;  // NOTE: default to april
    for (var i=0; i<SAKURA.data.length; i++) {
        var t = SAKURA.data[i];
        // TODO: render the geocode
        // TODO: render the trees
        if (t.fromMonth <= month && month <= t.toMonth) {
            SAKURA.renderTree(t);
        }

    }

};


SAKURA.renderTree = function(t) {
    // XXX: drip marker will be easy
    console.log("Rendering tree "+t.Desc + " location:" + t.Lon + "," + t.Lat );
    var ll = new google.maps.LatLng(t.Lat,t.Lon);
    $(div).gmap('addMarker', 
    {
        'icon': t.autumn ? '/images/wetland.png' : '/images/flowers.png', 
        'position': ll, 
        //'animation': google.maps.Animation.DROP, 
        'title': t.Desc
    }, function(map, marker) {
        $(div).gmap('addInfoWindow', { 
                'position':marker.getPosition(), 
                'content': "<p style='font-size: 8px'>"+t.Desc+"</p>"+"<img width='100px' src='"+t.source+"'></img>",
            }, function(iw) { 
            $(marker).click(function() { 
                    iw.open(map, marker); 
                    var pos = marker.getPosition();
                    map.panTo(pos);
                    SAKURA.renderFlickr(pos.lat(), pos.lng());
            }); 
        }); 
    });
};

/**
 * function for rendering the flickr images
 */
SAKURA.renderFlickr = function (lat, lon) {
    //TODO: search flickr for related images
    //http://www.flickr.com/services/api/flickr.photos.search.html
    $.ajax({
       url: "http://api.flickr.com/services/rest/",
       dataType: 'jsonp',
       jsonpCallback: 'jsonFlickrApi',
       data: { 
           method : "flickr.photos.search",
           'api_key' : "7061c9040394d90934aec559f690cc2c",  // sakuramap.com api key
           text : "cherry",
           lat : lat,
           lon : lon,
           has_geo : 1,
           radius: 1, //km
           perpage: 20, //limit 20
           format : 'json',
       },
       success: function (data) {
            /**
             * Example data:
            {"photos":{"page":1, "pages":3, "perpage":250, "total":"597", "photo":[
                {"id":"5740320331", "owner":"62826342@N07", "secret":"0cf2c1db17", 
                    "server":"3612", "farm":4, "title":"Over the Burrad Bridge into Kitslano", 
                    "ispublic":1, "isfriend":0, "isfamily":0}]}}
            render URL: http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
            */
            //TODO: render pages
            var div = $("#flickrimgs").empty();
            for (var i=0; i<data.photos.photo.length; i++) {
                var photo = data.photos.photo[i];
                $("<img height='100px'/>")
                    .attr('src', 'http://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'.jpg')
                    .appendTo(div);
            }
       }
    });
};

