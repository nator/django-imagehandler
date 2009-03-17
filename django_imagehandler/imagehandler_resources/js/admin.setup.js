/*
 Tab functions
*/

function addTab(label, id, is_new) {

    // Default label
    if(is_new)
        label = "[New crop]"
    else if(label == '')
        label = '#'+id;

    // Create
    var new_tab = $('<div></div>').addClass('tab_id_'+id).html(label);
    
    // Attach events
    new_tab.click(function() {
        selectTab(id);
    });

    // Append
    $('div.tab-bar').append(new_tab);
}

function selectTab(id) {
    // Reset selected
    $('div.tab-bar div').each(function() {
        $(this).removeClass('selected');
    });
    
    // Hide all sections
    $('div.crop-wrap').each(function() {
        $(this).hide(0);
    });

    // Select tab & show section
    $('div.tab_id_'+id).addClass('selected');
    $('div.crop_id_'+id).show(0);
}

/*
 Cropper functions
*/

var input_start = '#id_django_imagehandler-crop-content_type-object_id-';

var callback = function(elem, x, y) {
    elem = $(elem);
    elem.css({
        'background-position': '-'+x+'px -'+y+'px'
    })

    position = elem.position();
    $(input_start+elem.attr('instance_id')+'-x').val(position.left);
    $(input_start+elem.attr('instance_id')+'-y').val(position.top);
    $(input_start+elem.attr('instance_id')+'-width').val(elem.width());
    $(input_start+elem.attr('instance_id')+'-height').val(elem.height());
    
    setSizeLabels(elem.attr('instance_id'), position.left, position.top, elem.width(), elem.height());

}

function setFrame(elem, x, y, width, height) {
    elem.css({
        top: y,
        left: x,
        width: width,
        height: height,
        'background-position': '-'+x+'px -'+y+'px'
    });
    
    setSizeLabels(elem.attr('instance_id'), x, y, width, height);
}

function setSize(id, width, height) {

    var cropperSelector = $('div.cropperSelector[instance_id='+id+']');
    var cropperSize = $('div.cropperSize[instance_id='+id+']');
    var position = cropperSelector.position();

    if(width) {
        cropperSelector.css('width', width+'px');
        moveSizeLabels(cropperSize, position.left, position.top, width, cropperSelector.height());
        callback(cropperSelector, position.left, position.top);
    }
        
    if(height) {
        cropperSelector.css('height', height+'px');
        moveSizeLabels(cropperSize, position.left, position.top, cropperSelector.width(), height);
        callback(cropperSelector, position.left, position.top);
    }
}

function setSizeLabels(id, left, top, width, height) {
    var cropperSize = $('div.cropperSize[instance_id='+id+']');
    $('input.width', cropperSize).val(width);
    $('input.height', cropperSize).val(height);
    
    moveSizeLabels(cropperSize, left, top, width, height);
}

function moveSizeLabels(elem, left, top, width, height) {
    elem.css({
        top: (parseInt(top) + parseInt(height) + 10)+'px',
        left: (parseInt(left) + parseInt(width) + 10)+'px'
    });
}


