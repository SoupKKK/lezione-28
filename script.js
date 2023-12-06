const bookListWrapper = document.querySelector("#book-list");
const cartWrapper = document.querySelector("#cart");

let allBooks = [];
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

window.onload = () => {
    loadBooks();
    loadCart();
};

const loadBooks = () => {
    fetch("https://striveschool-api.herokuapp.com/books")
        .then(resp => resp.json())
        .then(books => {
            displayBooks(books);
            allBooks = books;
        })
        .catch(err =>
            console.error(err.message)
        )
}

function displayBooks(books) {
    bookListWrapper.innerHTML = "";

    books.forEach((book) => {
        const isInCart = cartItems.findIndex(cartBook => cartBook.title === book.title) !== -1;

        bookListWrapper.innerHTML += `
        <div class="col">
            <div class="card shadow-sm h-100 ${isInCart ? 'selected' : ''}">
                <img src="${book.img}" class="img-fluid card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p>${book.price}€</p>
                    <div>
                        <button class="btn btn-primary" onclick="addToCart(event, '${book.asin}')">Add to Cart</button>
                        <button class="btn btn-outline-dark" onclick="removeFromList(event)">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    });
}

const removeFromList = (event) => {
    const colToRemove = event.target.closest('.col');
    colToRemove.style.transition = 'opacity 1s ease, height 1s ease';

    colToRemove.style.opacity = '0';
    colToRemove.style.height = '0';

    setTimeout(() => {
        colToRemove.remove();
    }, 700);
};


const addToCart = (event, asin) => {
    const book = allBooks.find((book) => book.asin === asin);
    cartItems.push(book);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    loadCart();
    event.target.closest(".card").classList.add("selected");
}

const loadCart = () => {
    cartWrapper.innerHTML = '<h2 class="text-secondary m-2">Cart:</h2>`'

    cartItems.forEach((book) => {
        cartWrapper.innerHTML += `
        <div class="cart-item">
            <div class="d-flex align-items-start gap-2">
                <img src=${book.img}  class="img-fluid">
                <div class="flex-grow-1">
                    <p class="mb-2">${book.title}</p>
                    <div class="d-flex justify-content-between">
                        <p class="fw-bold">${book.price}€</p>
                        <div>
                            <button class="btn btn-outline-dark" onclick="deleteItem('${book.asin}')">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
}

function deleteItem(asin) {
    const index = cartItems.findIndex((book) => book.asin === asin);

    if (index !== -1) {
        cartItems.splice(index, 1);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    loadCart();
}