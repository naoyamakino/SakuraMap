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

                // XXX: drip marker will be easy
                $(div).gmap('addMarker', 
                
                
                {
                    'icon': '/img/flowers.png', 
                    'position': getLatLng(), 'animation': google.maps.Animation.DROP, 'title': 'Hello world!'}, function(map, marker) {
                    $(div).gmap('addInfoWindow', { 'position':marker.getPosition(), 'content': 'Hello world!' }, function(iw) { 
                        $(marker).click(function() { 
                                iw.open(map, marker); 
                                map.panTo(marker.getPosition());
                                //console.log("Callback"); 
                                //map.setCenter(marker.getPosition(), 13);
                        }); 
                    }); 
                });
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
    });
}
