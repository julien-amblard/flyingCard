var Card = function( obj, settings ){

	this.card = {
		o : obj,
		rX : 0,
		rY : 0,
		tX : 0,
		tY : 0,
		scale : 1
	};
	this.mouse = {
		cx : 0, //x click position
		cy : 0, //y click position
		x : ( document.body.offsetWidth / 2 ) - ( obj.offsetWidth / 2 ), //x position
		y : ( document.body.offsetHeight / 2 ) - ( obj.offsetHeight / 2 ), //y position
		py : 0, //previous y position
		px : 0, //previous x position
		vx : 0, //x velocity
		vy : 0,  //y velocity,
		timer : null, // timer to detect stop moving
		moving : false //is moving
 	};

 	this.speed = ( settings && settings.speed )? settings.speed : 6;
 	this.offSpeed = ( settings && settings.offSpeed )? settings.offSpeed : 5;
 	this.limit =  ( settings && settings.rotateLimit )? settings.rotateLimit : 60;
	this.sensibility = ( settings && settings.sensibility )? settings.sensibility : 6;
	this.scaling = ( settings && settings.scaling )? settings.scaling : false;
	this.focus = false;
	this.init();

}



Card.prototype.init = function()
{	
	this.bindClick();

	this.card.x = this.mouse.x - ( this.card.o.offsetWidth / 2 );
	this.card.y = this.mouse.y - ( this.card.o.offsetHeight / 2 );

	this.start();

};


Card.prototype.bindClick = function()
{

	this.bindmove = this.bindMove.bind( this );
	this.card.o.addEventListener('mousedown', this.bindmove );

};



Card.prototype.bindMove = function()
{

	this.mouse.cx = event.layerX;
	this.mouse.cy = event.layerY;

	this.move = this.getMouseVars.bind( this );
	document.body.addEventListener('mousemove', this.move );
	this.stop = this.unbindMove.bind( this );
	document.body.addEventListener('mouseup', this.stop );

	this.focus = true;

};

Card.prototype.unbindMove = function()
{
	
	document.body.removeEventListener('mousemove', this.move);
	document.body.removeEventListener('mouseup', this.stop);

	this.focus = false;
	this.card.tX = 0;
	this.card.tY = 0;

};


Card.prototype.getMouseVars = function()
{

	this.mouse.moving 		= true;
	this.mouse.py 			= this.mouse.y; 
	this.mouse.px 			= this.mouse.x; 
	this.mouse.y 			= event.pageY; 
	this.mouse.x 			= event.pageX; 
	this.mouse.vx 			= this.mouse.x - this.mouse.px; 
	this.mouse.vy 			= this.mouse.y - this.mouse.py;

	this.mstop = this.mouseStop.bind(this);
	clearTimeout( this.mouse.timer );
    this.mouse.timer = setTimeout( this.mstop , 10);

};

Card.prototype.mouseStop = function()
{

	this.mouse.moving 		= false;
	this.mouse.vx 			= 0; 
	this.mouse.vy 			= 0;

};

Card.prototype.getRotation = function()
{

	this.card.tX = this.mouse.vx * this.sensibility;
	this.card.tY = this.mouse.vy * this.sensibility;


	if( this.card.tX > this.limit )
		this.card.tX = this.limit;
	else if ( this.card.tX < -this.limit )
		this.card.tX = -this.limit;

	if( this.card.tY > this.limit )
		this.card.tY = this.limit;
	else if ( this.card.tY < -this.limit )
		this.card.tY = -this.limit;

	this.card.x = this.mouse.x - this.mouse.cx;
	this.card.y = this.mouse.y - this.mouse.cy;

};

Card.prototype.updateRotation = function()
{

	var speed = ( this.mouse.moving ) ? this.speed : this.offSpeed;

	if( this.card.rX > ( this.card.tX + speed ) || this.card.rX < ( this.card.tX - speed ) )
		this.card.rX += ( this.card.rX > this.card.tX ) ? -speed : speed;
	else if( this.card.rX > ( this.card.tX + (speed/10) ) || this.card.rX < ( this.card.tX - (speed/10) ) )
		this.card.rX += ( this.card.rX > this.card.tX ) ? -(speed/10) : (speed/10);
	
	if( this.card.rY > ( this.card.tY + speed ) || this.card.rY < ( this.card.tY - speed ) )
		this.card.rY += ( this.card.rY > this.card.tY ) ? -speed : speed;
	else if( this.card.rY > ( this.card.tY + (speed/10) ) || this.card.rY < ( this.card.tY - (speed/10) ) )
		this.card.rY += ( this.card.rY > this.card.tY ) ? -(speed/10) : (speed/10);

};

Card.prototype.updateScale = function()
{

	if( this.focus && this.card.scale < 1.1 ){
		this.card.scale += 0.03;
	}else if( !this.focus && this.card.scale > 1 ){
		this.card.scale -= 0.03;
	}

};

Card.prototype.update = function() {

	if( this.scaling )	
		this.updateScale();

	this.getRotation();

	this.updateRotation();
	
};


Card.prototype.draw = function() {

	this.card.left = "left: " + this.card.x + "px; ";
	this.card.top = "top: " + this.card.y + "px; ";
	this.card.transform = "transform: ";
	this.card.transform += "rotateY(" + this.card.rX + "deg) ";
	this.card.transform += "rotateX(" + -this.card.rY + "deg) ";

	if( this.scaling )	
		this.card.transform += "scale(" + this.card.scale + ");";
	
	this.card.o.setAttribute('style', this.card.left + this.card.top + this.card.transform );

};

Card.prototype.start = function()
{

	this.running = true;
	this.run();

}
Card.prototype.stop = function()
{

	this.running = false;

};

Card.prototype.run = function()
{
	this.update();
	this.draw();
	loop = this.run.bind( this );
	if( this.running )
		requestAnimationFrame( loop );
}