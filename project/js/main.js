console.log("linked!")

var canvas = document.getElementById("myCanvas");
var ctx = gameCanvas.getContext("2d");

ctx.beginPath();
ctx.rect(20, 40, 50, 50);
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();