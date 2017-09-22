/**
 * Created by Armin on 7/28/2017.
 */
var is_page_layout_loaded = false;
var sections_loaded = 0;
$(document).ready(function(){
    is_page_layout_loaded = false;
    sections_loaded = 0;
    $('header').removeClass('fade-out');
    $('nav').removeClass('fade-out');
    setTimeout(function () {
        $('section#news-block').removeClass('fade-out');
        setTimeout(function () {
            $('section#content-block').removeClass('fade-out');
            is_page_layout_loaded = true;
            update_blocks();
            setTimeout(function () {
                $('footer').removeClass('fade-out');
            }, 500);
        }, 500)
    }, 500);
});
$(window).scroll(function () {
    update_blocks();
});
$(window).resize(function () {
    update_blocks();
});
function update_blocks() {
    if (is_page_layout_loaded){
        var x = $(".content-block-item");
        // var boxes = [];
        var nums = x.length;
        for (var i = 0; i < nums; i += 1){
            var t = $("#content-block-item-" + (i + 1));
            if ($(t).position().top + 200 < $(window).scrollTop() + $(window).height() && $(t).css("opacity") == 0){
                show_content_block(t);
            }
        }
    }
}

function show_content_block(block) {
    var items = $(block).find(".box-item");
    var nums = items.length;
    $(block).removeClass("fade-out");
    // alert(nums);
    for (var i = 0; i < nums; i += 1){
        (function (e) {
            setTimeout(function () {
                $("#" + $(block).prop("id") + "-" + (e + 1)).removeClass("fade-out");
            }, 50 + e * 300);
        })(i);
    }
}

function hide(element) {
    $(element).addClass('fade-out');
    // alert($(element).prop("id"));
}

