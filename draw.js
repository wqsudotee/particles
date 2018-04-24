var SCREEN_WIDTH = 900;
var SCREEN_HEIGHT = 600;
var RADIUS = 110;
var RADIUS_SCALE = 1;
var RADIUS_SCALE_MIN = 1;
var RADIUS_SCALE_MAX = 1.5;
var PREV_QUANTITY = 25;
var QUANTITY = 25;
var canvas;
var context;
var particles;
var mouseX = (window.innerWidth - SCREEN_WIDTH);
var mouseY = (window.innerHeight - SCREEN_HEIGHT);
var mouseIsDown = false;

init();

function init() {
	canvas = document.getElementById( 'world' );
		context = canvas.getContext('2d');
		document.addEventListener('mousemove', documentMouseMoveHandler, false);
		document.addEventListener('keydown', keyDownHandler, false);
		document.addEventListener('mousedown', documentMouseDownHandler, false);
		document.addEventListener('mouseup', documentMouseUpHandler, false);
		canvas.addEventListener('touchstart', canvasTouchStartHandler, false);
		canvas.addEventListener('touchmove', canvasTouchMoveHandler, false);
		window.addEventListener('resize', windowResizeHandler, false);
		createParticles();
		windowResizeHandler();
		setInterval( loop, 1000 / 60 );
}

function keyDownHandler(event) {
    if (event.keyCode == 38){
	var stop = setInterval(more(), 25);
	window.onkeyup = function(){
	    clearInterval(stop);
	}
    } else if (event.keyCode == 40){
	var stop = setInterval(less(), 25);
	window.onkeyup = function(){
	    clearInterval(stop);
	}
    }
}

function more(){
    QUANTITY += 1;
}

function less(){
    QUANTITY -= 1;
}

function createParticles() {
	particles = [];
	for (var i = 0; i < QUANTITY; i++) {
		var particle = {
			position: { x: mouseX, y: mouseY },
			shift: { x: mouseX, y: mouseY },
			size: 1,
			angle: 0,
			speed: 0.01+Math.random()*0.04,
			targetSize: 1,
			fillColor: '#' + (Math.random() * 0x404040 + 0xaaaaaa | 0).toString(16),
			orbit: RADIUS*.5 + (RADIUS * .5 * Math.random())
		};
		particles.push( particle );
	}
}

function documentMouseMoveHandler(event) {
	mouseX = event.clientX - (window.innerWidth - SCREEN_WIDTH) * .5;
	mouseY = event.clientY - (window.innerHeight - SCREEN_HEIGHT) * .5;
}

function documentMouseDownHandler(event) {
	mouseIsDown = true;
}

function documentMouseUpHandler(event) {
	mouseIsDown = false;
}

function canvasTouchStartHandler(event) {
	if(event.touches.length == 1) {
		event.preventDefault();
		mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * .5;
		mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * .5;
	}
}

function canvasTouchMoveHandler(event) {
	if(event.touches.length == 1) {
		event.preventDefault();
		mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * .5;
		mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * .5;
	}
}

function windowResizeHandler() {
	canvas.width = SCREEN_WIDTH;
	canvas.height = SCREEN_HEIGHT;
	canvas.style.position = 'absolute';
	canvas.style.left = (window.innerWidth - SCREEN_WIDTH) * .5 + 'px';
	canvas.style.top = (window.innerHeight - SCREEN_HEIGHT) * .5 + 'px';
}

function loop() {
	if(QUANTITY != PREV_QUANTITY){
	    PREV_QUANTITY = QUANTITY;
	    createParticles();
	}
	if( mouseIsDown ) {
		RADIUS_SCALE += ( RADIUS_SCALE_MAX - RADIUS_SCALE ) * (0.02);
	}
	else {
		RADIUS_SCALE -= ( RADIUS_SCALE - RADIUS_SCALE_MIN ) * (0.02);
	}
	RADIUS_SCALE = Math.min( RADIUS_SCALE, RADIUS_SCALE_MAX );
	context.fillStyle = 'rgba(0,0,0,0.05)';
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	for (i = 0, len = particles.length; i < len; i++) {
		var particle = particles[i];
		var lp = { x: particle.position.x, y: particle.position.y };
		particle.angle += particle.speed;
		particle.shift.x += ( mouseX - particle.shift.x) * (particle.speed);
		particle.shift.y += ( mouseY - particle.shift.y) * (particle.speed);
		particle.position.x = particle.shift.x + Math.cos(i + particle.angle) * (particle.orbit*RADIUS_SCALE);
		particle.position.y = particle.shift.y + Math.sin(i + particle.angle) * (particle.orbit*RADIUS_SCALE);
		particle.position.x = Math.max( Math.min( particle.position.x, SCREEN_WIDTH ), 0 );
		particle.position.y = Math.max( Math.min( particle.position.y, SCREEN_HEIGHT ), 0 );
		particle.size += ( particle.targetSize - particle.size ) * 0.05;
		if( Math.round( particle.size ) == Math.round( particle.targetSize ) ) {
			particle.targetSize = 1 + Math.random() * 7;
		}
		context.beginPath();
		context.fillStyle = particle.fillColor;
		context.strokeStyle = particle.fillColor;
		context.lineWidth = particle.size;
		context.moveTo(lp.x, lp.y);
		context.lineTo(particle.position.x, particle.position.y);
		context.stroke();
		context.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
		context.fill();
	}
}
