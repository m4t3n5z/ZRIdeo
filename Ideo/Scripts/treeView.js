$.ajax({
    type: "GET",
    url: "GetRoot",
    contentType: "application/json",
    success: function (result) {
        var folder = createFolder(result);
        document.getElementById("root").appendChild(folder);
        refresh();
    }
});

function createFolder(node) {
    var li = document.createElement("LI");
    li.id = node.Id;
    li.className = "tree-item-folder";
    li.draggable = true;

    var dh = document.createElement("DIV");
    dh.className = "tree-item-header";

    var d = document.createElement("DIV");
    d.className = "tree-item-show-icon";
    dh.appendChild(d);

    d = document.createElement("DIV");
    d.className = "tree-item-folder-icon";
    dh.appendChild(d);

    d = document.createElement("DIV");
    d.className = "tree-item-name";
    d.textContent = node.Name;
    dh.appendChild(d);

    d = document.createElement("DIV");
    d.className = "tree-item-add-folder-icon";
    dh.appendChild(d);

    d = document.createElement("DIV");
    d.className = "tree-item-add-file-icon";
    dh.appendChild(d);

    d = document.createElement("DIV");
    d.className = "tree-item-remove-icon";
    dh.appendChild(d);

    li.appendChild(dh);

    var ul = document.createElement("UL");
    ul.style.display = "none";
    li.appendChild(ul);

    return li;
}

function createFile(node) {
    var li = document.createElement("LI");
    li.id = node.Id;
    li.className = "tree-item-file";
    li.draggable = true;

    var dh = document.createElement("DIV");
    dh.className = "tree-item-header";

    d = document.createElement("DIV");
    d.className = "tree-item-file-icon";
    dh.appendChild(d);

    d = document.createElement("DIV");
    d.className = "tree-item-name";
    d.textContent = node.Name;
    dh.appendChild(d);

    d = document.createElement("DIV");
    d.className = "tree-item-remove-icon";
    dh.appendChild(d);

    li.appendChild(dh);

    var ul = document.createElement("UL");
    li.appendChild(ul);

    return li;
}

var sourceElement = null;

function dragStart(e) {
    sourceElement = this;
}

function dragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
}

//TODO: drop parent to child Exception
var temp2;
function drop(e) {
    if (sourceElement == null) {
        return;
    }

    temp2 = sourceElement;
    sourceElement = null;

    if (sourceElement != this) {
        temp = this;
        if (this.nodeName == "LI") {
            if (temp.className == "tree-item-folder" || temp.className == "tree-item-file") {
                $.ajax({
                    type: "GET",
                    url: "ChangeParent",
                    data: "Id=" + temp2.id + "&NewParentId=" + temp.id,
                    contentType: "application/json",
                    success: function () {
                        temp2.parentNode.removeChild(temp2);
                        var dropHTML = temp2.outerHTML;

                        if (temp.className == "tree-item-folder") {
                            for (var i = 0; i < temp.children.length; i++) {
                                if (temp.children[i].nodeName == "UL") {
                                    temp.children[i].insertAdjacentHTML('beforeend', dropHTML);
                                    break;
                                }
                            }
                        }
                        else {
                            temp.insertAdjacentHTML('afterend', dropHTML);
                        }

                        refresh();
                    }
                });
            }
        }
    }
}

function addHandlers(element) {
    element.addEventListener('dragstart', dragStart, true);
    element.addEventListener('dragover', dragOver, false);
    element.addEventListener('drop', drop, false);
}

function removeHandlers(element) {
    element.removeEventListener('dragstart', dragStart, true);
    element.removeEventListener('dragover', dragOver, false);
    element.removeEventListener('drop', drop, false);
}

