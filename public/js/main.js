let servers = {};
let sortingSettings = {
    "name": "desc",
    "distance": "desc"
};
let table = document.querySelector("table");

function isObjectEmpty(obj) {
    for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
            return false;
        }
    }
    return true;
}

function getServers() {
    function makeRequest(url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                try {
                    var data = JSON.parse(xmlhttp.responseText);
                } catch (err) {
                    console.log(err.message + ' in ' + xmlhttp.responseText);
                    return;
                }
                servers = data;
                callback(data);
            } else if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
                console.log('stuff did not go as planned');
                tellTheBadNews('server');
            }
        };

        xmlhttp.open('GET', url, true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.send();
    }

    makeRequest('/servers', function (data) {
        if (data.length > 0 && !(isObjectEmpty(data[0]))) {
            generateTableHead(table, data);
            generateTable(table, data);
            document.getElementById("get-list-button").style.display = "none";
            document.getElementById("sort-name-button").style.display = "flex";
            document.getElementById("sort-dist-button").style.display = "flex";
        } else {
            tellTheBadNews('data');
        }
    });
}

function generateTableHead(table, data) {
    while (table.childElementCount > 0) {
        table.removeChild(table.lastElementChild);
    }
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (key in data[0]) {
        let th = document.createElement("th");
        let textNode = document.createTextNode(key);
        th.appendChild(textNode);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    let tbody = document.createElement("tbody");

    for (let i = 0; i < data.length; i++) {
        let row = tbody.insertRow();
        for (key in data[i]) {
            let cell = row.insertCell();
            let text = document.createTextNode(data[i][key]);
            cell.appendChild(text);
        }
    }
    if (table.childElementCount == 2) {
        table.removeChild(table.lastElementChild);
    }
    table.appendChild(tbody);
}

function sortByName() {
    if (sortingSettings.name == "desc") {
        servers.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        sortingSettings.name = "asc";
        document.getElementById("sort-name-button").innerText = "Sort by name: desc";
    } else {
        servers.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        }).reverse();
        sortingSettings.name = "desc";
        document.getElementById("sort-name-button").innerText = "Sort by name: asc";
    }
    generateTable(table, servers);
}

function sortByDistance() {
    if (sortingSettings.distance == "desc") {
        servers.sort(function (a, b) {
            return (a.distance - b.distance);
        });
        sortingSettings.distance = "asc";
        document.getElementById("sort-dist-button").innerText = "Sort by distance: desc";
    } else {
        servers.sort(function (a, b) {
            return (a.distance - b.distance);
        }).reverse();
        sortingSettings.distance = "desc";
        document.getElementById("sort-dist-button").innerText = "Sort by distance: asc";
    }
    generateTable(table, servers);
}

function tellTheBadNews(typeOfBadNews) {
    if (typeOfBadNews == 'server') {
        let badNews = ["Woooops, something went wrong\n let\'s try that again",
            "Unsuccessful, why don\'t you press me once more?",
            "Things brake and so did this one\n press me again and hope for the best",
            "Hmmmm, nothing happened\n press me to see if it makes a difference",
            "If you're seeing this, someting's broken\n maybe pressing me again will fix it?",
            "Sorry to spill the beans, but that did\'t work... Press me again"
        ];
        document.getElementById("get-list-button").innerText = badNews[Math.round(Math.random() * 5)];
    } else {
        document.getElementById("get-list-button").innerText = "Request successful, but no data arrived\n Nothing to display";
    }
}

let getServButt = document.getElementById("get-list-button");
getServButt.addEventListener("click", function () {
    getServers();
}, false);
let nameSortButt = document.getElementById("sort-name-button");
nameSortButt.addEventListener("click", function () {
    sortByName();
}, false);
let distSortButt = document.getElementById("sort-dist-button");
distSortButt.addEventListener("click", function () {
    sortByDistance();
}, false);
