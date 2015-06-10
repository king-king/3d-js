/**
 * Created by WQ on 2015/6/10.
 */
(function () {

    function translate3dM( x, y, z ) {
        return [
            [1, 0, 0, x],
            [0, 1, 0, y],
            [0, 0, 1, z],
            [0, 0, 0, 1]
        ]
    }

    function perspectiveM( d ) {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, -1 / d, 1]
        ]
    }

    function rotate3dM( x, y, z, a ) {
        var cos = Math.cos, sin = Math.sin;
        a = a * Math.PI / 180;
        return [
            [1 + (1 - cos( a ))( x * x - 1 ),
                z * sin( a ) + x * y * (1 - cos( a )), -y * sin( a ) + x * z * (1 - cos( a )), 0],
            [-z * sin( a ) + x * y * (1 - cos( a )), 1 + (1 - cos( a )) * (y * y - 1), x * sin( a ) + y * z * (1 - cos( a )), 0],
            [y * sin( a ) + x * z * (1 - cos( a )), -x * sin( a ) + y * z * (1 - cos( a )), 1 + (1 - cos( a )) * (z * z - 1), 0],
            [0, 0, 0, 1]
        ]
    }

    function scale3dM( sx, sy, sz ) {
        return [
            [sx, 0, 0, 0],
            [0, sy, 0, 0],
            [0, 0, sz, 0],
            [0, 0, 0, 1]
        ]
    }

    Array.prototype.matrixStringify = function () {
        var marix = this;
        var nmatrix = [];
        for ( var c = 0; c < marix.length; c++ ) {
            nmatrix[c] = [];
            for ( var r = 0; r < marix[c].length; r++ ) {
                nmatrix[c][r] = marix[r][c];
            }
        }
        return nmatrix.join();
    };


    window._3d = {
        perspectiveM : perspectiveM,
        translate3dM : translate3dM,
        rotate3dM : rotate3dM,
        scale3dM : scale3dM
    }

})();