var temp;
function hideUnhide() {
    temp = this;
    for (var i = 0; i < this.parentNode.parentNode.children.length; i++) {
        if (this.parentNode.parentNode.children[i].nodeName == "UL") {
            if (this.parentNode.parentNode.children[i].style.display == "none") {
                if (this.parentNode.parentNode.children[i].children.length == 0) {
                    par = this;
                    $.ajax({
                        type: "GET",
                        url: "GetChildrenOf",
                        data: "Id=" + this.parentNode.parentNode.id,
                        contentType: "application/json",
                        success: function (result) {

                            result.forEach(function (node) {
                                var v;
                                if (node.IsFolder == true) {
                                    v = createFolder(node);
                                }
                                else {
                                    v = createFile(node);
                                }

                                temp.parentNode.parentNode.children[i].appendChild(v);
                            });

                            refresh();
                        }
                    });
                }
                this.parentNode.parentNode.children[i].style.display = "block";
                this.className = "tree-item-hide-icon";
            }
            else {
                this.parentNode.parentNode.children[i].style.display = "none";
                this.className = "tree-item-show-icon";
            }
            return;
        }
    }
}

function remove() {
    temp = this.parentNode.parentNode;

    $.ajax({
        type: "GET",
        url: "RemoveNode",
        data: "Id=" + temp.id,
        contentType: "application/json",
        success: function (result) {
            temp.parentNode.removeChild(temp);
        }
    });
}

function addFolder(node) {

    var name = prompt("Please enter folder name");

    temp = this;
    $.ajax({
        type: "POST",
        url: "AddNode",
        data: JSON.stringify({ Name: name, Parent: temp.parentNode.parentNode.id, IsFolder: true }),
        contentType: "application/json",
        success: function (result) {
            var folder = createFolder(result);
            var name1 = prompt("Please enter folder name");
            for (var i = 0; i < temp.parentNode.parentNode.children.length; i++) {
                if (temp.parentNode.parentNode.children[i].nodeName == "UL") {
                    temp.parentNode.parentNode.children[i].appendChild(folder);
                    break;
                }
            }
            var folder = createFolder(result);
            refresh();
        }
    });
}

function addFile(node) {

    var name = prompt("Please enter file name");

    temp = this;
    $.ajax({
        type: "POST",
        url: "AddNode",
        data: JSON.stringify({ Name: name, Parent: temp.parentNode.parentNode.id, IsFolder: false }),
        contentType: "application/json",
        success: function (result) {
            var file = createFile(result);

            for (var i = 0; i < temp.parentNode.parentNode.children.length; i++) {
                if (temp.parentNode.parentNode.children[i].nodeName == "UL") {
                    temp.parentNode.parentNode.children[i].appendChild(file);
                    break;
                }
            }

            refresh();
        }
    });
}

function refresh() {
    var v = document.querySelectorAll("li");
    for (var i = 0; i < v.length; i++) {
        removeHandlers(v[i]);
        addHandlers(v[i]);
    }

    v = document.querySelectorAll(".tree-item-hide-icon");
    for (var i = 0; i < v.length; i++) {
        v[i].removeEventListener('click', hideUnhide);
        v[i].addEventListener('click', hideUnhide);
    }

    v = document.querySelectorAll(".tree-item-show-icon");
    for (var i = 0; i < v.length; i++) {
        v[i].removeEventListener('click', hideUnhide);
        v[i].addEventListener('click', hideUnhide);
    }

    v = document.querySelectorAll(".tree-item-remove-icon");
    for (var i = 0; i < v.length; i++) {
        v[i].removeEventListener('click', remove);
        v[i].addEventListener('click', remove);
    }

    v = document.querySelectorAll(".tree-item-add-folder-icon");
    for (var i = 0; i < v.length; i++) {
        v[i].removeEventListener('click', addFolder);
        v[i].addEventListener('click', addFolder);
    }

    v = document.querySelectorAll(".tree-item-add-file-icon");
    for (var i = 0; i < v.length; i++) {
        v[i].removeEventListener('click', addFile);
        v[i].addEventListener('click', addFile);
    }

    v = document.querySelectorAll(".tree-item-name");
    for (var i = 0; i < v.length; i++) {
        v[i].removeEventListener('dblclick', ChangeName);
        v[i].addEventListener('dblclick', ChangeName);
    }
}

function ChangeName() {
    var newName = prompt("Enter new name");

    if (newName.length == 0) {
        return;
    }

    temp = this;
    $.ajax({
        type: "GET",
        url: "ChangeName",
        data: "Id=" + temp.parentNode.parentNode.id + "&NewName=" + newName,
        contentType: "application/json",
        success: function (result) {
            temp.textContent = newName;
        }
    })
}

refresh();

