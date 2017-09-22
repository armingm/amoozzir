/**
 * Created by Armin on 7/27/2017.
 */
function SearchUser(){
    this.instructorFilter = function (result){
        var data = result.split(";");
        var x;
        var out = "";
        for (var i = 0; i < data.length; i += 1){
            x = data[i].split(",");
            if (parseFloat(x[0]) != 0){
                out += "<div class='item'>" + x[2] + "<div class='identifier' style='display: none'>" + x[1] + "</div></div>";
            }
        }
        $("#sug-search-instructor-by-course").html(out);
    };
    this.classFilter = function (result) {
        $(".class-page .directory-explorer .address").html("");
        $(".class-page .directory-explorer .main").html("");
        currentDirs = [];
        nullParentDir = null;
        console.log("hoyyyy");
        var data = result.split(";");
        var x;
        var item;
        for (var i = 0; i < data.length; i += 1) {
            x = data[i].split(",");
            if (parseFloat(x[0]) != 0){
                item = new ItemFile();
                item.initDir(null, parseInt(x[1]), x[2]);
                currentDirs.push(item);
            }
        }
        refreshDirs();
    };
}

var searchUser = new SearchUser();
var filterInstructor = {field: [], course: -1, type: []};
var map_field_to_class = {'ریاضی': 'instructor-field-math', 'فیزیک': 'instructor-field-physics', 'زیست شناسی': 'instructor-field-biology', 'شیمی': 'instructor-field-chemistry', 'نجوم': 'instructor-field-astronomy', 'کامپیوتر': 'instructor-field-computer', 'ادبیات': 'instructor-field-literature'};
var olympiadDir = new Directory();
var darsiDir = new Directory();
var konkurDir = new Directory();
var counselDir = new Directory();
var nullParentDir;
var typeDirs = [new Directory(), new Directory(), new Directory(), new Directory(), new Directory(), new Directory(), new Directory()];
var levelDDirs = [new Directory(), new Directory(), new Directory(), new Directory(), new Directory(), new Directory(), new Directory()];
var levelKDirs = [new Directory(), new Directory(), new Directory()];
var kindDirs = [new Directory(), new Directory()];

olympiadDir.initDir(null, 'الم‍پیاد');
darsiDir.initDir(null, 'درسی');
konkurDir.initDir(null, 'کنکور');
counselDir.initDir(null, 'مشاوره');
typeDirs[0].initDir(olympiadDir, 'ریاضی');
typeDirs[1].initDir(olympiadDir, 'فیزیک');
typeDirs[2].initDir(olympiadDir, 'شیمی');
typeDirs[3].initDir(olympiadDir, 'زیست شناسی');
typeDirs[4].initDir(olympiadDir, 'نجوم');
typeDirs[5].initDir(olympiadDir, 'کامپیوتر');
typeDirs[6].initDir(olympiadDir, 'ادبیات');
levelDDirs[0].initDir(darsiDir, 'پنجم');
levelDDirs[1].initDir(darsiDir, 'ششم');
levelDDirs[2].initDir(darsiDir, 'هفتم');
levelDDirs[3].initDir(darsiDir, 'هشتم');
levelDDirs[4].initDir(darsiDir, 'نهم');
levelDDirs[5].initDir(darsiDir, 'دهم');
levelDDirs[6].initDir(darsiDir, 'یازدهم');
levelKDirs[0].initDir(konkurDir, 'دهم');
levelKDirs[1].initDir(konkurDir, 'یازدهم');
levelKDirs[2].initDir(konkurDir, 'پیش دانشگاهی');
kindDirs[0].initDir(counselDir, 'المپیاد');
kindDirs[1].initDir(counselDir, 'کنکور');
var i;
for (i = 0; i < typeDirs.length; i += 1){
    olympiadDir.addChild(typeDirs[i]);
}
for (i = 0; i < levelDDirs.length; i += 1){
    darsiDir.addChild(levelDDirs[i]);
}
for (i = 0; i < levelKDirs.length; i += 1){
    konkurDir.addChild(levelKDirs[i]);
}
for (i = 0; i < kindDirs.length; i += 1){
    counselDir.addChild(kindDirs[i]);
}

var currentDirs = [olympiadDir, darsiDir, konkurDir, counselDir];

