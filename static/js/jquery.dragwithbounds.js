/*
#
# jquery.dragwithbounds.js
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
		container: 'parent',
		dragCallback: false
	 }
	
	jQuery.fn.dragWithBounds = function(settings) {
        var settings = jQuery.extend(default_settings, settings);
        
        if(settings.container == 'parent')
            settings.container = this.parent();
        
        $(this).bind('drag',function( event ){

            settings.container_data =  {
                origin: {
                    'Y': $(this).parent().offset().top,
                    'X': $(this).parent().offset().left,
                },
                size: {
                    'width': $(this).parent().width(),
                    'height': $(this).parent().height()
                }
            }

            dragger_data = {
                origin: {
                    'Y': event.offsetY-settings.container_data.origin.Y,
                    'X': event.offsetX-settings.container_data.origin.X
                },
                size: {
                    'width': $(this).width(),
                    'height': $(this).height()
                }
            }

            
            // trying to go left
            if(dragger_data.origin.X < 0) {
                dragger_data.origin.X = 0;
            }
            // trying to go right
            if(dragger_data.origin.X + dragger_data.size.width > settings.container_data.size.width) {
                dragger_data.origin.X = settings.container_data.size.width - dragger_data.size.width;
            }
            
            // trying to go top
            if(dragger_data.origin.Y < 0) {
                dragger_data.origin.Y = 0;
            }
            // trying to go bottom
            if(dragger_data.origin.Y + dragger_data.size.height > settings.container_data.size.height) {
                dragger_data.origin.Y = settings.container_data.size.height - dragger_data.size.height;
            }
            
            $(this).css({
                top: dragger_data.origin.Y,
                left: dragger_data.origin.X
            });
            
            if(settings.dragCallback)
                settings.dragCallback(this, $(this).position().left, $(this).position().top)

      });

	};

})();