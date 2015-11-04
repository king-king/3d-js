/**
 * Created by WQ on 2015/10/13.
 */
function loop ( count , func ) {
	for ( var i = 0 ; i < count ; i++ ) {
		func( i );
	}
}

function loopArray ( arr , func ) {
	for ( var i = 0 ; i < arr.length ; i++ ) {
		func( arr[ i ] , i );
	}
}

function loopObj ( obj , func ) {
	for ( var key in obj ) {
		func( key , obj[ key ] );
	}
}

function replaceAll ( str , oldStr , newStr ) {
	while ( str.indexOf( oldStr ) != -1 ) {
		str = str.replace( oldStr , newStr );
	}
	return str;
}

function element ( tag , arg , parent ) {
	var el = document.createElement( tag );
	for ( var key in arg ) {
		switch ( key ) {
			case "classList":
				loopArray( arg.classList , function ( klass ) {
					el.classList.add( klass );
				} );
				break;
			default :
				el[ key ] = arg[ key ];
		}
	}
	parent && parent.appendChild( el );
	return el;
}

function css ( el , styles ) {
	loopObj( styles , function ( key , value ) {
		el.style.setProperty( key , value )
	} );
}

function addEventListener ( el , type , listener , useCapture ) {
	el.addEventListener( type , listener , useCapture );
	return {
		remove : function () {
			el.removeEventListener( type , listener , useCapture );
		}
	}
}

function Drag ( el , listener ) {
	var preX , preY;
	addEventListener( el , "mousedown" , function ( de ) {
		if ( de.which == 2 ) {
			return;
		}
		var isStart = false;
		listener.onTap && listener.onTap( de );
		preX = de.pageX;
		preY = de.pageY;
		var mHandle = addEventListener( document , "mousemove" , function ( me ) {
			if ( isStart || Math.abs( me.pageX - preX ) + Math.abs( me.pageY - preY ) > 3 ) {
				!isStart && listener.onStart && listener.onStart( me.pageX - preX , me.pageY - preY );
				isStart = true;
				listener.onDrag && listener.onDrag( me.pageX - preX , me.pageY - preY , me.pageX - de.pageX , me.pageY - de.pageY );
				preX = me.pageX;
				preY = me.pageY;
			}
		} );

		var uHandle = addEventListener( document , "mouseup" , function ( ue ) {
			isStart && listener.onUp && listener.onUp( ue.pageX - de.pageX , ue.pageY = de.pageY );
			mHandle.remove();
			uHandle.remove();
		} );
	} , false );
}


function frameAnimate ( arg ) {
	var startTime = new Date();
	var f = 50 / 3;
	var d = arg.to - arg.from;
	var percent;

	function frame () {
		var currentTime = new Date();
		if ( currentTime - startTime >= arg.duration ) {
			arg.onChange && arg.onChange( arg.to );
			arg.onEnd && arg.onEnd();
		} else {
			percent = (currentTime - startTime ) / arg.duration;
			arg.onChange && arg.onChange( arg.from + percent * d );
			setTimeout( arguments.callee , f );
		}
	}

	frame();
}
