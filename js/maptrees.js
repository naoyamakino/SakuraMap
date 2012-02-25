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
                $.getJSON('data/vcbf.json', {},
                    function (data) {
                        SAKURA.data = data.images.image;
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
    month = (month===null) ? 3 : month;  // NOTE: default to april
    for (var i=0; i<SAKURA.data.length; i++) {
        var t = SAKURA.data[i];
        // TODO: render the geocode
        // TODO: render the trees
        SAKURA.renderTree(t);
    }

};


SAKURA.renderTree = function(t) {
    // XXX: drip marker will be easy
    console.log("Rendering tree "+t.Desc + " location:" + t.Lon + "," + t.Lat );
    var ll = new google.maps.LatLng(t.Lat,t.Lon);
    $(div).gmap('addMarker', 
    {
        'icon': '/img/flowers.png', 
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
                    map.panTo(marker.getPosition());
            }); 
        }); 
    });
};