function setUpInitialDirs() {
    currentDirs = [olympiadDir, darsiDir, konkurDir, counselDir];
    refreshDirs();
}

function changeCurrentDirectories(clickedDir) {
    // alert("change directory");
    if (clickedDir === null){
        setUpInitialDirs();
    } else if (clickedDir.childrenDir.length === 0){
        clickedDir.fetchClasses();
        if (clickedDir.childrenDir.length === 0){
            nullParentDir = clickedDir;
        }
        currentDirs = clickedDir.childrenDir;
    } else {
        currentDirs = clickedDir.childrenDir;
    }
    refreshDirs();
}

function refreshDirs() {
    // alert("refresh feeds");
    var x = $(".class-page .directory-explorer .main")[0];
    $(x).fadeOut(function () {
        $(x).html("");
        if (currentDirs.length > 0){
            for (var i = 0; i < currentDirs.length; i += 1){
                currentDirs[i].appear();
                // alert(currentDirs[i].DOMBoxElement);
                x.appendChild(currentDirs[i].DOMBoxElement);
            }
            if (currentDirs[0].parentDir !== null){
                currentDirs[0].parentDir.setAddressBar($(".class-page .directory-explorer .address")[0]);
            } else {
                $(".class-page .directory-explorer .address")[0].innerHTML = "";
            }
        } else {
            var div = document.createElement("div");
            $(div).css("font-size", "40px");
            $(div).css("text-align", "center");
            $(div).css("color", "#242582");
            $(div).html("کلاسی موجود نمی باشد.");
            $(div).css("width", "100%");
            console.log(div);
            x.appendChild(div);
            if (nullParentDir !== null){
                nullParentDir.setAddressBar($(".class-page .directory-explorer .address")[0]);
            } else {
                $(".class-page .directory-explorer .address")[0].innerHTML = "";
            }
        }
        $(x).find(".item").fadeIn();
        $(x).fadeIn(function () {
            fixClassItemFonts();
        });
    });
}

function Timer(callback, duration){
    var remaining = duration, curTime, timerId;
    this.isRunning = false;
    this.start = function () {
        curTime = new Date();
        timerId = setTimeout(callback, duration);
        this.isRunning = true;
    };
    this.stop = function(){
        remaining = duration;
        clearTimeout(timerId);
        this.isRunning = false;
    };
    this.pause = function(){
        remaining -= (new Date() - curTime);
        // curTime = new Date();
        clearTimeout(timerId);
        this.isRunning = false;
    };
    this.resume = function () {
        curTime = new Date();
        timerId = setTimeout(callback, remaining);
        this.isRunning = true;
    }
}
// var news_id = 1;
function update_news() {
    var i;
    var num_news = $("section#news-block .news-holder").length;
    var news_blocks = [];
    news_timer.stop();
    for (i = 0; i < num_news; i += 1){
        news_blocks[i] = $("section#news-block #news-holder-" + (i + 1));
    }
    for (i = 0; i < num_news; i += 1){
        (function(e) {
            $(news_blocks[e]).animate({
                left: "+=" + parseInt($(news_blocks[e]).css('width'))
            }, {
                duration: 1000,
                complete: function () {
                    if (e === 0) {
                        news_timer.start();
                    }
                    if (parseInt($(news_blocks[e]).css('left')) >= parseInt($(news_blocks[e]).css('width'))) {
                        $(news_blocks[e]).css("left", -((num_news - 1) * parseInt($(news_blocks[e]).css('width'))) + "px");
                    }
                }
            });
        })(i);
    }
}
function update_news_reverse() {
    var i;
    var num_news = $("section#news-block .news-holder").length;
    var news_blocks = [];
    news_timer.stop();
    for (i = 0; i < num_news; i += 1){
        news_blocks[i] = $("section#news-block #news-holder-" + (i + 1));
        if (parseInt($(news_blocks[i]).css('left')) <= -((num_news - 1) * parseInt($(news_blocks[i]).css('width')))) {
            $(news_blocks[i]).css("left", parseInt($(news_blocks[i]).css('width')) + "px");
        }
    }
    for (i = 0; i < num_news; i += 1){
        (function(e) {
            $(news_blocks[e]).animate({
                left: "-=" + parseInt($(news_blocks[e]).css('width'))
            }, {
                duration: 1000,
                complete: function () {
                    if (e === 0) {
                        news_timer.start();
                    }
                }
            });
        })(i);
    }
}

