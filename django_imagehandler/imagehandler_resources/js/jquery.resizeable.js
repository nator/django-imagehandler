/*
#
# jquery.resizable.js
#
# by Ludwig Pettersson
# <http://luddep.se>
#

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
*/
(function() {
	var default_settings = {
		circle: '../static/gfx/circle.png',
		circle_focus: '../static/gfx/circle_foc.png',
		circles: ['top', 'right', 'bottom', 'left', 'topleft', 'topright', 'bottomleft', 'bottomright'],
		line: '../static/gfx/line.gif',
		line_opacity: 0.7,
		lines: ['top', 'right', 'bottom', 'left'],
		min_size: 15,
		dragCallback: false
    }
    
    create_line = function(settings, position) {
        return $('<div></div>').addClass('line').addClass(position).fadeTo(0, settings.line_opacity);
    }
	
    create_circle = function(settings, position) {
        temp = $('<img />').attr('src', settings.circle).addClass('circle').addClass(position);
        data = {}
        parent = null;

        temp.mousedown(function() {
            $(this).attr('src', settings.circle_focus).addClass('focus');
        });
        temp.bind('dragstart',function( event ){
        
            parent = $(this).parent();
        
            data.top = parent.position().top;
            data.left = parent.position().left;
            data.width = parent.width();
            data.height = parent.height();
            data.parent = { elem:parent.parent() };
                data.parent.position = data.parent.elem.offset();
                data.parent.size = {
                    width: data.parent.elem.width(),
                    height: data.parent.elem.height()
                }
            
        });
        temp.bind('dragend',function( event ){
            $(this).attr('src', settings.circle).removeClass('focus');
        });
        temp.bind('drag',function( event ){
            new_data = {}
            new_data.top = data.top;
            new_data.left = data.left;
            
            // Fix offset
            event.offsetY = event.offsetY - data.parent.position.top + 5;
            event.offsetX = event.offsetX - data.parent.position.left + 5;
            
            // Shift?
            if(event.shiftKey) {
                var shift_side = position;
                event.diffX = event.diffX*2;
                event.diffY = event.diffY*2;
            } else {
                var shift_side = false;
            }
            
            // top resizer
            if(position == 'top' || shift_side == 'bottom') {
                if(shift_side == 'bottom') {
                    new_data.top = data.top + event.diffY/2;
                } else {
                    new_data.top = event.offsetY;
                    new_data.height = data.height + event.diffY;
                }
            }
            
            // right resizer
            if(position == 'right' || shift_side == 'left') {
                if(shift_side == 'left')
                    new_data.width = data.width - event.diffX/2;
                else
                    new_data.width = data.width - event.diffX;
            }
            
            // bottom resizer
            if(position == 'bottom' || shift_side == 'top') {
                if(shift_side == 'top')
                    new_data.height = data.height + event.diffY;
                else
                    new_data.height = data.height - event.diffY;
            }
            
            // left resizer
            if(position == 'left' || shift_side == 'right') {
                if(shift_side == 'right') {
                    new_data.left = data.left + event.diffX/2;
                } else {
                    new_data.left = event.offsetX;
                    new_data.width = data.width + event.diffX;
                }
            }
            
            // topleft resizer
            if(position == 'topleft') {
                new_data.top = event.offsetY;
                new_data.left = event.offsetX;
                new_data.width = data.width + event.diffX;
                new_data.height = data.height + event.diffY;
            }

            // topright resizer
            if(position == 'topright' || shift_side == 'topright') {
                if(shift_side == 'topright') {
                    new_data.top = data.top - event.diffY/2;
                    new_data.left = data.left + event.diffX/2;
                } else {
                    new_data.top = data.top - event.diffY;
                }
                
                new_data.height = data.height + event.diffY;
                new_data.width = data.width - event.diffX;
            }
            
            // bottomleft resizer
            if(position == 'bottomleft' || shift_side == 'bottomleft') {
                if(shift_side == 'bottomleft')
                    new_data.top = data.top + event.diffY/2;

                new_data.left = event.offsetX;
                new_data.width = data.width + event.diffX;
                new_data.height = data.height - event.diffY;
            }

            // bottomright resizer
            if(position == 'bottomright' || shift_side == 'bottomright') {
                if(shift_side == 'bottomright') {
                    new_data.top = data.top + event.diffY/2;
                    new_data.left = data.left + event.diffX/2;
                }
                new_data.width = data.width - event.diffX;
                new_data.height = data.height - event.diffY;
            }
            
            // Top & Left limiter
            if(0 > new_data.top) {
                new_data.top = 0;
                new_data.height = data.height + (event.diffY + event.offsetY);
            }
            if(0 > new_data.left) {
                new_data.left = 0;
                new_data.width = data.width + (event.diffX + event.offsetX);
            }
            
            // Bottom & Right limiter
            if(new_data.width > data.parent.size.width)
                new_data.width = data.parent.size.width;
            if(new_data.width + new_data.left > data.parent.size.width)
                new_data.width = data.parent.size.width - new_data.left;
            if(new_data.height > data.parent.size.height)
                new_data.height = data.parent.size.height;
            if(new_data.height + new_data.top > data.parent.size.height)
                new_data.height = data.parent.size.height - new_data.top;
                
            // Min size
            if(new_data.width < settings.min_size) {
                new_data.width = settings.min_size;
                new_data.left = undefined;
            }
            if(new_data.height < settings.min_size) {
                new_data.height = settings.min_size;
                new_data.top = undefined;
            }

            // Change parent
            $(this).parent().css({
                top: new_data.top,
                left: new_data.left,
                width: new_data.width,
                height: new_data.height
            });
            
            if(settings.dragCallback)
                settings.dragCallback($(this).parent(), new_data.left, new_data.top)

        });
        return temp;
    }
	
	jQuery.fn.resizeable = function(settings) {
        var settings = jQuery.extend(default_settings, settings);

        // add lines
        for(i in settings.lines)
            $(this).append(create_line(settings, settings.lines[i]));

        // add circles
        for(i in settings.circles)
            $(this).append(create_circle(settings, settings.circles[i]));

	};

})();