class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  // Add this method to validate input
  validateInput() {
    const inputField = this._parentEl.querySelector('.search__field');
    inputField.addEventListener('input', function () {
      const invalidCharacters = /[^a-zA-Z0-9 ]/g; // Adjust regex as needed
      if (invalidCharacters.test(inputField.value)) {
        inputField.value = '';
        alert('Special characters are not allowed.');
      }
    });
  }
}

const searchView = new SearchView();
export default searchView;

// Call validateInput method in init or addHandlerSearch
const init = function () {
  searchView.validateInput();
};
init();

// Attach to window for testing purposes
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  window.searchView = searchView;
}