function refreshInstructorFeed(filters, method) {
    var filter = filters || {};
    var ind;
    if (filter.field !== undefined && filter.field !== ""){
        switch (method){
            case 'set':
                filterInstructor.field = [filter.field];
                break;
            case 'add':
                filterInstructor.field.push(filter.field);
                break;
            case 'remove':
                ind = filterInstructor.field.indexOf(filter.field);
                if (ind != -1)
                    filterInstructor.field.splice(ind, 1);
                break;
        }
    }
    if (filter.course !== undefined && filter.course !== -1){
        filterInstructor.course = filter.course;
    }
    if (filter.type !== undefined && filter.type !== ""){
        switch (method){
            case 'set':
                filterInstructor.type = [filter.type];
                break;
            case 'add':
                filterInstructor.type.push(filter.type);
                break;
            case 'remove':
                ind = filterInstructor.type.indexOf(filter.type);
                if (ind != -1)
                    filterInstructor.type.splice(ind, 1);
                break;
        }
    }
    $.ajax({
        url: "Code/srv_php/About/get_instructor.php",
        type: "post",
        data:{
            filters: filterInstructor
        },
        success: function(result){
            var data = result.split("&#");
            var x;
            var resume;
            var y;
            var name;
            var field;
            var out = "";
            if (result !== undefined && result.trim() !== "") {
                for (var i = 0; i < data.length; i += 1) {
                    x = extractQuote(data[i]);
                    resume = x[0];
                    y = x[1].split(',');
                    name = y[0];
                    field = y[2];
                    out += '<div class="long-box outer-box-shadow-2"><div class="thumbnail"><img src="Resources/Site/instructors/' + name + '/thumbnail.jpg"></div><div class="info"><div class="head-text"><div class="instructor-name blue-default-font">' + name + '</div><div class="instructor-field ' + map_field_to_class[field] + '">' + field + '</div></div><div class="main-text"> <div class="tab-contents"> </div> <div class="tabs"> <div class="tab-1 item"> <input type="radio" name="resume-tab-' + (i + 1) + '" value="resume" class="resume-tab-1" id="resume-tab-' + (i + 1) + '" checked> <label for="resume-tab-' + (i + 1) + '">رزومه </label> <div class="tab-content-1 resume blue-dark-font">' + resume + '</div></div> <div class="tab-2 item"> <input type="radio" name="resume-tab-' + (i + 1) + '" value="classes" class="resume-tab-2" id="class-tab-' + (i + 1) + '"> <label for="class-tab-' + (i + 1) + '">کلاس ها </label> <div class="tab-content-2 resume"><div class="class-tag ' + map_field_to_class[field] + '-light">آشنایی با ترکیبیات </div></div></div><div class="score item ' + map_field_to_class[field] + '-hover"></div></div></div></div></div>';
                }
                $(".about-page .instructor-feed").html(out);
            } else {
                var notFound = "";
                notFound = "<div class='not-found-message-1'>نتیجه ای یافت نشد <i class='fa fa-frown-o'></i></div>";
                $(".about-page .instructor-feed").html(notFound);
            }
            // $("#console-test").html(result);
        },
        error: function (result) {
        }
    });
}

function extractQuote(str) {
    var i = str.indexOf('$$');
    var j = str.lastIndexOf('$$');
    return [str.substring(i + 2, j), str.substring(0, i) + str.substring(j + 2)];
}

var news_timer = new Timer(update_news, 2000);

$(document).on("mouseover", "section#news-block .left-arrow-container .left-arrow-o i, section#news-block .right-arrow-container .right-arrow-o i", function () {
    $(this).removeClass('gray-light-font');
    $(this).addClass('gray-default-font');
});
$(document).on("mouseout", "section#news-block .left-arrow-container .left-arrow-o i,section#news-block .right-arrow-container .right-arrow-o i", function () {
    $(this).removeClass('gray-default-font');
    $(this).addClass('gray-light-font');
});
$(document).on("click", "section#news-block .right-arrow-container .right-arrow-o i", function () {
    update_news();
});
$(document).on("click", "section#news-block .left-arrow-container .left-arrow-o i", function () {
    update_news_reverse();
});

