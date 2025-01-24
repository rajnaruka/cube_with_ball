'use strict';

const body = $('body');

// mouse pointer js
const handleMousePointer = function(){
    $(body).prepend(`
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
}

// handle size, speed and radius
const handleCube = function(){
    $('#radius, #size, #speed').on('input', function() {
        var value = $(this).val();
        $(this).next('span').text(value + 'px');
        
        if (this.id === 'radius') {
            $('.cube-child').css('borderRadius', value + 'px');
            saveToLocalStorage('cubeRadius',value);
        } else if (this.id === 'size') {
            $(':root').css('--cube-size', value + 'px');
            saveToLocalStorage('cubeSize',value);
        } else if (this.id === 'speed') {
            $('.cube-parent, .cube-ball').css('animation-duration', value + 's');
            $(this).next('span').text(value + 's');
            saveToLocalStorage('cubeSpeed',value);
        }
    });
}

// input type range css background
const inputRangeBackground = function(vals){
    let starting_value = vals.val();
    let min = vals.attr('min');
    let max = vals.attr('max');
    let percentage = ((starting_value - min) / (max - min)) * 100;
    vals.css({'backgroundSize' : `${percentage+'%'} 100%`});
}

// rgbToHex and hexToRgb functions
function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g);  // Extract RGB values from the string
    const r = parseInt(rgbValues[0]).toString(16).padStart(2, '0'); // Red
    const g = parseInt(rgbValues[1]).toString(16).padStart(2, '0'); // Green
    const b = parseInt(rgbValues[2]).toString(16).padStart(2, '0'); // Blue
    return `#${r}${g}${b}`;
}
function hexToRgb(hex) {
    // Remove the # at the start
    hex = hex.replace('#', '');

    // Convert hex to RGB values
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return { r, g, b };
}

// applyLocalStorageValues on reload
const applyLocalStorageValue = (key, callback) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
        callback(value);
        $('#reset_btn').removeClass('d-none');
    }
};

// saveToLocalStorage
const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
    $('#reset_btn').removeClass('d-none');
};

// removeFromLocalStorage
const removeFromLocalStorage = (key) => {
    localStorage.removeItem(key);
    window.location.reload();
};

$(document).ready(function(){
    handleMousePointer();
    handleCube();

    $('input[type="range"]').each(function(){
        inputRangeBackground($(this));
        $(this).on('input', function() {
            inputRangeBackground($(this));
        });
    });

    // Theme look
    $('#theme-toggle').on('change', function() {
        $(body).attr('data-color', this.checked ? 'light' : 'dark');
        const themeMode = $(body).attr('data-color');
        saveToLocalStorage('themeMode',themeMode);
    });

    // change_theme_color
    $('#change_theme_color').on('input',function(){
        const hexValue = $(this).val();
        const rgb = hexToRgb(hexValue);
        const rgbValue = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

        saveToLocalStorage('themeColor', rgbValue);
        $(':root').css('--primary', rgbValue);
    });

    // reset local storage
    $('#reset_btn').on('click', function() {
        const keysToRemove = ['themeColor', 'themeMode', 'cubeRadius', 'cubeSize', 'cubeSpeed'];
        keysToRemove.forEach(key => localStorage.removeItem(key));
    });

    // Apply theme color
    applyLocalStorageValue('themeColor', (savedColor) => {
        $(':root').css('--primary', savedColor);
        const hexColor = rgbToHex(savedColor);
        $('#change_theme_color').val(hexColor);
    });

    // Apply theme mode
    applyLocalStorageValue('themeMode', (themeMode) => {
        $('#theme-toggle').prop('checked', themeMode === 'light');
        $('body').attr('data-color', themeMode);
    });

    // Apply cube radius
    applyLocalStorageValue('cubeRadius', (cubeRadius) => {
        $('.cube-child').css('borderRadius', cubeRadius + 'px');
        $('#radius').next('span').text(cubeRadius + 'px');
        $('#radius').val(cubeRadius);
        inputRangeBackground($('#radius'));
    });

    // Apply cube size
    applyLocalStorageValue('cubeSize', (cubeSize) => {
        $(':root').css('--cube-size', cubeSize + 'px');
        $('#size').next('span').text(cubeSize + 'px');
        $('#size').val(cubeSize);
        inputRangeBackground($('#size'));
    });

    // Apply cube speed
    applyLocalStorageValue('cubeSpeed', (cubeSpeed) => {
        $('#speed').next('span').text(cubeSpeed + 's');
        $('.cube-parent, .cube-ball').css('animation-duration', cubeSpeed + 's');
        $('#speed').val(cubeSpeed);
        inputRangeBackground($('#speed'));
    });

    $("#show-card-box").click(function(){
        $(".card-box").slideToggle();
    });
});