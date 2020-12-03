var cardId = 0;

function showModalInput() {
    let modal = document.getElementById("modal-input");
    modal.style.display="block";
}

function closeModalInput(){
    let modal = document.getElementById("modal-input");
    modal.style.display="none";
}

function load() {
    document.querySelector("#add").addEventListener("click", addCard);
    getLanes();
    getCards();
}

function crutchCloseAndAdd() {
    addCard();
    closeModalInput();

    document.getElementById("title").value='';
    document.getElementById("text").value='';
}



function addEvents() {
    const listItems = document.querySelectorAll(".card");
    const lists = document.querySelectorAll(".card-list");

    let draggedItem = null;

    for (let i = 0; i < listItems.length; i++) {
        const item = listItems[i];

        item.addEventListener("dragstart", function () {
            draggedItem = item;
            setTimeout(function () {
                item.style.display = "none";
            }, 0);
        });

        item.addEventListener("dragend", function () {
            setTimeout(function () {
                draggedItem.style.display = "block";
                draggedItem = null;
            }, 0);
        });

        for (let j = 0; j < lists.length; j++) {
            const list = lists[j];

            list.addEventListener("dragover", function (e) {
                e.preventDefault();
                this.style.backgroundColor = "#cc6633";
            });

            list.addEventListener("dragenter", function (e) {
                e.preventDefault();
                this.style.backgroundColor = "#323234";
            });

            list.addEventListener("dragleave", function (e) {
                this.style.backgroundColor = "#212121";
            });

            list.addEventListener("drop", function (e) {
                console.log("drop");
                this.append(draggedItem);
                this.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            });
        }
    }
}

function getLanes() {
    fetch("/api/LoadLanes")
        .then(
            function (response) {
                response.json().then(function (data) {
                    createLanes(data);
                });
            },
        )
        .catch(function (err) {
            console.log("Fetch Error :-S", err);
        });
}

function getCards() {
    fetch("/api/LoadCards")
        .then(
            function (response) {
                response.json().then(function (data) {
                    createCards(data);
                    addEvents();
                });
            },
        )
        .catch(function (err) {
            console.log("Fetch Error :-S", err);
        });
}

function createLanes(lanes) {
    var parent = document.querySelector("#lanesContainer");
    for (var i = 0; i < lanes.length; i++) {
        var lane = `<section id="${lanes[i].tag}" class="card-list"></section>`;

        parent.innerHTML += lane;
    }
}

function createCards(cards) {
    var todo = document.querySelector("#todo");
    var inProgress = document.querySelector("#in-progess");
    var done = document.querySelector("#done");

    todo.innerHTML = "<h1>To-Do</h1>";
    inProgress.innerHTML = "<h1>In-Progress</h1>";
    done.innerHTML = "<h1>Done</h1>";

    for (var i = 0; i < cards.length; i++) {
        var card = `<article class="card" draggable="true" id="${cards[i].id}">
                        <header class="card-header">
                            <h2>${cards[i].title}</h2>
                            <p>${cards[i].text}</p>
                        </header>
                        <button class="delete-btn" onclick="deleteCard(event)">❌</button>
                    </article>`;
        if (cards[i].position == 1) { // In Progress
            inProgress.innerHTML += card;

        } else if (cards[i].position == 2) { // Done  
            done.innerHTML += card;

        } else { // To Do
            todo.innerHTML += card;
        }
    }
}

function addCard() {
    cardId++;
    let titleValue = document.getElementById("title").value;
    let textValue = document.getElementById("text").value;

    var card = {
        id: cardId,
        title: titleValue,
        text: textValue,
        position: 0,
    };

    fetch("/api/AddCard", {
        body: JSON.stringify(card),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    });

    getCards();
}

function deleteCard(ev) {
    var Button = ev.target.parentNode;
    var BtnId = ev.target.parentNode.id;
    fetch("/api/DelCard/" + BtnId, {
        method: "DELETE"
    });
    getCards();
    return Button.remove();
}
