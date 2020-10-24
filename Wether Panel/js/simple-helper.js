var Helper = {};

Helper.getValue = function (tag) {
    //alert("in Helper.getValue tag= " + tag);
    return document.getElementById(tag).value;
};

Helper.setValue = function (tag, val) {
    document.getElementById(tag).value = val;
};

Helper.setHtml = function (tag, val) {
    document.getElementById(tag).innerHTML = val;
};

Helper.getHtml = function (tag) {
    return document.getElementById(tag).innerHTML;
};

Helper.onClick = function (tag, action) {
    //alert('onClick\ntag:' + tag + '\naction: ' + action);
    document.getElementById(tag).addEventListener("click", action);
};

Helper.onClassClick = function (class_name, action) {
    var classes = document.getElementsByClassName(class_name);
    for (var i = 0; i < classes.length; ++i) {
        classes[i].addEventListener("click", action);
    }
};

Helper.setDisplay = function (tag, val) {
    if (val) {
        document.getElementById(tag).style.display = "block";
    } else {
        document.getElementById(tag).style.display = "none";
    }
};

Helper.getDisplay = function (tag) {
    return document.getElementById(tag).style.display;
};

Helper.focus = function (tag) {
    document.getElementById(tag).focus();
};

Helper.keyUp = function (tag, action) {
    alert("onKeyPress tag: " + tag + ",\n action: " + action);
    document.getElementById(tag).addEventListener("keyup", action);
};

Helper.onChange = function (tag, action) {
    document.getElementById(tag).addEventListener("onChange", action);
};
