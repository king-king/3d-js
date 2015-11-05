/**
 * Created by WQ on 2015/11/2.
 */

// api
var querySelector = document.querySelector.bind( document );

// dom
var cubeWrapper = querySelector( ".cube-wrapper" );
var canvas = document.querySelector( "canvas" );
var gc = canvas.getContext( "2d" );
gc.lineWidth = 5;
gc.strokeStyle = "black";

// 缓存或存储
// 每次转动，都要知晓要转动那些block，可以缓存起来
var blocksCache = {
    x : [] , y : [] , z : []
};

var Actions = [];

// data
var Axis = {
    x : [ 1 , 0 , 0 , 1 ] ,
    y : [ 0 , 1 , 0 , 1 ] ,
    z : [ 0 , 0 , 1 , 1 ]
};

var Blocks = [];

var initPos = [
    [ [ -150 , -150 ] , [ -50 , -150 ] , [ 50 , -150 ] ] ,
    [ [ -150 , -50 ] , [ -50 , -50 ] , [ 50 , -50 ] ] ,
    [ [ -150 , 50 ] , [ -50 , 50 ] , [ 50 , 50 ] ]
];

var initOrigin = [
    [ [ 100 , 100 , -150 ] , [ 0 , 100 , -150 ] , [ -100 , 100 , -150 ] ] ,
    [ [ 100 , 0 , -150 ] , [ 0 , 0 , -150 ] , [ -100 , 0 , -150 ] ] ,
    [ [ 100 , -100 , -150 ] , [ 0 , -100 , -150 ] , [ -100 , -100 , -150 ] ]
];

var floorNum = 3;

var sixFaces = {
    front : {
        transform : (function () {
            return _3d.eye();
        })() ,
        elements : []
    } ,
    left : {
        transform : (function () {
            return _3d.rotate3dM( 0 , 1 , 0 , 90 );
        })() ,
        elements : []
    } ,
    right : {
        transform : (function () {
            return _3d.rotate3dM( 0 , 1 , 0 , 270 );
        })() ,
        elements : []
    } ,
    back : {
        transform : (function () {
            return _3d.rotate3dM( 0 , 1 , 0 , -180 );
        })() ,
        elements : []
    } ,
    up : {
        transform : (function () {
            return _3d.rotate3dM( 1 , 0 , 0 , -90 );
        })() ,
        elements : []
    } ,
    bottom : {
        transform : (function () {
            return _3d.rotate3dM( 1 , 0 , 0 , -270 );
        })() ,
        elements : []
    }
};

var blackBoard = {
    x : {
        0 : [
            {
                origin : [ 0 , 0 , -50 ] ,
                transform : (function () {
                    return _3d.combine( _3d.translate3dM( 0 , 0 , -100 ) , _3d.rotate3dM( 0 , 1 , 0 , -90 ) );
                })()
            }
        ] ,
        1 : [
            {
                origin : [ 0 , 0 , -50 ] ,
                transform : (function () {
                    return _3d.combine( _3d.translate3dM( 0 , 0 , -100 ) , _3d.rotate3dM( 0 , 1 , 0 , -90 ) );
                })()
            } ,
            {
                origin : [ 0 , 0 , -50 ] ,
                transform : (function () {
                    return _3d.combine( _3d.translate3dM( 0 , 0 , -100 ) , _3d.rotate3dM( 0 , 1 , 0 , -270 ) );
                })()
            }
        ] ,
        2 : [
            {
                origin : [ 0 , 0 , -50 ] ,
                transform : (function () {
                    return _3d.combine( _3d.translate3dM( 0 , 0 , -100 ) , _3d.rotate3dM( 0 , 1 , 0 , -270 ) );
                })()
            }
        ]
    } ,
    y : {
        0 : [
            {
                origin : [ 0 , 0 , -50 ] ,
                transform : (function () {
                    return _3d.combine( _3d.translate3dM( 0 , 0 , -100 ) , _3d.rotate3dM( 1 , 0 , 0 , -90 ) );
                })()
            }
        ] ,
        1 : [
            {
                origin : [ 0 , 0 , -50 ] ,
                transform : (function () {
                    return _3d.combine( _3d.translate3dM( 0 , 0 , -100 ) , _3d.rotate3dM( 1 , 0 , 0 , -90 ) );
                })()
            } ,
            {
                origin : [ 0 , 0 , -50 ] ,
                transform : (function () {
                    return _3d.combine( _3d.translate3dM( 0 , 0 , -100 ) , _3d.rotate3dM( 1 , 0 , 0 , -270 ) );
                })()
            }
        ] ,
        2 : [
            {
                origin : [ 0 , 0 , -50 ] ,
                transform : (function () {
                    return _3d.combine( _3d.translate3dM( 0 , 0 , -100 ) , _3d.rotate3dM( 1 , 0 , 0 , -270 ) );
                })()
            }
        ]
    } ,
    z : {
        0 : [
            {
                origin : [ 0 , 0 , -50 ] ,
                transform : (function () {
                    return _3d.combine( _3d.translate3dM( 0 , 0 , -100 ) , _3d.rotate3dM( 1 , 0 , 0 , -180 ) );
                })()
            }
        ] ,
        1 : [
            {
                origin : [ 0 , 0 , -50 ] ,
                transform : (function () {
                    return _3d.combine( _3d.translate3dM( 0 , 0 , -100 ) , _3d.rotate3dM( 1 , 0 , 0 , -180 ) );
                })()
            } ,
            {
                origin : [ 0 , 0 , -50 ] ,
                transform : (function () {
                    return _3d.translate3dM( 0 , 0 , -100 );
                })()
            }
        ] ,
        2 : [
            {
                origin : [ 0 , 0 , -50 ] ,
                transform : (function () {
                    return _3d.translate3dM( 0 , 0 , -100 );
                })()
            }
        ]
    }
};

