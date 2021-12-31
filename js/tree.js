import { html, render } from './node_modules/lit-html/lit-html.js'

// JQuery like Selektoren
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// JQuery like Eventhandler
Node.prototype.on = function (name, fn) {
    this.addEventListener(name, fn);
    return this;
};
NodeList.prototype.on = NodeList.prototype.on = function (name, fn) {
    this.forEach((elem) => elem.on(name, fn));
    return this;
};

// Array-Methoden bereitstellen
NodeList.prototype.__proto__ = Array.prototype;
HTMLCollection.prototype.__proto__ = Array.prototype;

// Html-Template für Rendering mit lit-html
const treeTemplate = (node) => html`
    <ul id="Baum">
    <li><span class="caret" data-id="${node.id}">${node.name} (${node.id})</span>
        <ul class="nested">${node.children.map(childnode => html`<li><span class="caret" data-id="${childnode.id}">${childnode.name} (${childnode.id})</span><ul class="nested"></ul></li>`)}</ul>
    </li>
    </ul>`;

document.addEventListener('DOMContentLoaded', async () => {
    let treeID = 35
    main(treeID);
});

async function main(treeID) {
    // JSON-Daten laden
    let jsonDataTree = await loadTree(treeID);
    showData(jsonDataTree);

}

function showData(jsonDataTree) {
    // HTML rendern
    let div = $('#placeholderTree');
    render(treeTemplate(jsonDataTree.rootnode), div);
    createEventListenerTree();

}

function createEventListenerTree() {
    // Event-Listener registrieren
    let carets = $$(".caret");
    carets.forEach(caret => {
        caret.on('click', () => {
            let parent = caret.parentElement;
            let ul = parent.querySelector(".nested");
            ul.classList.toggle("active");
            caret.classList.toggle("caret-down");
        });
    });
}

async function loadTree(treeID) {
    try {
        let response = await fetch(`http://localhost:8080/app/demo/treemgmt/fulltree/${treeID}`);
        let result = await response.json();
        return result;
    }
    catch (err) {
        console.log(`Fehler:${err}`);
    }

}