function getPage(){
    var x = window.location.href.split("/");
    var y = x[x.length - 1].substring(0, x[x.length - 1].lastIndexOf("."));
    return y;
}
function fixClassItemFonts(){
    var x = $(".class-page .directory-explorer .main .item .inner");
    var ind;
    console.log(x.length);
    $.each(x, function (index, value) {
        ind = 1;
        if (parseFloat($(value).css("height")) > parseFloat($(value).parent().css("height")) + 1 && ind < 70){
            $(value).css("font-size", (parseFloat($(value).css("font-size")) - 10) + "px");
            // console.log($(value).html() + " :  " + (parseFloat($(value).css("font-size")) - 5) + "px");
            // console.log(ind);
            ind += 1;
        }
        //debugger;
    });
}
$(document).ready(function () {
    news_timer.start();
    $("#sug-search-instructor-by-course").css("display", "none");
    refreshInstructorFeed({field: "", course: -1, type: ""}, 'set');
    refreshDirs();

    //initializations specific to each page
    var pageName = getPage();
    switch (pageName){
        case "class":
            break;
    }
});
var news_blocked_by_hover = false;
$(document).on("mouseover", "#news-block .news-holder", function () {
    if (news_timer.isRunning){
        news_timer.pause();
        $(this).css("opacity", "0.7");
        news_blocked_by_hover = true;
    }
});
$(document).on("mouseout", "#news-block .news-holder", function () {
    if (news_blocked_by_hover === true){
        news_timer.resume();
        $(this).css("opacity", "1");
        news_blocked_by_hover = false;
    }
});
var resize_cooldown = 300;
var resize_time_store = new Date();
function resize_end() {
    if ((new Date() - resize_time_store) >= resize_cooldown){
        news_timer.start();
        var num_news = $(".news-holder").length;
        for (var i = 0;i < num_news; i += 1){
            $("#news-holder-" + (i + 1)).css('left', (-i * 100) + "%");
        }
    }
}
$(window).resize(function () {
    resize_time_store = new Date();
    news_timer.stop();
    var num_news = $(".news-holder").length;
    for (var i = 0;i < num_news; i += 1){
        $("#news-holder-" + (i + 1)).css('left', (-i * 100) + "%");
        $("#news-holder-" + (i + 1)).stop();
    }
    setTimeout(resize_end, resize_cooldown);
});
var is_login_window_open = false;
$(document).on("click", ".login", function () {
    $(".login-menu").slideToggle(200);
    if (is_login_window_open) {
        $(".login span").removeClass("clicked");
        is_login_window_open = false;
    } else {
        $(".login span").addClass("clicked");
        is_login_window_open = true;
    }
});

$(document).on("change", ".about-page .filter .department .title input.department-checkbox-group", function () {
    if ($(this).is(":checked")){
        $(".about-page .filter .department .checkbox").css("opacity", "1");
        $(".about-page .filter .department .checkbox .item input").removeAttr("disabled");
    } else {
        $(".about-page .filter .department .checkbox").css("opacity", "0.4");
        $(".about-page .filter .department .checkbox .item input").prop("disabled", "disabled");
        $(".about-page .filter .department .checkbox .item input").prop("checked", false);
        filterInstructor.field = [];
        refreshInstructorFeed({field: "", course: -1, type: ""}, 'set');
    }
});
$(document).on("change", ".about-page .filter .type .check-title input", function () {
    if ($(this).is(":checked")){
        $(".about-page .filter .type .checkbox").css("opacity", "1");
        $(".about-page .filter .type .checkbox .item input").removeAttr("disabled");
    } else {
        $(".about-page .filter .type .checkbox").css("opacity", "0.4");
        $(".about-page .filter .type .checkbox .item input").prop("disabled", "disabled");
        $(".about-page .filter .type .checkbox .item input").prop("checked", false);
        filterInstructor.type = [];
        refreshInstructorFeed({field: "", course: -1, type: ""}, 'set');
    }
});

$(document).on("change", ".about-page .filter .course .check-title input", function () {
    if ($(this).is(":checked")){
        $("#search-instructor-by-course").css("opacity", "1");
        $("#search-instructor-by-course").removeAttr("disabled");
    } else {
        $("#search-instructor-by-course").css("opacity", "0.4");
        $("#search-instructor-by-course").prop("disabled", "disabled");
        $("#search-instructor-by-course").prop("value", "");
        filterInstructor.course = -1;
        refreshInstructorFeed({field: "", course: -1, type: ""}, 'set');
    }
});


