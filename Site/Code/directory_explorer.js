function Directory(){
    this.parentDir = null;
    this.childrenDir = [];
    this.DOMBoxElement = null;
    this.DOMAddressElement = null;
    this.createDOMElements = function (label) {
        var box = document.createElement("div");
        var address = document.createElement("div");
        $(box).addClass("item");
        $(box).html("<div class='inner blue-sharp'>" + label + "</div>");
        $(box).css("opacity", "0");
        $(address).addClass('item');
        $(address).addClass('blue-sharp');
        $(address).html(label + '<div class="dummy"></div><div class="flash"></div>');
        this.DOMBoxElement = box;
        this.DOMAddressElement = address;
    };

    this.setParent = function(parentDir){
        this.parentDir = parentDir;
    };

    this.addChild = function (childDir) {
        this.childrenDir.push(childDir);
    };
    this.initDir = function(parentDir, label) {
        this.parentDir = parentDir;
        this.createDOMElements(label);
    };
    this.appear = function(delay){
        if (delay === undefined){
            $(this.DOMBoxElement).css("opacity", "1");
        } else {
            $(this.DOMBoxElement).fadeIn(delay);
        }
    };
    this.getLabel = function () {
        return $(this.DOMBoxElement).find(".inner").html().trim();
    };
    this.fetchClasses = function(){
        var x;
        this.childrenDir = [];
        $.ajax({
            url: "Code/srv_php/Class/get_classes.php",
            data: {
                data0: this.parentDir.getLabel(),
                data1: this.getLabel()
            },
            context: this,
            type: "POST",
            dataType: 'JSON',
            success: function (result) {
                if (result.length > 0){
                    for (var i = 0; i < result.length; i += 1){
                        x = new ItemFile();
                        x.initDir(this, result[i]['id'], result[i]['name']);
                        this.childrenDir.push(x);
                    }
                }
            },
            error: function (result) {
                console.log(result.responseText);
            }
        });
    };
    // var getObject = function(element, scope){
    //     for (var i = 0; i < scope.length; i += 1){
    //         if (scope[i].DOMBoxElement === element){
    //             return scope[i];
    //         }
    //     }
    // }
    this.setAddressBar = function(scope){
        var dirP = this;
        scope.innerHTML = "";
        while (dirP !== null){
            scope.prepend(dirP.DOMAddressElement);
            dirP = dirP.parentDir;
        }
    }
}

function ItemFile(){
    this.parentDir = null;
    this.classId = -1;
    this.DOMBoxElement = null;
    this.setClass = function(classId){
        this.classId = classId;
    };
    this.createDOMElements = function (label) {
        var box = document.createElement("div");
        $(box).addClass("item");
        $(box).html("<div class='data' style='display: none;'>" + this.classId + "</div><div class='inner blue-sharp'>" + label + "</div>");
        $(box).css("opacity", "0");
        this.DOMBoxElement = box;
    };

    this.setParent = function(parentDir){
        this.parentDir = parentDir;
    };

    this.initDir = function(parentDir, classId, label) {
        this.parentDir = parentDir;
        this.setClass(classId);
        this.createDOMElements(label);
    };
    this.appear = function(delay){
        if (delay === undefined){
            $(this.DOMBoxElement).css("opacity", "1");
        } else {
            $(this.DOMBoxElement).fadeIn(delay);
        }
    }
}
