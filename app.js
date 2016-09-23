var express = require("express");
var app = express();




app.all("/", function (req, res){
	res.end("hello donglegend!");
})

app.use(express.static('./'));

app.listen(8888, function (req, res){
	console.log("server is running at: 8888")
})