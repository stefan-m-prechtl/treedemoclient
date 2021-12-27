const $ = document.querySelector.bind(document)

function init() {

    let toggler = document.getElementsByClassName("caret");
    let i;

    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            if (this.parentElement.querySelector(".nested") != null) {
                this.parentElement.querySelector(".nested").classList.toggle("active");
            }
            else {

                let nodeID = this.getAttribute('data-id');
                console.log(nodeID);

            }
            this.classList.toggle("caret-down");
        });
    }
}

async function loadData() {
    //await fetch('data/bigtree.json')
    await fetch('http://localhost:8080/app/demo/treemgmt/fulltree/35')
        .then(function (response) {
            return response.json();
        })
        .then(result => {
            let htmlTemplate = convertJsonToTableView(result);
            let div = document.querySelector('#placeholderTree')
            div.innerHTML = htmlTemplate;
        })

        .catch(err => console.log(err));
}

function convertJsonToTableView(tree) {

    let result = '';
    let nodeStack = [];
    let closingTagsStack = [];
    let previousLevel = 0;

    result = '<ul id="Baum">';
    nodeStack.push(tree.rootnode);

    while (nodeStack.length > 0) {
        let node = nodeStack.pop();
        let children = node.children;

        if (children.length == 0) {
            // result += '<li>' + node.name + '(' + node.level + ')</li>';
            result += '<li><span class="caret" data-id="' + node.id + '">' + node.name + '(' + node.id + ')</span></li>';
        }

        if (node.level < previousLevel) {
            let diff = previousLevel - node.level;
            for (let i = 0; i < diff; i++) {
                result += closingTagsStack.pop();
                result += closingTagsStack.pop();
            }
        }

        if (children.length > 0) {
            result += '<li><span class="caret" data-id="' + node.id + '">' + node.name + '(' + node.id + ')</span><ul class="nested">';
            closingTagsStack.push('</li>');
            closingTagsStack.push('</ul>');
        }

        previousLevel = node.level;
        while (children.length > 0) {
            let child = children.pop()
            nodeStack.push(child);
        }
    }

    while (closingTagsStack.length > 0) {
        result += closingTagsStack.pop();
    }

    result += '</ul>';
    return result;
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    init();
});