var input_start = '#id_imagecropper-crop-content_type-object_id-';

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

}

function setFrame(elem, x, y, width, height) {
    elem.css({
        top: y,
        left: x,
        width: width,
        height: height,
        'background-position': '-'+x+'px -'+y+'px'
    });
}



$(document).ready(function(){
    var crops = $('div.crop_part');
    
    crops.each(function(i){
    
        var fields = {
            original: $(input_start+i+'-original'),
            caption: $(input_start+i+'-caption'),
            origin: {
                x: $(input_start+i+'-x').val(),
                y: $(input_start+i+'-y').val()
            },
            size: {
                width: $(input_start+i+'-width').val(),
                height: $(input_start+i+'-height').val()
            }
        }
        
        // custom field
        var cropper = $('div.cropperWrap', this);
        var selector = $('div.cropperSelector', this);
        
        selector.dragWithBounds({ dragCallback:callback });
        selector.resizeable({
            circle: '/admin-media/imagecropper/gfx/circle.png',
            circle_focus: '/admin-media/imagecropper/gfx/circle_foc.png',
            line: '/admin-media/imagecropper/gfx/line.gif',
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
        

        var original_caption = fields.caption.parent();
        var new_caption = $('<div>'+original_caption.html()+'</div>');
        original_caption.html('');
        
        $('div.fields', this).prepend(new_caption);
        $('div.fields', this).prepend(new_parent);
        
        // set up start position for selector
        if(fields.original.val() != '') {
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

        
    });



});