$(document).ready(function(){

    var states = {}
    var errors = {}

    // Originals
    var originals = $('div.originals-box');
    originals.each(function(i){
        var current_box = this;
        
        // Errors?
        if($("ul.errorlist li", this).size() > 0) {
            $('div.edit', current_box).css('display', 'block');
            states[i] = true;
            errors[i] = true;
        }
        
        // Hide if new
        if(!errors[i] && $('div.edit', this).hasClass('new')) {
            $(this).hide(0);
            $(this).addClass('unused');
        }
        
        // Show overlay
        $(this).hover(function(){
            $('div.edit', this).css('display', 'block');
        },
        function() {
            if(!states[i] && !errors[i] && !$('div.edit', current_box).hasClass('new'))
                $('div.edit', this).css('display', 'none');
        });
        
        // Remove the text around the file input
        $("div.field", this).prepend($("input[type=file]", this));
        
        // replace file input quickly..
        $("input[type=file]", this).wrap('<div class="file-wrap"></div>').before("<button>Select new file</button>");
        $("div.file-wrap", this).after($("<div></div>").addClass('file-value'));
        $("input[type=file]", this).change(function(){
            $("div.file-value", current_box).html("<span>File:</span> "+$(this).val());
        });
        
        // Keep the overlay visible if any input is changed
        $("input:checkbox", this).change(function(){
            if(!states[i])
                states[i] = true;
            else
                states[i] = false;
        });
        $("input[type=file]", this).click(function(){
            states[i] = true;
        });
    });
    
    $('div.new-bar.originals a').click(function(){
        // TODO: there must be a better way to do this
        var all_unused = $("div.originals-wrap div.unused");
        var unused = $("div.originals-wrap div.unused:first");
        
        unused.fadeIn(200);
        unused.removeClass('unused');
        
        // Have we shown them all?
        if(all_unused.size() == 1)
            $(this).hide(0);
    });
    
    // Crops
    var crops = $('div.crop-wrap');
    crops.each(function(i){
    
        // Vars
        var fields = {
            original: $(input_start+i+'-original'),
            caption: $(input_start+i+'-caption'),
            identifier: $(input_start+i+'-identifier'),
            origin: {
                x: $(input_start+i+'-x').val(),
                y: $(input_start+i+'-y').val()
            },
            size: {
                width: $(input_start+i+'-width').val(),
                height: $(input_start+i+'-height').val()
            }
        }
        
        var cropper = $('div.cropperWrap', this);
        var selector = $('div.cropperSelector', this);
        
        if(fields.original.val() != '')
            is_new = false;
        else
            is_new = true;
        
        
        // Create a tab for this crop
        addTab(fields.identifier.val(), i, is_new);
        
        
        // Set up selector
        selector.dragWithBounds({ dragCallback:callback });
        selector.resizeable({
            circle: '/admin-media/imagehandler_resources/gfx/circle.png',
            circle_focus: '/admin-media/imagehandler_resources/gfx/circle_foc.png',
            line: '/admin-media/imagehandler_resources/gfx/line.gif',
            dragCallback:callback
        });
        
        var original_parent = fields.original.parent();
        var new_parent = $('<div>'+original_parent.html()+'</div>');
        original_parent.html('');
        
        $('select', new_parent).change(function() {
            url = $(':selected', this).text();
            selector.css('background-image', 'url('+escape(url)+')');
            img = $('img.img-'+i);
            if(img.length == 0)
                cropper.append($('<img />').addClass('img-'+i).attr('src', url).fadeTo(0, 0.5));
            else
                img.attr('src', url);
        });

        /*
            # TODO: Fix these...
        */
        var original_caption = fields.caption.parent();
        var new_caption = $('<div>'+original_caption.html()+'</div>');
        original_caption.html('');

        var original_identifier = fields.identifier.parent();
        var new_identifier = $('<div>'+original_identifier.html()+'</div>');
        original_identifier.html('');
        
        $('div.fields', this).prepend(new_identifier);
        $('div.fields', this).prepend(new_caption);
        $('div.fields', this).prepend(new_parent);
        
        // set up start position for selector
        if(!is_new) {
            var src = $(':selected', fields.original).text();
            selector.css('background-image', 'url('+escape(src)+')');
            cropper.append($('<img />').addClass('img-'+i).attr('src', src).fadeTo(0, 0.5));
            setFrame(
                selector,
                parseInt(fields.origin.x),
                parseInt(fields.origin.y),
                parseInt(fields.size.width),
                parseInt(fields.size.height)
            );
        } else {
            setFrame(selector, 20, 20, 50, 50);
        }

        $('input.width', this).keyup(function() {
            var width = $(this).val();
            if(isInteger(width))
                setSize(i, width, false);
        });
        $('input.height', this).keyup(function() {
            var height = $(this).val();
            if(isInteger(height))
                setSize(i, false, height);
        });
        
    });

    // Select the first tab
    selectTab(0);

});


/*
**
*/
function isInteger (s)
   {
      var i;

      if (isEmpty(s))
      if (isInteger.arguments.length == 1) return 0;
      else return (isInteger.arguments[1] == true);

      for (i = 0; i < s.length; i++)
      {
         var c = s.charAt(i);

         if (!isDigit(c)) return false;
      }

      return true;
   }

   function isEmpty(s)
   {
      return ((s == null) || (s.length == 0))
   }

   function isDigit (c)
   {
      return ((c >= "0") && (c <= "9"))
   }
