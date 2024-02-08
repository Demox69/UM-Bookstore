//const textbooks = JSON.parse(localStorage.getItem("textbooks"));
console.log(textbooks);
// sign out alert
document.getElementById("Sign-Out").addEventListener('click',() =>{
  localStorage.removeItem("currentUser");
  localStorage.removeItem('cartItems');
  localStorage.removeItem('tree');
  window.location.href = "../index.html"
});

document.querySelector('.search-left-container').addEventListener('click', function(){
  window.location.href = "search.html";
});

document.querySelector('.tree-left-container').addEventListener('click', function(){
  window.location.href = "../tree-struct/tree.html";
});

document.querySelector('.account-left-container').addEventListener('click', function(){
  window.location.href = "../account/account.html";
});

// Filters and suggests books based on user input

const searchInput = document.querySelector('.search-bar');
const suggestionsList = document.getElementById('suggestions');

var userEmail = localStorage.getItem("currentUser");
if (userEmail == null) {
  userEmail = "user@example.com"
}
var currentUser = JSON.parse(localStorage.getItem(userEmail));
document.getElementById("welcome-text").innerText = "Hello" + ", " + currentUser.username;

searchInput.addEventListener('input', function () {
  const inputValue = searchInput.value.toLowerCase();

  if (inputValue === '') {
    suggestionsList.style.display = 'none';
    return;
  }

  const suggestions = Object.values(textbooks)
    .filter((book) => {
      const titleWords = book.Title.toLowerCase().split(' ');
      const authorNames = book.Author.toLowerCase().split(' ');

      return (
        titleWords.some((word) => word === inputValue) ||
        titleWords.some((word) => word.startsWith(inputValue)) ||
        authorNames.some((name) => name === inputValue)
        
      );
    })
    .sort((a, b) => {
      const aStartsWith = a.Title.toLowerCase().startsWith(inputValue);
      const bStartsWith = b.Title.toLowerCase().startsWith(inputValue);

      if (aStartsWith && !bStartsWith) {
        return -1;
      } else if (!aStartsWith && bStartsWith) {
        return 1;
      } else {
        return 0;
      }
    });

  displaySuggestions(suggestions);
});

var bookToSearch = {};
function displaySuggestions(suggestions) {
  suggestionsList.innerHTML = '';

  if (suggestions.length === 0) {
    suggestionsList.style.display = 'none';
    return;
  }

  suggestions.forEach((book) => {
    const suggestionItem = document.createElement('li');
    suggestionItem.classList.add('suggestion');
    suggestionItem.textContent = `${book.Title} - ${book.Price}`;
    suggestionItem.addEventListener('click', function () {
      searchInput.value = `${book.Title}`;
      bookToSearch = book;
      suggestionsList.style.display = 'none';
    });

    suggestionsList.appendChild(suggestionItem);
  });

  suggestionsList.style.display = 'block';
}

document.addEventListener('click', function (event) {
  if (!event.target.closest('.search-container')) {
    suggestionsList.style.display = 'none';
  }
});

document.getElementById("search-button").addEventListener('click', setQuery);

function setQuery() {
  localStorage.setItem("queryID", bookToSearch['ID']);

  var book = textbooks[bookToSearch['ID']]

  if(book == null) {
      let confirmUser = confirm("Book not found, feel free to explore");
      if(confirmUser){
        localStorage.removeItem("tree");
        window.location.href = '../tree-struct/tree.html';
      }
      return;
  }
  var departmentID = book["DepartmentID"]

  constructTree(departmentID)
  window.location.href = "../tree-struct/tree.html";
}

function constructTree(departmentID) {
  localStorage.removeItem("tree");
  var newRoot = JSON.parse(JSON.stringify(departments[departmentID]));
  for (let i = 0; i < newRoot.children.length; i++) {
    var yearID = newRoot.children[i]
    var yearInfo = JSON.parse(JSON.stringify(years[yearID]));
    for (let j = 0; j < yearInfo.children.length; j++) {
      var courseID = yearInfo.children[j];
      var courseInfo = JSON.parse(JSON.stringify(courses[courseID]));
      for (let k = 0; k < courseInfo.children.length; k++) {
        var bookID = courseInfo.children[k];
        var bookInfo = JSON.parse(JSON.stringify(textbooks[bookID]));
        bookInfo.Name = bookInfo.Title;
        courseInfo.children[k] = bookInfo;
      }
      yearInfo.children[j] = courseInfo;
    }
    newRoot.children[i] = yearInfo
  }
  localStorage.setItem("tree", JSON.stringify(newRoot));
}

