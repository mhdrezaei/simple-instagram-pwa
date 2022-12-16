var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if(eventPrompt){
    eventPrompt.prompt();
    eventPrompt.userChoice.then(function(choiceResult){
      console.log(choiceResult.outcome)
      if(choiceResult.outcome === 'dismissed'){
        console.log('user canceled installation')
      }else{
        console.log('user add application to home screen')
      }
      eventPrompt = null;
    })
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
