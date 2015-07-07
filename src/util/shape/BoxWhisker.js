/**
 * zrender
 *
 * @author Dick Kreisberg (github/rbkreisberg, kreisberg@dato.com)
 *
 * shape Category：BoxWhisker
 * Attributes：
   {
       // Basic Properties
       shape  : 'boxwhisker',       // required, explicitly defined
       id     : {string},       // required，unique identifier，generate with 'dato-zrender/tool/guid'
       zlevel : {number},       // default is 0, layer at which to paint on canvas
       invisible : {boolean},   // default is false

       // style attributes with default style
       style  : {
           x             : {number},  // required
           y             : {Array},   // required
       },

       // highlighting style，extends the default style when highlighted
       highlightStyle : {
           // style properties
       }

       // Interaction attributes, see shape.Base

       // Event properties, see shape.Base
   }
         Examples：
   {
       shape  : 'boxwhisker',
       id     : '123456',
       zlevel : 1,
       style  : {
           x : 200,
           y : [100,123,90,125],
           width : 150,
           color : '#eee',
           text : 'Baidu'
       },
       myName : 'bob',  // any valid custom properties

       clickable : true,
       onClick : function (eventPacket) {
           alert(eventPacket.target.myName);
       }
   }
 */

    var Base = require('dato-zrender/src/shape/Base');
    var zrUtil = require('dato-zrender/src/tool/util');

    function BoxWhisker(options) {
        Base.call(this, options);
    }

    BoxWhisker.prototype =  {
        type: 'boxwhisker',
        _numberOrder : function (a, b) {
            return b - a;
        },

        /**
         * Create a rectangular path
         * @param {Context2D} ctx Canvas 2D Context
         * @param {Object} style
         */
        buildPath : function (ctx, style) {
            var yList = zrUtil.clone(style.y).sort(this._numberOrder);

            var whiskerOffset = style.width / 4;

            //draw first/top whisker cap
            ctx.moveTo(style.x - whiskerOffset, yList[3]);
            ctx.lineTo(style.x + whiskerOffset, yList[3]);

            // draw whisker down to bottom
            ctx.moveTo(style.x, yList[3]);
            ctx.lineTo(style.x, yList[2]);

            ctx.moveTo(style.x - style.width / 2, yList[2]);
            //rectangle of width (style.width)
            // height yList[2] - yList[1]
            ctx.rect(
                style.x - style.width / 2,
                yList[2],
                style.width,
                yList[1] - yList[2]
            );
            ctx.moveTo(style.x, yList[1]);
            ctx.lineTo(style.x, yList[0]);

            //draw second/bottom whisker cap
            ctx.moveTo(style.x - whiskerOffset, yList[0]);
            ctx.lineTo(style.x + whiskerOffset, yList[0]);
        },

        /**
         * Returns a rectangular area for partial refresh, and text positioning
         * @param {Object} style
         */
        getRect : function (style) {
            if (!style.__rect) {
                var lineWidth = 0;
                if (style.brushType == 'stroke' || style.brushType == 'fill') {
                    lineWidth = style.lineWidth || 1;
                }

                var yList = zrUtil.clone(style.y).sort(this._numberOrder);
                style.__rect = {
                    x : Math.round(style.x - style.width / 2 - lineWidth / 2),
                    y : Math.round(yList[3] - lineWidth / 2),
                    width : style.width + lineWidth,
                    height : yList[0] - yList[3] + lineWidth
                };
            }

            return style.__rect;
        },

        isCover : require('./normalIsCover')
    };

    zrUtil.inherits(BoxWhisker, Base);

    module.exports = BoxWhisker;
