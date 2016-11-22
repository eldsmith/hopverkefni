(function(){

  /* Modal settings */
  var loginBtn = document.getElementsByClassName('login-button')[0];
  var modals = document.getElementsByClassName('modal');
  var loginModal = document.getElementsByClassName('login-modal')[0];

  //Add close functionality to all modals
  for(var i=0; i < modals.length; i++){
    var modal = modals[i];
    var closeBtn = modal.getElementsByClassName('modal-close')[0];
    var modalBackground = modal.getElementsByClassName('modal-background')[0];

    closeBtn.addEventListener('click', function(){
      modal.classList.remove('is-active');
    });

    modalBackground.addEventListener('click', function(){
      modal.classList.remove('is-active');
    });
  }

  loginBtn.addEventListener('click', function(){
    loginModal.classList.add('is-active');
  });
  /**/
})();
