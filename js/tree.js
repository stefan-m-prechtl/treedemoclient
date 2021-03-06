import { html, render } from './node_modules/lit-html/lit-html.js'


// Einstieg "Main"-Funktion    
document.addEventListener('DOMContentLoaded', async() => {
    main();
});

async function main() {

    // Info-Daten für alle Bäume laden
    let jsonDataTreeInfos = await loadTreeInfos();
    // JSON-Daten in DOM einfügen
    showInfoData(jsonDataTreeInfos);
}


//***** VIEW ***********************************************************

// JQuery like Selektoren
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// JQuery like Eventhandler
Node.prototype.on = function(name, fn) {
    this.addEventListener(name, fn);
    return this;
};
NodeList.prototype.on = NodeList.prototype.on = function(name, fn) {
    this.forEach((elem) => elem.on(name, fn));
    return this;
};

// Array-Methoden bereitstellen
NodeList.prototype.__proto__ = Array.prototype;
HTMLCollection.prototype.__proto__ = Array.prototype;

// Html-Templates für Rendering mit lit-html
const treeTemplate = (treeID, node) => html `
    <p>Baum mit ID ${treeID}</p>
    <ul class="tree" data-id="${treeID}">
    <li><span class="caret" data-id="${node.id}">${node.name} (ID=${node.id})</span>
        <ul class="nested">${node.children.map(childnode => html`<li><span class="caret" data-id="${childnode.id}">${childnode.name} (ID=${childnode.id})</span><ul class="nested"></ul></li>`)}</ul>
    </li>
    </ul>`;

const treeEmptyTemplate = html``;

const treeInfosTemplate = (treeinfos) => html`
  <table class=treeinfo">
  <tr>
    <th>ID</th>
    <th>Name</th>
    <th>Anzahl Knoten</th>
  </tr>
  ${treeinfos.map(info => html`<tr>
    <td><button data-id="${info.id}">Lade ${info.id}</button></td>
    <td>${info.name}</td>
    <td>${info.countNodes}</td>
    </tr>`)}
  </table>`;

const nodeTemplate = (node) => html`
    <li><span class="caret caret-down" data-id="${node.id}">${node.name} (ID=${node.id})</span>
        <ul class="nested active">${node.children.map(childnode => html`<li><span class="caret" data-id="${childnode.id}">${childnode.name} (ID=${childnode.id})</span><ul class="nested"></ul></li>`)}</ul>
    </li>`;



function showInfoData(jsonDataTreeInfos) {
    // JSON-Daten als HTML rendern
    let div = $('#placeholderTreeInfos');
    render(treeInfosTemplate(jsonDataTreeInfos), div);
    // Eventlistener für alle Buttons in Baumübersichtstabelle registieren
    createEventListenerTreeInfos();
}


function showData(treeID, jsonDataTree) {
    // JSON-Daten als HTML rendern
    let div = $('#placeholderTree');
    // (Shadow-)DOM rücksetzen durch Rendern eines anderen Lit-Templates
    render(treeEmptyTemplate, div);
    // Echte Daten rendern
    render(treeTemplate(treeID, jsonDataTree.rootnode), div);
    // Eventlistener für alle Baumknoten registieren
    createEventListenerTree();
}


function createEventListenerTreeInfos() {
    // Event-Listener für alle Buttons registrieren
    let buttons = $$("button");
    buttons.forEach(button => {
        button.on('click', function () {
            handleClickButton(button);
        });
    });
}

function createEventListenerTree() {
    // Event-Listener registrieren
    let carets = $$(".caret");
    carets.forEach(caret => {
        caret.on('click', function () {
            handleClickNode(caret);
        });
    });
}

function createEventListenerNode(nodeID) {
    // Event-Listener registrieren
    let node = $(`span[data-id="${nodeID}"]`).parentElement;
    let carets = node.querySelectorAll('span.caret');
    carets.forEach(caret => {
        caret.on('click', function () {
            handleClickNode(caret);
        });
    });
}

async function handleClickButton(button) {
    let treeID = button.getAttribute('data-id');
    // JSON-Daten laden
    let jsonDataTree = await loadTree(treeID);
    // JSON-Daten in DOM einfügen
    showData(treeID, jsonDataTree);
}

function handleClickNode(caret) {
    let parent = caret.parentElement;
    let ul = parent.querySelector(".nested");
    if (ul.childElementCount === 0) {
        let nodeID = caret.getAttribute('data-id');
        expandNode(nodeID);
    }
    ul.classList.toggle("active");
    caret.classList.toggle("caret-down");
}


async function expandNode(nodeID) {
    // JSON-Daten für Knoten laden
    let treeID = $('.tree').getAttribute('data-id');
    let jsonDataNode = await loadNode(treeID, nodeID);
    // JSON-Daten als HTML in Baum einfügen
    let li = $(`span[data-id="${nodeID}"]`).parentElement;
    render(nodeTemplate(jsonDataNode), li);
    // Event-Listener für Kindknoten registrieren
    createEventListenerNode(nodeID);
}


//***** CONTROLLER  ***********************************************************

async function loadNode(treeID, nodeID) {
    try {
        let response = await fetch(`http://localhost:8080/app/demo/treemgmt/fulltree/${treeID}/node/${nodeID}`);
        let result = await response.json();
        return result;
    }
    catch (err) {
        console.log(`Fehler:${err}`);
    }
}

async function loadTree(treeID) {
    try {
        let response = await fetch(`http://localhost:8080/app/demo/treemgmt/fulltree/${treeID}`);
        //let response = await fetch(`http://localhost:8080/app/demo/treemgmt/fulltree/${treeID}?all=yes`);
        let result = await response.json();
        return result;
    }
    catch (err) {
        console.log(`Fehler:${err}`);
    }
}

async function loadTreeInfos() {
    try {
        let response = await fetch(`http://localhost:8080/app/demo/treemgmt/fulltree`);
        let result = await response.json();
        return result;
    }
    catch (err) {
        console.log(`Fehler:${err}`);
    }
}