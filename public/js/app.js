(function() {
  'use strict';
  let searchButton = document.querySelector('.global-search');

  searchButton.addEventListener('click', function() {
    let isSearch = document
      .querySelector('.main-nav')
      .classList.contains('search-mode');
    if (!isSearch) {
      document.querySelector('.main-nav').classList.add('search-mode');
      document.querySelector('.main-nav .search-input').focus();
    } else {
      document.querySelector('.main-nav').classList.remove('search-mode');
      document.querySelector('.main-nav .search-input').value = null;
    }
  });

  document
    .querySelector('.main-nav .search-input')
    .addEventListener('keydown', function(/** @type {KeyboardEvent}*/ evt) {
      if (evt.keyCode === 27 /* esc */) {
        document.querySelector('.main-nav').classList.remove('search-mode');
        evt.target.value = null;
      }
    });
})();