var rotateData = {
    y : {
        'face' : {
            front : {
                rowOrCol : "row" ,
                posFlag : 1 ,
                colorFlag : 1 ,
                index : 0
            } ,
            right : {
                rowOrCol : "row" ,
                posFlag : 1 ,
                colorFlag : 1 ,
                index : 1
            } ,
            back : {
                rowOrCol : "row" ,
                posFlag : 1 ,
                colorFlag : 1 ,
                index : 2
            } ,
            left : {
                rowOrCol : "row" ,
                posFlag : 1 ,
                colorFlag : 1 ,
                index : 3
            }
        } ,
        'up' : { 'face' : 'bottom' , 'rotateDegree' : 0 } ,
        'bottom' : { 'face' : 'up' , 'rotateDegree' : 2 }
    } ,
    x : {
        'face' : {
            up : {
                rowOrCol : "col" ,
                posFlag : 1 ,
                colorFlag : -1 ,
                index : 0
            } ,
            back : {
                rowOrCol : "col" ,
                posFlag : -1 ,
                colorFlag : 1 ,
                index : 1
            } ,
            bottom : {
                rowOrCol : "col" ,
                posFlag : 1 ,
                colorFlag : -1 ,
                index : 2
            } ,
            front : {
                rowOrCol : "col" ,
                posFlag : 1 ,
                colorFlag : -1 ,
                index : 3
            }
        } ,
        'up' : { 'face' : 'right' , 'rotateDegree' : 0 } ,
        'bottom' : { 'face' : 'left' , 'rotateDegree' : 0 }
    } ,
    z : {
        'face' : {
            up : {
                rowOrCol : "row" ,
                posFlag : 1 ,
                colorFlag : 1 ,
                index : 0
            } ,
            right : {
                rowOrCol : "col" ,
                posFlag : -1 ,
                colorFlag : 1 ,
                index : 1
            } ,
            bottom : {
                rowOrCol : "row" ,
                posFlag : -1 ,
                colorFlag : -1 ,
                index : 2
            } ,
            left : {
                rowOrCol : "col" ,
                posFlag : 1 ,
                colorFlag : -1 ,
                index : 3
            }
        } ,
        'up' : { 'face' : 'front' , 'rotateDegree' : 0 } ,
        'bottom' : { 'face' : 'back' , 'rotateDegree' : 0 }
    }
};

/**顺时针为正
 [ 1 , 2 , 3 ]
 [ 4 , 5 , 6 ]
 [ 7 , 8 , 9 ]

 [
 [[0,0],[0,1],[0,2]],
 [[1,0],[1,1],[1,2]],
 [[2,0],[2,1],[2,2]]
 ]

 ------------------------------------------
 （90  & -270）
 [ 7 , 4 , 1 ]
 [ 8 , 5 , 2 ]
 [ 9 , 6 , 3 ]

 [
 [[2,0],[1,0],[0,0]],
 [[2,1],[1,1],[0,1]],
 [[2,2],[1,2],[0,2]]
 ]

 ------------------------------------------
 （180  & -180）
 [ 9 , 8 , 7 ]
 [ 6 , 5 , 4 ]
 [ 3 , 2 , 1 ]

 [
 [[2,2],[2,1],[2,0]],
 [[1,2],[1,1],[1,0]],
 [[0,2],[0,1],[0,0]]
 ]

 ------------------------------------------

 ( 270  & -90 )
 [ 3 , 6 , 9]
 [ 2 , 5 , 8 ]
 [ 1 , 4 , 7 ]

 [
 [[0,2],[1,2],[2,2]],
 [[0,1],[1,1],[2,1]],
 [[0,0],[1,0],[2,0]]
 ]
 * */
// 原本想用程序计算二维数组的旋转问题，但是由于目前并没有做高阶魔方的打算，所以实现预计算，以数据的形式存储起来

var rotate3_3Arr = {
    1 : [
        [ [ 2 , 0 ] , [ 1 , 0 ] , [ 0 , 0 ] ] ,
        [ [ 2 , 1 ] , [ 1 , 1 ] , [ 0 , 1 ] ] ,
        [ [ 2 , 2 ] , [ 1 , 2 ] , [ 0 , 2 ] ]
    ] ,
    2 : [
        [ [ 2 , 2 ] , [ 2 , 1 ] , [ 2 , 0 ] ] ,
        [ [ 1 , 2 ] , [ 1 , 1 ] , [ 1 , 0 ] ] ,
        [ [ 0 , 2 ] , [ 0 , 1 ] , [ 0 , 0 ] ]
    ] ,
    3 : [
        [ [ 0 , 2 ] , [ 1 , 2 ] , [ 2 , 2 ] ] ,
        [ [ 0 , 1 ] , [ 1 , 1 ] , [ 2 , 1 ] ] ,
        [ [ 0 , 0 ] , [ 1 , 0 ] , [ 2 , 0 ] ]
    ]
};