function search(keyword, haystack, callback, options) {
    var opt = options || {};
    if (haystack && keyword) {
        $.ajax({
            url: "Code/srv_php/utils/search.php",
            type: "POST",
            data: {
                keyword: keyword,
                table: haystack,
                column: opt.column ? opt.column : [],
                exact: opt.exact,
                max_size: opt.max_size ? opt.max_size : -1
            },
            success: function (result) {
                console.log(result);
                callback(result);
            }
        });
    } else {
        return "haystack or keyword not defined";
    }
}

$(document).on("keyup change input paste propertychange", "#search-instructor-by-course", function () {
    var res;
    if ($(this).prop("value").trim() !== ""){
        search($(this).prop("value"), "course",
            searchUser.instructorFilter,
            {
                column: ["name"],
                exact: false,
                max_size: 10
            });
    } else {
        refreshInstructorFeed({field: "", course: -1, type: ""}, 'set');
    }
});
$(document).on("focus", "#search-instructor-by-course", function () {
    $("#sug-search-instructor-by-course").slideDown(200);
});
$(document).on("focusout", "#search-instructor-by-course", function () {
    setTimeout(function () {
        $("#sug-search-instructor-by-course").slideUp(200);
    }, 400);
    refreshInstructorFeed({field: "", course: -1, type: ""}, 'set');
});
// $(document).on("click", "body", function (e) {
// });
$(document).on("click", "#sug-search-instructor-by-course .item", function () {
    var courseId = $(this).find(".identifier")[0].outerHTML;
    var courseName = $(this).html();
    courseName = courseName.substring(0, courseName.indexOf(courseId));
    courseId = $(this).find(".identifier").html();
    $("#search-instructor-by-course").prop("value", courseName);
    refreshInstructorFeed({field: "", course: courseId, type: ""}, 'set');
});

$(document).on("change", ".department-checkbox-item", function () {
    if ($(this).is(":checked")){
        refreshInstructorFeed({field: $(this).next().next().html().trim(), course: -1, type: ""}, 'add');
    } else {
        refreshInstructorFeed({field: $(this).next().next().html().trim(), course: -1, type: ""}, 'remove');
    }
});
$(document).on("change", ".type-checkbox-item", function () {
    if ($(this).is(":checked")){
        refreshInstructorFeed({field: "", course: -1, type: $(this).next().next().html().trim()}, 'add');
    } else {
        refreshInstructorFeed({field: "", course: -1, type: $(this).next().next().html().trim()}, 'remove');
    }
});


$(document).on("click", ".class-page .directory-explorer .main .item", function (e) {
    for (var i = 0; i < currentDirs.length; i += 1){
        if (currentDirs[i].DOMBoxElement === e.target.parentNode){
            console.log(e.target.parentNode);
            console.log(currentDirs);
            changeCurrentDirectories(currentDirs[i]);
        }
    }
});

$(document).on("click", ".class-page .directory-explorer .address .item", function (e) {
    var addrP;
    if (currentDirs.length === 0){
        addrP = nullParentDir;
    } else {
        addrP = currentDirs[0].parentDir;
    }
    while (addrP !== null){
        console.log(e.target);
        if (addrP.DOMAddressElement === e.target){
            changeCurrentDirectories(addrP);
        }
        addrP = addrP.parentDir;
    }
});


function getDirUp(){
    var dirToChange;
    if (currentDirs.length === 0){
        if (nullParentDir === null){
            dirToChange = null;
        } else {
            dirToChange = nullParentDir.parentDir;
        }
    } else if (currentDirs[0].parentDir !== null){
        dirToChange = currentDirs[0].parentDir.parentDir;
    } else {
        dirToChange = null;
    }
    changeCurrentDirectories(dirToChange);
}

$(document).on("click", ".directory-explorer .directory-bar .search .up i", function () {
    getDirUp();
});

$(document).on("keyup", ".directory-explorer .directory-bar .search .inner input", function (e) {
    if (e.target.value.trim() === ""){
        setUpInitialDirs();
    } else {
        if (e.keyCode === 13){
            search(e.target.value, 'course', searchUser.classFilter);
        }
    }
});