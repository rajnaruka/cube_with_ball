'use strict';

// mouse pointer js
$(document).ready(function(){
    $('body').prepend(`
        <div class="pointer d-none d-sm-block"></div>
        <div class="pointer-ring d-none d-sm-block"></div>
    `);
    var $pointer = $('.pointer'), $pointerRing = $('.pointer-ring');
    var mouse_pointer_size=14;
    $pointer.css({background:'rgba(var(--primary),1)',boxShadow:'0 0 0 2px rgba(var(--white),0.2)',height:mouse_pointer_size+'px',width:mouse_pointer_size+'px',position:'fixed',borderRadius:'50%',opacity:0,transition:'0.3s ease-out','z-index' : '9999',"pointer-events": "none"});
    $pointerRing.css({outline:'1px solid rgba(var(--primary),1)',height:(mouse_pointer_size+20)+'px',width:(mouse_pointer_size+20)+'px',position:'fixed',borderRadius:'50%',opacity:0,transition:'0.5s ease-out','z-index' : '9999',"pointer-events": "none"});
    $(document).mousemove(function(event){
        var x = event.pageX, y = event.pageY - $(window).scrollTop(),
            pw = $pointer.width() / 2, ph = $pointer.height() / 2,
            prw = $pointerRing.width() / 2, prh = $pointerRing.height() / 2,
            wW = $(window).width(), wH = ($(window).height()),
            nearEdge = x < (pw && prw) || y < (ph && prh) || x > wW - (pw && prw) || y > wH - (ph && prh),
            opacity = nearEdge ? '0' : '1', scale = nearEdge ? '0' : '1';

        $pointer.css({ opacity, transform: `translate(${x - pw}px, ${y - ph}px) scale(${scale})` });
        $pointerRing.css({ opacity, transform: `translate(${x - prw}px, ${y - prh}px) scale(${scale})` });
    });
});

// Cube js
$(document).ready(function() {
    $('#radius, #size, #speed').on('input', function() {
        var value = $(this).val();
        $(this).next('span').text(value + 'px');

        if (this.id === 'radius') {
            $('.cube-child').css('borderRadius', value + 'px');
        } else if (this.id === 'size') {
            $(':root').css('--cube-size', value + 'px');
        } else if (this.id === 'speed') {
            $('.cube-parent, .cube-ball').css('animation-duration', value + 's');
            $(this).next('span').text(value + 's');
        }
    });
});


// input type range css
var inputRangeBackground = vals =>{
    let starting_value = vals.val();
    let min = vals.attr('min');
    let max = vals.attr('max');
    let percentage = ((starting_value - min) / (max - min)) * 100;
    vals.css({'backgroundSize' : `${percentage+'%'} 100%`});
}
$(document).ready(function() {
   $('input[type="range"]').each(function(){
         inputRangeBackground($(this));
        $(this).on('input', function() {
            inputRangeBackground($(this));
        });
    });
});

// Theme look
$('#theme-toggle').on('change', function() {
    $('body').attr('data-color', this.checked ? 'light' : null);
});