/*
Notes:
Implement search bar
improve opening animations
*/

// </> Convert To Fahrenheit & Toggle
var fahrIsOn = true;
var tempVal;
var highVal;
var lowVal;
var windVal;
function toggle() {
	fahrIsOn = !fahrIsOn;
	if (fahrIsOn === true) {
		//Turns To Fahrenheit
		document.getElementById("C-F").innerHTML = "Cels ";
		document.getElementById("temp").innerHTML = CF(tempVal, fahrIsOn);
		document.getElementById("high").innerHTML = CF(highVal, fahrIsOn);
		document.getElementById("low").innerHTML = CF(lowVal, fahrIsOn);
	} else {
		//Turns To Celsius
		document.getElementById("C-F").innerHTML = "Fahr ";
		document.getElementById("temp").innerHTML = CF(tempVal, fahrIsOn);
		document.getElementById("high").innerHTML = CF(highVal, fahrIsOn);
		document.getElementById("low").innerHTML = CF(lowVal, fahrIsOn);
	}
}
function CF(temp, toF) {
	if (toF === true) {
		return Math.round(temp * 1.8 + 32) + "F";
	} else {
		return Math.round(temp) + "C";
	}
}

// </> Icons
var icons = {
	"clear-day": '<i class="wi wi-day-sunny"></i>',
	"clear-night": '<i class="wi wi-night-clear"></i>',
	rain: '<i class="wi wi-raindrops"></i>',
	snow: '<i class="wi wi-snowflake-cold"></i>',
	sleet: '<i class="wi wi-sleet"></i>',
	wind: '<i class="wi wi-strong-wind"></i>',
	fog: '<i class="wi wi-fog"></i>',
	cloudy: '<i class="wi wi-cloudy"></i>',
	"partly-cloudy-day": '<i class="wi wi-day-cloudy"></i>',
	"partly-cloudy-night": '<i class="wi wi-night-partly-cloudy"></i>'
};

// </> Function taking lat and long output weather info
function gpsW(lati, long) {
	// Google Reverse Geocoding
	function revGeo(a, b) {
		$.ajax({
			url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
				a +
				"," +
				b +
				"&key=AIzaSyBaqMJdkuOQ_8LVjJ6iLR393y-Av3anpyc",
			data: { result_type: "locality" },
			success: function(data) {
				var cityName = data.results[0].formatted_address;
				document.getElementById("locationName").innerHTML = cityName;
				console.log(cityName);
			}
		});
	}
	// DarkSky API
	function darkSky(x, y) {
		$.ajax({
			dataType: "jsonp",
			type: "GET",
			url: "https://api.darksky.net/forecast/357192f319bab866a1137185c69596cb/" +
				x +
				"," +
				y,
			data: {
				exclude: "hourly, minutely, flags, alerts",
				units: "si"
			},
			success: function(result) {
				console.log(result);
				$("#error").hide(750);
				$("#weather-div").fadeIn(2500);
				$("#temp-chng").show(750);
				$('#head-margin').hide(1500);
				var current = result.currently;
				tempVal = current.temperature;
				highVal = result.daily.data[0].temperatureMax;
				lowVal = result.daily.data[0].temperatureMin;
				// console.log(result.currently);
				// console.log(result.daily.data[0]);
				document.getElementById("temp").innerHTML = CF(current.temperature, fahrIsOn);
				document.getElementById("high").innerHTML = CF(result.daily.data[0].temperatureMax, fahrIsOn);
				document.getElementById("low").innerHTML = CF(result.daily.data[0].temperatureMin, fahrIsOn);
				document.getElementById('icon-name').innerHTML = current.icon;
				document.getElementById("icon").innerHTML = icons[current.icon];
				document.getElementById('wind-speed').innerHTML = current.windSpeed + ' m/s'; // call function
			}
		});
	}
	// GPS request
	if (lati === undefined || long === undefined) {
		navigator.geolocation.getCurrentPosition(
			function(x) {
				lati = x.coords.latitude;
				long = x.coords.longitude;
				// console.log(lati, long);
				darkSky(lati, long);
				revGeo(lati, long);
			},
			function(error) {
				/*$.ajax({  //ip based location tracking
					dataType: "json",
					type: "GET",
					url: "http://ip-api.com/json",
					data: {},
					success: function(ip) {
						lati = ip.lat;
						long = ip.lon;
						console.log(ip);
						darkSky(lati, long);
						revGeo(lati, long);
					}
				});*/
				$("#error").show(1000); //show error in header
			}
		);
	} else {
		// console.log(lati, long);
		darkSky(lati, long);
		revGeo(lati, long);
	}
}