/**
 * Created by WQ on 2015/11/2.
 */
function Block( type , row , col ) {
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
                rowDir.type = axis;
                rowDir.posFlag = value.face[ type ].posFlag;
            } else {
                colDir.type = axis;
                colDir.posFlag = value.face[ type ].posFlag;
            }
        }
    } );
    el[ colDir.type ] = colDir.posFlag == 1 ? col : floorNum - 1 - col;
    el[ rowDir.type ] = rowDir.posFlag == 1 ? row : floorNum - 1 - row;
    el.setAttribute( colDir.type , el[ colDir.type ] + "" );
    el.setAttribute( rowDir.type , el[ rowDir.type ] + "" );
    return el;
}

function initCube() {
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

function rotateCube( t_matrix ) {
    // x轴和y轴
    Axis.y = _3d.mul( Axis.y , t_matrix );
    Axis.x = _3d.mul( Axis.x , t_matrix );
    Axis.z = _3d.mul( Axis.z , t_matrix );
    loopArray( Blocks , function ( block ) {
        block.matrix = _3d.combine( t_matrix , block.matrix );
        block.style.transform = "matrix3d(" + _3d.origin3d( block.matrix , block.origin[ 0 ] , block.origin[ 1 ] , block.origin[ 2 ] ).matrixStringify() + ")";
    } );
}