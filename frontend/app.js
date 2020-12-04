var cardId = 0;
var lanesDefinition = [];

// Load lanes and cards
function load() {
    getLanes();
}

// Call to get the lanes from API
function getLanes(callback) {
    fetch("/api/LoadLanes")
        .then(
            function (response) {
                response.json().then(function (data) {
                    createLanes(data);
                    getCards();
                });
            },
        )
        .catch(function (err) {
            console.log("Fetch Error :-S", err);
            callback(false, err);
        });
}

// Call to get the cards from API
function getCards(callback) {
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
            callback(false, err);
        });
}

// Call to add a card
function addCard() {
    let titleValue = document.getElementById("title").value;
    let textValue = document.getElementById("text").value;

    var card = {
        id: ++cardId,
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

// Call to patch a card
function updateCard(targetCard, targetLane) {
    var targetCardId = targetCard.id;
    fetch("/api/LoadCard/" + targetCardId)
        .then(
            function (response) {
                response.json().then(function (data) {
                    if (data.length > 0) {
                        var laneIndex = lanesDefinition.findIndex((lane) => lane.tag == targetLane.target.id);
                        data[0].position = laneIndex;
                    }
                    fetch("/api/MovCard/" + targetCardId, {
                        body: JSON.stringify(data[0]),
                        headers: {
                            "Content-Type": "application/json",
                        },
                        method: "PATCH"
                    });
                });
            }
        )
}

// Call to delete a card
function deleteCard(ev) {
    //var Button = ev.target.parentNode;
    var targetCardId = ev.target.parentNode.id;
    fetch("/api/DelCard/" + targetCardId, {
        method: "DELETE"
    });
    //Button.remove();
    getCards();
}

// Function to load the lanes into the HTML
function createLanes(lanes) {
    var parent = document.querySelector("#lanesContainer");
    lanesDefinition = lanes;
    for (var i = 0; i < lanes.length; i++) {
        var lane = `<section id="${lanes[i].tag}" class="card-list"></section>`;
        parent.innerHTML += lane;
    }
}

// Function to load the cards into the HTML
function createCards(cards) {
    var todo = document.querySelector("#todo");
    var inProgress = document.querySelector("#in-progess");
    var done = document.querySelector("#done");

    todo.innerHTML = "<h1>To-Do</h1>";
    inProgress.innerHTML = "<h1>In-Progress</h1>";
    done.innerHTML = "<h1>Done</h1>";

    for (var i = 0; i < cards.length; i++) {
        if (cardId < cards[i].id) {
            cardId = cards[i].id;
        }

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

// Show modal input for adding cards
function showModalInput() {
    let modal = document.getElementById("modal-input");
    modal.style.display = "block";
}

// Close modal input for adding cards
function closeModalInput() {
    let modal = document.getElementById("modal-input");
    modal.style.display = "none";
}

// Add card after input
function crutchCloseAndAdd() {
    if (document.getElementById("title").value.length > 0 && document.getElementById("text").value.length > 0) {
        addCard();
        closeModalInput();
    
        document.getElementById("title").value = '';
        document.getElementById("text").value = '';
    } else {
        alert("Please enter Title and Text!");
    }
}

// Function to add all events
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
                draggedItem.style.display = "flex";
                draggedItem = null;
            }, 0);
        });
    }

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
            if (draggedItem != null) {
                updateCard(draggedItem, e);
                this.append(draggedItem);
                this.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            }
        });
    }
}