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
    var thumbnails = $('td.original input[type=hidden]');
    
    $('thead').hide(0);
    
    thumbnails.each(function(i){
    
        var img = '';
        var td = $(this).parent();
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
        
        console.log('td: '+td.position().top);
    
        // hide default fields
        td.siblings().css({display: 'none'});
        
        // custom field
        var custom = $('<td></td>').addClass('cropperRow').attr('id', 'custom-'+i);
        var cropper = $('<div></div>').addClass('cropperWrap');
        var selector = $("<div></div>").addClass('selector').attr('id', 'selector-'+i).attr('instance_id', i);
        td.after(custom);
        custom.append(cropper);
        cropper.append(selector);
        
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
        
        custom.prepend(new_parent);
        
        
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
            //setFrame(selector, 20, 20, 150, 100);
        }
        
        
        /*$(this).parent().siblings().each(function(){
            $(this).css('background', 'red');
        });*/
    });


/*
    var image = $("img#image").fadeTo(0, 0.5);
    var selector = $("div.selector").css('background-image', 'url('+image.attr('src')+')');
    
    setFrame(selector, 79, 21, 316, 76);

    selector.dragWithBounds({ dragCallback:callback });
    selector.resizeable({ dragCallback:callback });
    
    $('button').click(function(){
        $("div.selector").css({
            top: parseInt($('input#y').val()),
            left: parseInt($('input#x').val()),
            width: parseInt($('input#width').val()),
            height: parseInt($('input#height').val())
        });
    });
*/
});