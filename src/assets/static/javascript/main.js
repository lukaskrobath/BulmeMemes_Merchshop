"use strict";

let countDownDate = new Date("Nov 1, 2018 00:00:00").getTime();

let x = setInterval(function(){
    let now = new Date().getTime();
    let distance = countDownDate - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

    if (distance < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "JETZT OFFEN";
    }
}, 1000);

let canvas = document.querySelector('canvas');
		canvas.width = 840;
		canvas.height = 840;
let context = canvas.getContext('2d');
let currentFrame = 0;
let circles = [];
let circleCount = 10;


function update() {

	currentFrame++;

	_projection.refZ = 400;
	_projection.fLength = 102;

	for(let i = 0; i < circles.length; i++) {
		_projection.doProjection(circles[i].shape);
		_projection.rotateY(circles[i].shape, circles[i].rotationX);
		_projection.rotateX(circles[i].shape, circles[i].rotationY);
	}

	render();
}

function render() {

	context.clearRect(0, 0, canvas.width, canvas.height);

	context.beginPath();
	context.fillStyle = 'rgba(255,255,255, 1)';
	context.lineWidth = 5;
	context.arc(
		canvas.width/2,
		canvas.height/2,
		260,
		0,
		Math.PI * 2,
		false
	);
	context.fill();

	for(let i = 0; i < circles.length; i++) {
		circles[i].render();
	}
	requestAnimationFrame(update);

}

requestAnimationFrame(update);

let Basic3DProjection = function() {

	this.projCenterX = 0;
	this.projCenterY = 0;
	this.fLength = 400;
	this.refZ = 400;

	this.getScaleFromZ = function(z) {
		if (this.fLength +z == 0) {
			return 0.001;
		} else {
			return this.refZ/(this.fLength+z);
		}
	}

	this.doProjection = function(_object) {

		let x	= _object.posX*this.getScaleFromZ(_object.posZ)+this.projCenterX;
		let y	= _object.posY*this.getScaleFromZ(_object.posZ)+this.projCenterY;
		let y0z0	= this.getScaleFromZ(0);

		_object.screenX = x;
		_object.screenY = y-y0z0;
		_object.scale = this.getScaleFromZ(_object.posZ);
		_object.pastViewPoint = _object.posZ > this.refZ;

	}

	this.rotateY = function(object, ang) {
		let _cos = Math.cos(ang);
		let _sin = Math.sin(ang);

		let tz = object.posZ * _cos - object.posX * _sin;
		let tx = object.posZ * _sin + object.posX * _cos;
		object.posX = tx;
		object.posZ = tz;
		this.doProjection(object);
	}

	this.rotateX = function(object, ang) {
		let _cos = Math.cos(ang);
		let _sin = Math.sin(ang);

		let ty = object.posY * _cos - object.posZ * _sin;
		let tz = object.posY * _sin + object.posZ * _cos;
		object.posY = ty;
		object.posZ = tz;
		this.doProjection(object);
	}

	this.rotateZ = function(object, ang) {
		let _cos = Math.cos(ang);
		let _sin = Math.sin(ang);

		let object = objects[i];
		let tx = object.posX * _cos - object.posY * _sin;
		let ty = object.posX * _sin + object.posY * _cos;
		object.posX = tx;
		object.posY = ty;
		this.doProjection(object);
	}

}

let _projection = new Basic3DProjection();
		_projection.projCenterX	= canvas.width/2;
		_projection.projCenterY	= canvas.height/2;

let Basic3DObject = function (x, y, z, size) {

	this.posX = x;
	this.posY = y;
	this.posZ = z;
	this.dispSize = size;

	this.screenX = 0;
	this.screenY = 0;

	this.scale = 1;
	this.pastViewPoint = false;

}


function createCircle() {
	this.shape = new Basic3DObject(0, 0, 68, 0);
	this.rotationX;
	this.rotationY;
	this.size;

	this.render = function() {
		context.beginPath();
		context.strokeStyle = 'rgba(182,182,182, ' + (this.shape.posZ * -1) / 60 + ')';
		context.fillStyle = 'rgba(182,182,182, ' + (this.shape.posZ * -1) / 60 + ')';
		context.lineWidth = 2 * this.size;
		context.arc(
			this.shape.screenX,
			this.shape.screenY,
			this.size * this.shape.scale,
			0,
			Math.PI * 2,
			false
		);
		if(this.fillOrStroke === 'fill') {
			context.fill();
		} else {
			context.stroke();
		}
	}
}

for(let i = 0; i < circleCount; i++) {
	let tempCircle = new createCircle();

	if(Math.random() < 0.5) {
		tempCircle.rotationX = Math.random() / 100;
	} else {
		tempCircle.rotationX = (Math.random() / 100) * -1;
	}

	if(Math.random() < 0.5) {
		tempCircle.fillOrStroke = 'fill';
	} else {
		tempCircle.fillOrStroke = 'stroke';
	}

	if(Math.random() < 0.5) {
		tempCircle.rotationY = Math.random() / 100;
	} else {
		tempCircle.rotationY = Math.random() / 100 * -1;
	}

	tempCircle.size = Math.random() * 2;

	circles.push(tempCircle);
}
