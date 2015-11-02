/**
 * Created by WQ on 2015/11/2.
 */
function Block ( type , row , col ) {
	var el = element( "div" , {
		classList : [ "block" , type ] ,
		innerHTML : "<div class='block-inner'></div>"
	} , cubeWrapper );
	Blocks.push( el );
	css( el , {
		"margin-left" : initPos[ row ][ col ][ 0 ] + "px" ,
		"margin-top" : initPos[ row ][ col ][ 1 ] + "px"
	} );
	el.origin = initOrigin[ row ][ col ];
	/**
	 *最复杂的一点，就是给每个block附上旋转的数据以及旋转的操作
	 * 每个block只可能绕着两个轴来旋转，找出这两个点，给它附上一个独一无二的标记
	 */
	var rowDir = {} , colDir = {};
	loopObj( rotateData , function ( axis , value ) {
		if ( value.face[ type ] ) {
			if ( value.face[ type ].rowOrCol == "row" ) {
				rowDir.axis = axis;
				rowDir.posFlag = value.face[ type ].posFlag;
			} else {
				colDir.axis = axis;
				colDir.posFlag = value.face[ type ].posFlag;
			}
		}
	} );
	el[ colDir.axis ] = colDir.posFlag == 1 ? col : floorNum - 1 - col;
	el[ rowDir.axis ] = rowDir.posFlag == 1 ? row : floorNum - 1 - row;
	el.setAttribute( colDir.axis , el[ colDir.axis ] + "" );
	el.setAttribute( rowDir.axis , el[ rowDir.axis ] + "" );

	Drag( el , {
		onTap : function ( e ) {
			e.stopPropagation();
			return getBlocks( "y" , el.y );
		} ,
		onDrag : function ( dx , dy , context ) {
			/**
			 * 先做个简单的测试，只是绕着y轴转。那么需要根据y轴这个信息以及转动当前block的
			 * 的转动信息来确认能够转动的块（复数），这一步完成之后，还需要做的仅仅是确认旋
			 * 转轴
			 */
			rotateFloor( "y" , el.y , -dx , context );
		}
	} );

	return el;
}

function getBlocks ( axis , num ) {
	var blocks = [];
	// 先根据轴axis确认面是rotateData[ axis ].face
	loopObj( rotateData[ axis ].face , function ( face ) {
		loopArray( sixFaces[ face ].elements , function ( block ) {
			if ( block[ axis ] == num ) {
				blocks.push( block );
			}
		} );
	} );
	num == 0 && (blocks = blocks.concat( sixFaces[ rotateData[ axis ].bottom.face ].elements ));
	num == floorNum - 1 && (blocks = blocks.concat( sixFaces[ rotateData[ axis ].up.face ].elements ));
	return blocks;
}

function rotateFloor ( axis , num , degree , blocks ) {
	!blocks && (blocks = getBlocks( axis , num ) );
	loopArray( blocks , function ( block ) {
		block.matrix = _3d.combine( _3d.rotate3dM( Axis[ axis ][ 0 ] , Axis[ axis ][ 1 ] , Axis[ axis ][ 2 ] , degree ) , block.matrix );
		css( block , {
			"-webkit-transform" : "matrix3d(" +
			_3d.origin3d( block.matrix , block.origin[ 0 ] , block.origin[ 1 ] , block.origin[ 2 ] ).matrixStringify() + ")"
		} );
	} );
}

function initCube () {
	// 如果sixFaces里面有数据，也就是说有dom元素，则只需要重新摆放即可，否则需要生成
	loopObj( sixFaces , function ( type , face ) {
		loop( floorNum , function ( row ) {
			loop( floorNum , function ( col ) {
				var el;
				var index = col * floorNum + row;
				if ( face.elements[ index ] ) {
					el = face.elements[ index ];
					// 恢复颜色
					el.className = "block " + type;
				} else {
					face.elements[ index ] = el = Block( type , row , col );
				}
				// 摆放位置
				el.matrix = face.transform;
				css( el , {
					"-webkit-transform" : "matrix3d(" +
					_3d.origin3d( el.matrix , el.origin[ 0 ] , el.origin[ 1 ] , el.origin[ 2 ] ).matrixStringify() + ")"
				} );
			} );
		} )
	} );
}

function drawAxis () {
	gc.clearRect( 0 , 0 , 600 , 600 );
	gc.beginPath();
	gc.moveTo( 300 , 300 );
	gc.lineTo( -Axis.y[ 0 ] * 100 + 300 , -Axis.y[ 1 ] * 100 + 300 );
	gc.moveTo( 300 , 300 );
	gc.lineTo( -Axis.x[ 0 ] * 100 + 300 , -Axis.x[ 1 ] * 100 + 300 );
	gc.moveTo( 300 , 300 );
	gc.lineTo( -Axis.z[ 0 ] * 100 + 300 , -Axis.z[ 1 ] * 100 + 300 );
	gc.stroke();
}

function rotateCube ( t_matrix ) {
	// x轴和y轴z轴
	Axis.y = _3d.mul( Axis.y , t_matrix );
	Axis.x = _3d.mul( Axis.x , t_matrix );
	Axis.z = _3d.mul( Axis.z , t_matrix );
	//drawAxis();
	loopArray( Blocks , function ( block ) {
		block.matrix = _3d.combine( t_matrix , block.matrix );
		block.style.transform = "matrix3d(" + _3d.origin3d( block.matrix , block.origin[ 0 ] , block.origin[ 1 ] , block.origin[ 2 ] ).matrixStringify() + ")";
	} );
}