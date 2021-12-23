'use strict';

const fs = require('fs');

async function loadJsonData(file) {
    let fileData = fs.readFileSync(file);
    let tree = JSON.parse(fileData);
    return tree;
}

function printPreOrder(tree) {
    let nodeStack = [];
    let closingTagsStack = [];
    let previousLevel = 0;


    console.log('<ul id="Baum">');

    nodeStack.push(tree.rootnode);


    while (nodeStack.length > 0) {
        let node = nodeStack.pop();
        let children = node.children;

        if (children.length == 0) {
            console.log('<li>' + node.name + '(' + node.level + ')</li>');
        }

        if (node.level < previousLevel) {
            let diff = previousLevel - node.level;
            for (let i = 0; i < diff; i++) {
                console.log(closingTagsStack.pop());
                console.log(closingTagsStack.pop());
            }
        }

        if (children.length > 0) {
            console.log('<li><span class="caret">' + node.name + '(' + node.level + ')</span><ul class="nested">');
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
        console.log(closingTagsStack.pop());

    }

    console.log('</ul>');
}



async function main() {
    console.log('Lade Baum....');
    //let tree = await loadJsonData('w3ctree.json')
    //let tree = await loadJsonData('data/smalltree.json')
    //let tree = await loadJsonData('data/midtree.json')
    let tree = await loadJsonData('data/bigtree.json')
    printPreOrder(tree);
    console.log('..fertig!');
}

main();