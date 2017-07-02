var FMAP = function () {
	return {};
}();
jQuery(document).ready(function() {
    FMAP.position.init(), FMAP.design.init()
}),
FMAP = function (e, n) {
	return e.position = {
		/**
		  * @desc Initiate and obtain position
		*/
		init: function() {
		    var defaultLatLng = {latitude: 52.376501, longitude: 4.9037063 }; //new google.maps.LatLng(52.376501, 4.9037063);
			var position;
			if ("geolocation" in navigator){ //check geolocation available 
		        function success(pos) { //If succeed get position and drawmap
		            position = {latitude: pos.coords.latitude, longitude: pos.coords.longitude }; 
		            FMAP.map.drawMap( position );
		        }
		        function fail(error) { //If fail default position and drawmap
		            position = defaultLatLng;
		            FMAP.map.drawMap( position );
		        }
		        // Find the users current position.
		        navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 3000, enableHighAccuracy:true, timeout: 6000});
			} else {
				position = defaultLatLng; // No geolocation support, show default map
				FMAP.map.drawMap( position );
		    }
		},
		/**
		  * @desc get map center position
		*/
		getMapPosition: function () {
	        var map = document.getElementById('google_map').map;
	        var mapCenter = map.getCenter();
	        var LatLng = {latitude: mapCenter.lat(), longitude: mapCenter.lng() };
	        return LatLng;
		},
		/**
		  * @desc get current radius
		*/
		getRadius: function () {
			if ( n("#radius").val() < 500 ) {
				return 200;
			}
			return n("#radius").val();
		}
	}, e
}(FMAP || {}, jQuery),
FMAP = function (e, n) {
	return e.design = {
		init: function () {
			/**
			  * @desc 'search this area' button
			*/
			n("#reloadMap").click(function() { //add new markers button
				var position = e.position.getMapPosition();
				var map = document.getElementById('google_map').map;
		        var addMarkers = function (r) {
		        	for (var i = 0; i < r.length; i++) {
		        		e.map.inMarker(r[i], map);
		        	}
		        }
		        n('#showReload').addClass('hidden');
		        e.foursquare.getVenues(position, addMarkers);
            });
            /**
			  * @desc obtain radius slider
			*/
            n("#radius").on("change", function(){
            	n('#addMap').prop( "disabled", false );
            	n('.radiusNum').text( e.position.getRadius() );
            });
            /**
			  * @desc 'add markers' button
			*/
            n("#addMap").click(function(b) {
            	n(this).prop( "disabled", true );
            	n("#reloadMap").click();
            });
            /**
			  * @desc 'reset' button
			*/
            n("#resetMap").click(function() { 
            	e.map.cleanMarkers();
            	e.design.hideReload();
            	n('#addMap').prop( "disabled", false );
            });
            /**
			  * @desc delegated venue list action
			*/
			n('#venuelist').on('click', 'li', function(t){
				var markId = n(this).attr('id').replace('venue-', '');
				var mapDiv = document.getElementById('google_map');
				google.maps.event.trigger(mapDiv.markers[markId], 'click');
            })

            e.design.resizeVenuelist();
		},
		/**
		  * @desc show reload div
		*/
		showReload: function () {
			n('#showReload').removeClass('hidden');
		},
		/**
		  * @desc hide reload div
		*/
		hideReload: function () {
			n('#showReload').addClass('hidden');
		},
		/**
		  * @desc resize and add listener to window resize
		*/
		resizeVenuelist: function () {
            var h = n(window).height();
		    var w = n(window).width();
            var hLeft = h - n("#menu").parent().height() - 165;
		    n("#venues").css('height',hLeft);
		    n(window).resize(function(){
		        var h = n(window).height();
		        var w = n(window).width();
		        var hLeft = h - n("#menu").parent().height() - 165;
		        n("#venues").css('height',hLeft);
		    });
		},
		/**
		  * @desc show spinning loading div
		*/
		showLoading: function () {
			n('#loading').removeClass('hidden');
		},
		/**
		  * @desc hide spinning loading div
		*/
		hideLoading: function () {
			n('#loading').addClass('hidden');
		},
		/**
		  * @desc show spinning loading div
		  * @param string $template - template name
		  * @param obj $params - template object parameters
		*/
		render : function(template,params){
			var arr = [];
			switch(template){
				case 'venueList': //venue
					arr = [ //Params: Position in array, name
					'<li class="left clearfix" id="venue-',params.arPosition,'"><span class="venue-img pull-left"><img src="http://placehold.it/50/55C1E7/fff&text=U"/></span><div class="venue-body clearfix"><div class="header"><strong class="primary-font">',params.name,'</strong> <small class="pull-right text-muted"></div><p></p></div></li>']
				break;
			}
			return arr.join('');
		}

	}, e
}(FMAP || {}, jQuery),
FMAP = function (e, n) {
	return e.map = {
		init: function () {

		},
		/**
		  * @desc draw first map
		  * @param object LatLng - latitude and longitude
		*/
		drawMap: function(LatLng){
			window.prev_infowindow = false; //store infowindow in window
			var position = new google.maps.LatLng( LatLng.latitude, LatLng.longitude);
	        var mapDiv = document.getElementById('google_map');
	        var zoomLevel = 16;
			var	main_color = '#0085a1',
				saturation_value= -20,
				brightness_value= 5;
			var style= [ 
				{
					elementType: "labels",
					stylers: [
						{saturation: saturation_value}
					]
				},  
			    {
					featureType: "poi",
					elementType: "labels",
					stylers: [
						{visibility: "off"}
					]
				},
				{
			        featureType: 'road.highway',
			        elementType: 'labels',
			        stylers: [
			            {visibility: "off"}
			        ]
			    }, 
				{
					featureType: "road.local", 
					elementType: "labels.icon", 
					stylers: [
						{visibility: "off"} 
					] 
				},
				{
					featureType: "road.arterial", 
					elementType: "labels.icon", 
					stylers: [
						{visibility: "off"}
					] 
				},
				{
					featureType: "road",
					elementType: "geometry.stroke",
					stylers: [
						{visibility: "off"}
					]
				},
				{ 
					featureType: "transit", 
					elementType: "geometry.fill", 
					stylers: [
						{ hue: main_color },
						{ visibility: "on" }, 
						{ lightness: brightness_value }, 
						{ saturation: saturation_value }
					]
				}, 
				{
					featureType: "poi",
					elementType: "geometry.fill",
					stylers: [
						{ hue: main_color },
						{ visibility: "on" }, 
						{ lightness: brightness_value }, 
						{ saturation: saturation_value }
					]
				},
				{
					featureType: "poi.government",
					elementType: "geometry.fill",
					stylers: [
						{ hue: main_color },
						{ visibility: "on" }, 
						{ lightness: brightness_value }, 
						{ saturation: saturation_value }
					]
				},
				{
					featureType: "poi.sport_complex",
					elementType: "geometry.fill",
					stylers: [
						{ hue: main_color },
						{ visibility: "on" }, 
						{ lightness: brightness_value }, 
						{ saturation: saturation_value }
					]
				},
				{
					featureType: "poi.attraction",
					elementType: "geometry.fill",
					stylers: [
						{ hue: main_color },
						{ visibility: "on" }, 
						{ lightness: brightness_value }, 
						{ saturation: saturation_value }
					]
				},
				{
					featureType: "poi.business",
					elementType: "geometry.fill",
					stylers: [
						{ hue: main_color },
						{ visibility: "on" }, 
						{ lightness: brightness_value }, 
						{ saturation: saturation_value }
					]
				},
				{
					featureType: "transit",
					elementType: "geometry.fill",
					stylers: [
						{ hue: main_color },
						{ visibility: "on" }, 
						{ lightness: brightness_value }, 
						{ saturation: saturation_value }
					]
				},
				{
					featureType: "transit.station",
					elementType: "geometry.fill",
					stylers: [
						{ hue: main_color },
						{ visibility: "on" }, 
						{ lightness: brightness_value }, 
						{ saturation: saturation_value }
					]
				},
				{
					featureType: "landscape",
					stylers: [
						{ hue: main_color },
						{ visibility: "on" }, 
						{ lightness: brightness_value }, 
						{ saturation: saturation_value }
					]
					
				},
				{
					featureType: "road",
					elementType: "geometry.fill",
					stylers: [
						{ hue: main_color },
						{ visibility: "on" }, 
						{ lightness: brightness_value }, 
						{ saturation: saturation_value }
					]
				},
				{
					featureType: "road.highway",
					elementType: "geometry.fill",
					stylers: [
						{ hue: main_color },
						{ visibility: "on" }, 
						{ lightness: brightness_value }, 
						{ saturation: saturation_value }
					]
				}, 
				{
					featureType: "water",
					elementType: "geometry",
					stylers: [
						{ hue: main_color },
						{ visibility: "on" }, 
						{ lightness: brightness_value }, 
						{ saturation: saturation_value }
					]
				}
			];
	        var googleMapOptions = { 
	            center: position, // map center
	            zoom: zoomLevel, //zoom level, 0 = earth view to higher value
	            panControl: true, //enable pan Control
	            zoomControl: true, //enable zoom control
	            scaleControl: true, // enable scale control
	            mapTypeId: google.maps.MapTypeId.ROADMAP, // google map type
		      	mapTypeControl: false,
		      	streetViewControl: false,
		      	scrollwheel: false,
		      	styles: style,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.SMALL,
				}
	        };
	        var map = new google.maps.Map(mapDiv, googleMapOptions);    
	        mapDiv.map = map; //Obj reference for later
	        mapDiv.markers = []; //Markers array to keep track

			google.maps.event.addListener(map, 'dragend', function() {
			    e.design.showReload();
			});

	        var centerMarkers = function (r) { //callback for adding markers
	        	for (var i = 0; i < r.length; i++) {
	        		e.map.inMarker(r[i], map);
	        	}
	        }
	        e.foursquare.getVenues(LatLng, centerMarkers); //obtain venues
		},
		/**
		  * @desc add venue to list
		  * @param object venue - Venue details
		*/
		addVenue: function (venue) {
			n('#venuelist').prepend(FMAP.design.render('venueList',venue)); //render venue
		},
		/**
		  * @desc add marker to map
		  * @param object venue - Venue details
		  * @param object map - Map object
		*/
		inMarker: function (venue, map) {
			var iconBase = 'http://maps.google.com/mapfiles/kml/pal2/';
			var mapDiv = document.getElementById('google_map');
	        var icons = {
	          	dining: {
	          		icon: iconBase + 'icon55.png'
	          	},
	          	restaurant: {
	          		icon: 'icons/restaurant.png'
	          	}
	        };
	        if(!map) { //if no map defined, obtain map
	        	var map = document.getElementById('google_map').map;
	        }

			var marker = new google.maps.Marker({
	            position: new google.maps.LatLng( venue.position.latitude, venue.position.longitude),
	            map: map,
	            animation: google.maps.Animation.DROP,
	            icon: icons['restaurant'].icon,
	            title: venue.name
	        });
	        venue.arPosition = mapDiv.markers.length; //lenght of the markers array used for list actions
	        mapDiv.markers.push(marker); //add marker to array  	
	        e.map.addVenue(venue); //add marker to map

	        var contentString = n('<div class="marker-info-win">'+
	        '<div class="marker-inner-win"><span class="info-content">'+
	        '<h1 class="marker-heading">'+venue.name+'</h1>'+
	        venue.address+ 
	        '</span>'+
	        '</div></div>');
	            
	        //Create an infoWindow
	        var infowindow = new google.maps.InfoWindow({
	          	maxWidth: 250
	        });
	        infowindow.setContent(contentString[0]); //set the content of infoWindow

	        google.maps.event.addListener(marker, 'click', function() { //click event to marker, if previous infowindow open, closes it.  
	            if( window.prev_infowindow ) {
		           	window.prev_infowindow.close();
		        }
		        window.prev_infowindow = infowindow;
		        infowindow.open(map, marker);
	        });
		},
		/**
		  * @desc clean marker from map
		  * @param object map - Map object
		*/
		cleanMarkers: function (map) {
			if (!map) {
				var mapDiv = document.getElementById('google_map');
			}
		  	for (var i = 0; i < mapDiv.markers.length; i++ ) {
		    	mapDiv.markers[i].setMap(null);
		  	}
		  	mapDiv.markers.length = 0; //clean array
		  	n('#venuelist').html(''); //clean list
		}
	}, e
}(FMAP || {}, jQuery),
FMAP = function (e, n) {
	return e.foursquare = {
		init: function () {

		},
		/**
		  * @desc search if duplicated object exists in array.
		  * @param array inArr - Array to check
		  * @param string name - Name to check
		  * @param bool exists - Test
		*/
		pluckByName: function (inArr, name, exists) {
		    for (i = 0; i < inArr.length; i++ ) {
		        if (inArr[i].title == name) {
		            return (exists === true) ? true : inArr[i];
		        }
		    }
		},
		/**
		  * @desc search if duplicated object exists in array.
		  * @param obj LatLng - Latitude and longitude obj
		  * @param function callback - Callback function
		*/		
		getVenues: function(LatLng, callback){
			e.design.showLoading(); //show loading div
			var ouath = "VGQXDW32DT2GTTZ30HLIHJ51YMQPJUM10M3LI2RX4NX0RNYV";
			var mapDiv = document.getElementById('google_map'); //get map div
			var position;
	        if (LatLng) { //if no LatLng obtain from the center
	        	position = "ll=" + LatLng.latitude + "," + LatLng.longitude;
	        } else {
	        	var map = mapDiv.map.getCenter();
	        	position = "ll=" + map.lat() + "," + map.lng();                                           
	        }
	        var limit = 20; //venues limit
	        var currentRadius = e.position.getRadius(); //get radius
	        if (currentRadius>1500) {
	        	limit = 50;
	        }
	        if (currentRadius>1000 && currentRadius<=1500) {
	        	limit = 40;
	        }
	        if (currentRadius>500 && currentRadius<=1000) {
	        	limit = 30;
	        }
	        var radius = "radius="+currentRadius;
	        var url = "https://api.foursquare.com/v2/venues/explore?v=20131016&"+position+"&"+radius+"&section=food&limit="+limit+"&oauth_token="+ouath;
			this.bGet(url,function(r){
				var venues = [];
        		if (r.response.groups[0].items && r.response.groups[0].items.length > 0) {
        			for (var v = 0; v < r.response.groups[0].items.length; v++) {
        				var markerPosition = {latitude: r.response.groups[0].items[v].venue.location.lat, longitude: r.response.groups[0].items[v].venue.location.lng };
        				var venue = {
        					id: r.response.groups[0].items[v].venue.id,
        					position: markerPosition,
        					name: r.response.groups[0].items[v].venue.name,
        					address: r.response.groups[0].items[v].venue.location.formattedAddress
        				}
        				var check = e.foursquare.pluckByName(mapDiv.markers, venue.name, true); //check if duplicated
        				if (!check) {
	        				venues.push(venue); //push to response
        				}
        			}
        		}
        		e.design.hideLoading(); //hide loading div
				callback(venues); //callback with response
			});
		},
		bGet: function (action,data,callback) { //general get function
			n.get(action,data,callback,'json');
		}
	},e
}(FMAP || {}, jQuery);