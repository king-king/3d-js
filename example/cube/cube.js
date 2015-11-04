/**
 * Created by WQ on 2015/11/2.
 */
function Block( type , row , col ) {
    var el = element( "div" , {
        classList : [ "block" , type ] ,
        innerHTML : "<div class='block-inner'></div>" ,
        type : type
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
            el.currentDegree = 0;
        } ,
        onStart : function ( dx , dy ) {
            // 在这里判断到底是围绕哪个轴旋转
            var col = Axis[ colDir.axis ] , row = Axis[ rowDir.axis ];
            el.currentAxis = Math.abs( col[ 0 ] * dx + col[ 1 ] * dy ) < Math.abs( row[ 0 ] * dx + row[ 1 ] * dy ) ? colDir.axis : rowDir.axis;
            // 先找缓存，如果缓存没有则getBlocks
            !blocksCache[ el.currentAxis ][ el[ el.currentAxis ] ] && ( blocksCache[ el.currentAxis ][ el[ el.currentAxis ] ] = getBlocks( el.currentAxis , el[ el.currentAxis ] ) );
        } ,
        onDrag : function ( dx , dy , sx , sy ) {
            var degree = -sx * Axis[ el.currentAxis ][ 1 ] + sy * Axis[ el.currentAxis ][ 0 ];
            el.currentDegree = degree;
            rotateFloor( el.currentAxis , el[ el.currentAxis ] , degree , blocksCache[ el.currentAxis ][ el[ el.currentAxis ] ] , true );
        } ,
        onUp : function () {
            var toDegree , rotateNum;// rotateNum表示将要旋转的90度的倍数
            if ( Math.abs( el.currentDegree % 90 ) < 10 ) {
                // 如果旋转的角度太小，则恢复到原位置，也就是0
                rotateNum = el.currentDegree < 0 ? Math.ceil( el.currentDegree / 90 ) : Math.floor( el.currentDegree / 90 );
            } else {
                rotateNum = el.currentDegree < 0 ? Math.floor( el.currentDegree / 90 ) : Math.ceil( el.currentDegree / 90 );
            }
            toDegree = rotateNum * 90;
            cubeWrapper.classList.add( "lock" );
            frameAnimate( {
                from : el.currentDegree ,
                to : toDegree ,
                duration : 100 ,
                onChange : function ( degree ) {
                    rotateFloor( el.currentAxis , el[ el.currentAxis ] , degree , blocksCache[ el.currentAxis ][ el[ el.currentAxis ] ] , true );
                } ,
                onEnd : function () {
                    cubeWrapper.classList.remove( "lock" );
                    /**
                     * 1.把位置复原
                     * 2.改变涂色
                     **/
                        // 1
                    resetPos( blocksCache[ el.currentAxis ][ el[ el.currentAxis ] ] );
                    // 2.todo 这里要进行另外一项复杂的颜色变换
                    rotateNum % 4 && setColor( el.currentAxis , el[ el.currentAxis ] , rotateNum % 4 );
                }
            } );

            //resetPos( blocksCache[ el.currentAxis ][ el[ el.currentAxis ] ] )
        }
    } );

    return el;
}

function getBlocks( axis , num ) {
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

function rotateFloor( axis , num , degree , blocks , nacc ) {
    // nacc为true的时候表示不需要累加
    !blocks && (blocks = getBlocks( axis , num ) );
    loopArray( blocks , function ( block ) {
        var matrix = _3d.combine( _3d.rotate3dM( Axis[ axis ][ 0 ] , Axis[ axis ][ 1 ] , Axis[ axis ][ 2 ] , degree ) , block.matrix );
        !nacc && (block.matrix = matrix);
        css( block , {
            "-webkit-transform" : "matrix3d(" +
            _3d.origin3d( matrix , block.origin[ 0 ] , block.origin[ 1 ] , block.origin[ 2 ] ).matrixStringify() + ")"
        } );
    } );
}

function resetPos( blocks ) {
    loopArray( blocks , function ( block ) {
        css( block , {
            "-webkit-transform" : "matrix3d(" +
            _3d.origin3d( block.matrix , block.origin[ 0 ] , block.origin[ 1 ] , block.origin[ 2 ] ).matrixStringify() + ")"
        } )
    } );
}

function initCube() {
    // 如果sixFaces里面有数据，也就是说有dom元素，则只需要重新摆放即可，否则需要生成
    loopObj( sixFaces , function ( type , face ) {
        loop( floorNum , function ( row ) {
            loop( floorNum , function ( col ) {
                var el;
                var index = row * floorNum + col;
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

function drawAxis() {
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

function rotateCube( t_matrix ) {
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

// aixs 旋转轴、floorNum旋转的层数、count是90度的倍数
function setColor( axis , num , count ) {
    // 根据旋转来染色、4个面和底或顶（如果有的话）开处理
    var ring = [];
    var types = [];
    // 获取环形数据
    loopObj( rotateData[ axis ].face , function ( type , arg ) {
        //  这个面的全部元素：sixFaces[type].elements
        var blocks = arg.rowOrCol == "col" ? getCol( type , arg.posFlag == 1 ? num : floorNum - 1 - num ) : getRow( type , arg.posFlag == 1 ? num : floorNum - 1 - num );
        arg.colorFlag == -1 && blocks.els.reverse();
        arg.colorFlag == -1 && blocks.types.reverse();
        ring[ arg.index ] = blocks.els;
        types[ arg.index ] = blocks.types;
    } );
    // todo:这里需要测试一下，不行就取负
    count < 0 && types.reverse();
    loop( Math.abs( count ) , function () {
        types.push( types.shift() );
    } );
    loopArray( ring , function ( blocks , i ) {
        // 换色
        loopArray( blocks , function ( block , j ) {
            block.type = types[ i ][ j ];
            block.className = "block " + block.type;
        } );
    } );
}

function getCol( faceType , colNum ) {
    var col = { els : [] , types : [] };
    loop( floorNum , function ( row ) {
        var block = sixFaces[ faceType ].elements[ row * floorNum + colNum ];
        col.els.push( block );
        col.types.push( block.type );
    } );
    return col;
}

function getRow( faceType , rowNum ) {
    var row = { els : [] , types : [] };
    loop( floorNum , function ( col ) {
        var block = sixFaces[ faceType ].elements[ rowNum * floorNum + col ];
        row.els.push( block );
        row.types.push( block.type );
    } );
    return row;
}
