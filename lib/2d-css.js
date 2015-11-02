/**
 * Created by WQ on 2015/6/11.
 */
(function () {

    function translate( x, y ) {
        return [
            [1, 0, x],
            [0, 1, y],
            [0, 0, 1]
        ]
    }

    function scale( sx, sy ) {
        return [
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, 1]
        ]
    }

    function rotate( deg ) {
        var a = deg * Math.PI / 180;
        var sina = Math.sin( a ), cosa = Math.cos( a );
        return [
            [cosa, -sina, 0],
            [sina, cosa, 0],
            [0, 0, 1]
        ]
    }

    function eye() {
        return [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]
    }

    function mul( m1, m2 ) {
        var re = [];
        for ( var r = 0; r < m1.length; r++ ) {
            re[r] = [];
            for ( var c = 0; c < m1[r].length; c++ ) {
                re[r][c] = 0;
                for ( var k = 0; k < m1.length; k++ ) {
                    re[r][c] += m1[r][k] * m2[k][c];
                }
            }
        }
        return re;
    }

    function combine() {
        var result = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
        for ( var i = 0; i < arguments.length; i++ ) {
            result = mul( result, arguments[i] );
        }
        return result;
    }

    function transform( el, matrix ) {
        el.style.setProperty( "-webkit-transform", "matrix(" + matrix[0][0] + "," + matrix[1][0] + "," + matrix[0][1] +
            "," + matrix[1][1] + "," + matrix[0][2] + "," + matrix[1][2] + ")", null );
    }

    function origin( transformation, x, y ) {
        return combine( translate( x, y ), transformation, translate( -x, -y ) );
    }

    function decompose( matrix, vector ) {
        return [
            matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
            matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
            1
        ]
    }

    window._2d = {
        eye : eye,
        rotate : rotate,
        translate : translate,
        scale : scale,
        transform : transform,
        combine : combine,
        origin : origin,
        decompose : decompose
    }

})();