/**
 * function for drawing the flower map
 * <code>
 * SAKURA.renderMap('#gmap-2', '#map_canvas');
 * </code>
 */
var SAKURA = {}
SAKURA.renderMap = function(container, div) {
    $(container).live("pageshow", function() {

        $(div).gmap({'center': getLatLng(), 'zoom': 11, 'callback': function() {

                // TODO: get the list of trees
                $.getJSON('data/vcbf.json', {},
                    function (data) {
                        for (var i=0; i<data.images.image.length; i++) {
                            var t = data.images.image[i];
                            // TODO: render the geocode
                            // TODO: render the trees
                            renderTree(t);
                        }
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
        function renderTree(t) {
            // XXX: drip marker will be easy
            console.log("Rendering tree "+t.Desc + " location:" + t.Lon + "," + t.Lat );
            var ll = new google.maps.LatLng(t.Lat,t.Lon);
            $(div).gmap('addMarker', 
            {
                'icon': '/img/flowers.png', 
                'position': ll, 
                'animation': google.maps.Animation.DROP, 
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
        }
    });
}
