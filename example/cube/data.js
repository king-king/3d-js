/**
 * Created by WQ on 2015/11/2.
 */

// api
var querySelector = document.querySelector.bind( document );

// dom
var cubeWrapper = querySelector( ".cube-wrapper" );

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

var rotateData = {
    y : {
        'face' : {
            front : {
                rowOrCol : "row" ,
                posFlag : 1
            } ,
            right : {
                rowOrCol : "row" ,
                posFlag : 1
            } ,
            back : {
                rowOrCol : "row" ,
                posFlag : 1
            } ,
            left : {
                rowOrCol : "row" ,
                posFlag : 1
            }
        } ,
        'up' : { 'face' : 'bottom' , 'rotateDegree' : 0 } ,
        'bottom' : { 'face' : 'up' , 'rotateDegree' : 2 }
    } ,
    x : {
        'face' : {
            up : {
                rowOrCol : "col" ,
                posFlag : 1
            } ,
            back : {
                rowOrCol : "col" ,
                posFlag : -1
            } ,
            bottom : {
                rowOrCol : "col" ,
                posFlag : 1
            } ,
            front : {
                rowOrCol : "col" ,
                posFlag : 1
            }
        } ,
        'up' : { 'face' : 'right' , 'rotateDegree' : 0 } ,
        'bottom' : { 'face' : 'left' , 'rotateDegree' : 0 }
    } ,
    z : {
        'face' : {
            up : {
                rowOrCol : "row" ,
                posFlag : 1
            } ,
            right : {
                rowOrCol : "col" ,
                posFlag : -1
            } ,
            bottom : {
                rowOrCol : "row" ,
                posFlag : -1
            } ,
            left : {
                rowOrCol : "col" ,
                posFlag : 1
            }
        } ,
        'up' : { 'face' : 'front' , 'rotateDegree' : 0 } ,
        'bottom' : { 'face' : 'back' , 'rotateDegree' : 0 }
    }
};