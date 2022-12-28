var shareImageButton = document.querySelector("#share-image-button");
var createPostArea = document.querySelector("#create-post");
var closeCreatePostModalButton = document.querySelector(
  "#close-create-post-modal-btn"
);
var sharedMomentsArea = document.querySelector("#shared-moments");
var form = document.querySelector("form");
var titleInput = document.querySelector("#title");
var locationInput = document.querySelector("#location");
function openCreatePostModal() {
  createPostArea.style.display = "block";
  if (eventPrompt) {
    eventPrompt.prompt();
    eventPrompt.userChoice.then(function (choiceResult) {
      console.log(choiceResult.outcome);
      if (choiceResult.outcome === "dismissed") {
        console.log("user canceled installation");
      } else {
        console.log("user add application to home screen");
      }
      eventPrompt = null;
    });
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = "none";
}

shareImageButton.addEventListener("click", openCreatePostModal);

closeCreatePostModalButton.addEventListener("click", closeCreatePostModal);

function onSaveButtonClicked() {
  if ("caches" in window) {
    caches.open("entered-user").then(function (cache) {
      cache.add("http://localhost:5000/api/v1/alljobs");
    });
  }
}

function createCard(data) {
  console.log(data);
  var cardWrapper = document.createElement("div");
  cardWrapper.className = "shared-moment-card mdl-card mdl-shadow--2dp";
  var cardTitle = document.createElement("div");
  cardTitle.className = "mdl-card__title";
  cardTitle.style.backgroundImage = "url(" + data.image + ")";
  cardTitle.style.backgroundSize = "cover";
  cardTitle.style.height = "180px";
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement("h2");
  cardTitleTextElement.style.color = "white";
  cardTitleTextElement.className = "mdl-card__title-text";
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement("div");
  cardSupportingText.className = "mdl-card__supporting-text";
  cardSupportingText.textContent = data.title;
  cardSupportingText.style.textAlign = "center";
  var cardSaveButton = document.createElement("button");
  cardSaveButton.textContent = "Save";
  cardSaveButton.addEventListener("click", onSaveButtonClicked);
  cardSupportingText.appendChild(cardSaveButton);
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

// function clearCard(){
//     while(sharedMomentsArea.hasChildNodes()){
//     sharedMomentsArea.removeChild(sharedMomentsArea.lastChild)
//   }
// }

function sendData(dt) {
  fetch("http://localhost:5000/api/v1/job/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      id: new Date().toISOString,
      title: dt.title,
      address: dt.location,
      image: "http://localhost:3000/images/sf-boat.jpg",
      email: "rezaee123@gmail.com",
      industry: "Programing",
      salary: 8000,
      description: "hi this is a test",
    }),
  }).then(function (res) {
    console.log("sent Data!", res);
  });
}

function updateUI(data) {
  // clearCard();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}

var url = "http://localhost:5000/api/v1/alljobs";
var networkReceived = false;

fetch(url)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    networkReceived = true;
    console.log("received from web", data);
    var dataArray = [];
    for (var key in data.data) {
      dataArray.push(data.data[key]);
    }
    updateUI(dataArray);
  });
if ("indexedDB" in window) {
  readAllData("posts").then(function (data) {
    if (!networkReceived) {
      console.log("received from indexedDB", data);
      updateUI(data);
    }
  });
}

// submit post

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (titleInput.value.trim() === "" || locationInput.value.trim() === "") {
    alert("Please enter valid Data!");
    return;
  }
  closeCreatePostModal();
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then(function (sw) {
      var post = {
        id: new Date().toISOString(),
        title: titleInput.value,
        location: locationInput.value,
        image: "http://localhost:3000/images/sf-boat.jpg",
        email: "rezaee123@gmail.com",
        industry: "Programing",
        salary: 8000,
        description: "hi this is a test",
      };
      writeData("sync-posts", post)
        .then(function () {
          return sw.sync.register("sync-new-post");
        })
        .then(function () {
          var snackbarContainer = document.querySelector("#confirmation-toast");
          var data = { message: "Your post was saved for syncing" };
          snackbarContainer.MaterialSnackbar.showSnackbar(data);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  } else {
    console.log(post)
    sendData(post);
  }
});
