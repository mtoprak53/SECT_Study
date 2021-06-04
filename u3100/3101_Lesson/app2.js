var unirest = require("unirest");

var req = unirest("GET", "https://ajayakv-rest-countries-v1.p.rapidapi.com/rest/v1/all");

req.headers({
	"x-rapidapi-key": "SIGN-UP-FOR-KEY",
	"x-rapidapi-host": "ajayakv-rest-countries-v1.p.rapidapi.com",
	"useQueryString": true
});


req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(res.body);
});
