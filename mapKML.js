function loadScript(src, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (callback) script.onload = callback;
    document.getElementsByTagName("head")[0].appendChild(script);
    script.src = src;
}


loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBxCk8N_naq7zF-bgPQvvyE_RtSM5aAG2o&libraries=places&callback=initMap')


function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        maxZoom: 14,
        center: {
            lat: 39.69,
            lng: -75.56
        }
    });

    //    var kmlLayer = new google.maps.KmlLayer({
    //        url: 'https://raw.githubusercontent.com/KevinJMC/Run4SchoolBoardDE/working/Run4SchoolBoardDE.kml',
    //        map: map
    //    });
    
    var layer = new google.maps.FusionTablesLayer({
        map: map,
        heatmap: {
            enabled: false
        },
        query: {
            select: "geometry",
            from: "1EU4BUi6nlpVY8588FQLXxmBAfG1VVvzmDJbuWwfR",
            where: ""
        },
        options: {
            styleId: 2,
            templateId: 2
        }
    });
    layer.setMap(map);

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];

    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });


    google.maps.event.addListener(layer, 'click', function (event) {
        console.log(event);
        var text = event.row.name.value;
        showInContentWindow(text);
    });

    function showInContentWindow(text) {
        var sidediv = document.getElementById('zoneDisplay');
        sidediv.innerHTML = text;
    };
}
