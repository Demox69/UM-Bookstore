document.getElementById("Sign-Out").addEventListener('click',() =>{
    localStorage.removeItem("currentUser");
    localStorage.removeItem('cartItems');
    localStorage.removeItem('tree');
    window.location.href = "../index.html"
  });

  document.querySelector('.search-left-container').addEventListener('click', function(){
    window.location.href = "../search-files/search.html";
  });
  
  document.querySelector('.tree-left-container').addEventListener('click', function(){
    window.location.href = "../tree-struct/tree.html";
  });
  
  document.querySelector('.account-left-container').addEventListener('click', function(){
    window.location.href = "../account/account.html";
  });

var userEmail = localStorage.getItem("currentUser");
if (userEmail == null) {
  userEmail = "user@example.com"
}
var currentUser = JSON.parse(localStorage.getItem(userEmail));



document.getElementById("username").value = currentUser.username;
document.getElementById("gender").value  = currentUser.gender;
document.getElementById("dateofbirth").value  = currentUser.DOB;
document.getElementById("welcome-text").innerText = "Hello" + ", " + currentUser.username;
constructBookList();

document.getElementById("profile-button").addEventListener("click", () => {updateProfile();});
document.getElementById("password-button").addEventListener("click",() => {updatePassword();});
document.getElementById("sort").addEventListener("change", () => {constructBookList();})
document.getElementById("sort").addEventListener("click", () => {constructBookList();})

function updateProfile()
{
  currentUser.username = document.getElementById("username").value;
  currentUser.gender = document.getElementById("gender").value;
  currentUser.DOB = document.getElementById("dateofbirth").value;
  console.log("profile updated");
  alert("Profile Update");
  localStorage.setItem(userEmail, JSON.stringify(currentUser));
}

function updatePassword()
{
  var currentPassword = document.getElementById("currentPassword").value;
  var newPassword = document.getElementById("newPassword").value;
  var newPasswordConfirm = document.getElementById("newPasswordConfirm").value;

  var confirmChange = confirm("Are you sure you want to change your password?");
  if (!confirmChange) {
    return; // Stop the function if the user cancels
  }
  
  if(currentPassword !== currentUser.password)
  {
    document.getElementById("error-password").innerText = "Wrong current password";
    return;
  }
  if(newPassword.length < 12)
  {
    document.getElementById("error-password").innerText = "New password must have length >= 12";
    return;
  }
  if(newPassword !== newPasswordConfirm)
  {
    document.getElementById("error-password").innerText = "New password and verification doesn't match";
    return;
  }
  document.getElementById("error-password").innerText = ""
  currentUser.password = newPassword;
  alert("Password Update");
  localStorage.setItem(userEmail, JSON.stringify(currentUser));
  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("newPasswordConfirm").value = "";
}

function constructBookList()
{
  var filterOption = document.getElementById("sort").value;
  console.log(currentUser.bookList);
  var bookList = [];
  if (filterOption == 1)
  {
    bookList = Object.values(currentUser.bookList).sort(sortRating);
  }
  else if(filterOption == 2)
  {
    bookList = Object.values(currentUser.bookList).sort(sortRatingReverse);
  }
  else if(filterOption == 3)
  {
    bookList = Object.values(currentUser.bookList).sort(sortAlphabet);
  }
  console.log(bookList);
  document.getElementById("book-list").innerHTML = "";
  for(let i =0; i < bookList.length; i++)
  {
    console.log(bookList[i].id);
    const book = textbooks[bookList[i].id]
    console.log(book)
    const bookItem = constructBookItem(book, bookList[i].rating);
    document.getElementById("book-list").appendChild(bookItem);
  }
}

function constructBookItem(book, rating)
{
  var outerDiv = document.createElement("div");
  outerDiv.classList.add("book-item")

  var innerDiv1 = document.createElement("div");
  innerDiv1.classList.add("cover-display");
  innerDiv1.style.setProperty("background-image", `url('${book.CoverImage}')`);
  

  var title = document.createElement("span");
  title.textContent = book.Title

  var shareButton = document.createElement("button");
  shareButton.classList.add("share-button");
  var icon = document.createElement("i");
  icon.classList.add("fa-solid");
  icon.classList.add("fa-share");
  shareButton.appendChild(icon);
  shareButton.addEventListener('click', () => {sharePopUp(book.ShareLink)});

  var ratingDiv = document.createElement("div")
  ratingDiv.classList.add("Stars");
  ratingDiv.style.setProperty("--rating", rating);
  ratingDiv.style.setProperty("aria-label", `Rating of this product is ${rating} out of 5.`)
  ratingDiv.addEventListener("click", (event) => {rateBook(event, ratingDiv, book.ID)})

  var tooltip = document.createElement("div");
  tooltip.classList.add("tooltiptext");
  tooltip.innerText = "Title: " + book.Title + "\n" + "Author: " + book.Author + "\n" + "Version: " + book.Version + "\n" + "Price: " + book.Price;

  outerDiv.appendChild(innerDiv1);
  outerDiv.appendChild(title);
  outerDiv.appendChild(shareButton);
  outerDiv.appendChild(ratingDiv);
  outerDiv.appendChild(tooltip);
  return outerDiv;
}

function rateBook(event, ratingDiv, id)
{
  var rect = ratingDiv.getBoundingClientRect();
  var newRating = ((event.clientX - rect.left) / (rect.right - rect.left)) * 5;
  ratingDiv.style.setProperty("--rating", newRating);
  for (let i =0; i < currentUser.bookList.length; i++)
  {
    if (currentUser.bookList[i].id == id)
    {
      currentUser.bookList[i].rating = newRating;
      break;
    }
  }
  localStorage.setItem(currentUser.email, JSON.stringify(currentUser));
}

function sharePopUp(link)
{
  console.log(link)
  alert(`Sharing link: \n ${link}`)
}
function sortRating(a, b)
{
  if(a.rating > b.rating)
  {
    return -1
  }
  else if(a.rating < b.rating)
  {
    return 1;
  }
  else
  {
    return 0;
  }
}

function sortRatingReverse(a, b)
{
  if(a.rating < b.rating)
  {
    return -1
  }
  else if(a.rating > b.rating)
  {
    return 1;
  }
  else
  {
    return 0;
  }
}

function sortAlphabet(a, b)
{
  var bookA = textbooks[a.id];
  var bookB = textbooks[b.id];
  const titleA = bookA.Title;
  const titleB = bookB.Title;
  if (titleA < titleB)
  {
    return -1;
  }
  else if (titleA > titleB)
  {
    return 1;
  }
  else
  {
    return 0;
  }
}
