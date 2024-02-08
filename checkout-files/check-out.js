document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    removeItems();
    quantityChangePrice();
    placeOrder();
    goBack();
});


function loadCartItems() {
        const cartData = JSON.parse(localStorage.getItem('cartItems'));
        console.log(cartData);
        const cartContainer = document.querySelector('.cart');
        
        // Clear existing hardcoded items
        cartContainer.innerHTML = '<h1>Shopping Cart</h1>';

        if (cartData != null && cartData.length > 0) {
            cartData.forEach((item, index) => {
                const textbookDiv = document.createElement('div');
                textbookDiv.className = 'textbook';
                textbookDiv.id = 'textbook' + index;
                textbookDiv.innerHTML = `
                    <img src="${item.CoverImage}" alt="${item.Name}" class="textbook-img">
                    <div class="textbook-info">
                        <h3>${item.Name}</h3>
                        <p>Version: ${item.Version}</p>
                        <p class="price">Price: ${item.Price}</p>
                        <label for="quantity${index}">Quantity:</label>
                        <input type="number" id="quantity${index}" name="quantity${index}" min="1" max="99" value="${item.quantity}">
                    </div>
                    <button class="remove-btn"><i class="fa-solid fa-trash"></i></i></button>
                `;
                cartContainer.appendChild(textbookDiv);
            });
        } else {
            const emptyCartMessage = document.createElement('h2');
            emptyCartMessage.textContent = 'Your Cart is Empty';
            cartContainer.appendChild(emptyCartMessage);
        }

        updatePrice();
    }


    function removeItems() {
        const removeBtn = document.querySelectorAll('.remove-btn');
    
        removeBtn.forEach(button => {
            button.addEventListener('click', (event) => {
                const textbook = event.target.closest('.textbook');
                const itemName = textbook.querySelector('.textbook-info h3').textContent;
                removeFromLocalStorage(itemName);
                textbook.remove();
                updatePrice();
                checkCartEmpty();
            });
        });
    }

    function removeFromLocalStorage(itemName) {
        var cartData = JSON.parse(localStorage.getItem('cartItems'));
        const updatedItems = cartData.filter(item => item.Name !== itemName);
        cartData = updatedItems;
        localStorage.setItem('cartItems', JSON.stringify(cartData));
    }

    function quantityChangePrice() {
        let quantityInputs = document.querySelectorAll('.textbook-info input[type="number"]');
    
        quantityInputs.forEach(input => {
            input.addEventListener('change', (event) => {
                const itemName = event.target.closest('.textbook').querySelector('.textbook-info h3').textContent;
                let newQuantity = parseInt(event.target.value);
                if (newQuantity < 1) {
                    alert("Quantity has to be positive");
                    newQuantity = 1;
                    event.target.value = newQuantity;
                }
                updateQuantityInLocalStorage(itemName, newQuantity);
                updatePrice();
            });
        });
    }
    
    function updateQuantityInLocalStorage(itemName, newQuantity) {
        const cartData = JSON.parse(localStorage.getItem('cartItems'));
        cartData.forEach(item => {
            if (item.Name === itemName) {
                if (newQuantity >= 1) {
                    item.quantity = newQuantity;
                }
            }
        });
        localStorage.setItem('cartItems', JSON.stringify(cartData));
    }

    function updatePrice() {

        let items = document.querySelectorAll('.textbook-info');``
        let subtotal = 0;
        let totalItems = 0;

        items.forEach((currBook) => {
            const currPrice = parseFloat(currBook.querySelector('.price').textContent.replace(/[^\d.-]/g, ''));
            const currQuantity = parseInt(currBook.querySelector('input[type="number"]').value);
            totalItems += currQuantity;
            
            subtotal += currQuantity * currPrice;
        });
    
    
        const GST = subtotal * 0.05;
        const PST = subtotal * 0.07;
        subtotal += GST + PST;

        const GSTElement = document.querySelector('#gst-price');
        GSTElement.textContent = GST.toFixed(2);

        const PSTElement = document.querySelector('#pst-price');
        PSTElement.textContent = PST.toFixed(2);

        const subtotalElement = document.querySelector('#total-price');
        subtotalElement.textContent = subtotal.toFixed(2); 
    }


    function placeOrder(){
        document.getElementById("place-order").addEventListener('click', () => {
            localStorage.removeItem('cartItems');
            alert("Order has been successfully place. ")
            window.location.href = '../search-files/search.html';
        });
    }

    function checkCartEmpty() {
        let textbooks = document.querySelectorAll('.textbook');
    
        if (textbooks.length === 0) {
            let h1 = document.createElement('h1');
            h1.textContent = 'Your Cart is Empty';
            document.querySelector('.cart').appendChild(h1);
            localStorage.removeItem('cartItems'); // Clear the cart in localStorage
        }
    }

    function goBack(){
        document.getElementById('back-button').addEventListener('click', function() {
            window.location.href = '../search-files/search.html'; // Adjust the path as needed
        });
    }

