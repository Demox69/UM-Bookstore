// Simulated database for demonstration purposes
  // Function to handle the login process

  //Create fakeuser
  var fakeUser = {email: 'user@example.com', password: 'password123', gender: "Male", DOB: "2011-12-29", username: "Rob", bookList: [{id: 1, rating: 4.5}, {id: 2, rating: 1.1}, {id: 3, rating: 3.2}, {id:4, rating:4}, {id:5, rating:5},{id:6, rating:1.2}
    ,{id:7, rating:3.75}, {id:8, rating:4}, {id:9, rating:2.3}]}
  localStorage.setItem("user@example.com", JSON.stringify(fakeUser));

  function handleSignup() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password.length >= 12) {
      if (password === confirmPassword) {
        // save the user into LocalStorage
        if (!localStorage.getItem(email)) { // check if user exist
          var newUser = {email: email, password: password, username: username, gender: "", DOB:"1999-12-23", bookList:[{id: 0, rating: 3.2}, {id: 7, rating: 4.3}, {id:9, rating:2.2}]}
          localStorage.setItem(email, JSON.stringify(newUser));
          alert('Signup successful!');
          window.location.href = 'index.html';
        } else {
          alert('Email already registered.');
        }
      } else {
        alert('Passwords do not match.');
      }
    } else {
      alert('Password must be at least 12 characters long.');
    }

    return false; // Prevent form submission
  }

  
  function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const storedUser = localStorage.getItem(email);
    if (storedUser) {
      const userDetails = JSON.parse(storedUser);
      if (password === userDetails.password) {
        // Save only the email of the current user in LocalStorage
        localStorage.setItem("currentUser", email);
        window.location.href = './search-files/search.html';
      } else {
        alert('Login failed: incorrect password.');
      }
    } else {
      alert('Login failed: user not found.');
    }

    return false;
  }


  // Function to check password length
  function checkPasswordLength() {
    const password = document.getElementById('password').value;
    const passwordHelp = document.getElementById('password-help');
    if (password.length < 12) {
      passwordHelp.style.display = 'block';
    } else {
      passwordHelp.style.display = 'none';
    }
  }


  // Redirect to the signup page
  function handleGoToSignup() {
    window.location.href = 'signup.html'; // Adjust to the correct path
  }

  // Redirect to the login page
  function handleGoToLogin() {
    window.location.href = 'index.html'; // Adjust to the correct path
  }

  // Handle "Continue as guest" action
  function handleContinueAsGuest() {
    // Implement the logic for continuing as guest
    localStorage.setItem("currentUser", 'user@example.com');
    window.location.href = "./search-files/search.html"
  }

  // Handle "Forgot password" action
  function handleForgotPassword() {
    // Implement the logic for forgotten password
    alert('we have sent an email to your email address.');
  }
