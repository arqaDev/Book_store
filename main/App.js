const books = document.querySelector('.books')
const form = document.getElementById('nav-form')
const searchBtn = document.getElementById('search')
const searchTerm = document.getElementById('search_term')
const wishListCounter = document.getElementById('wish_list_counter')
const cartCounter = document.getElementById('cart_counter')
const productDetails = document.getElementById('product_details')
const bookInfo = document.querySelector('.book-info')
const popupContainer = document.querySelector('.popup-container')
const closeBtn = document.getElementById('close')

 
window.addEventListener('DOMContentLoaded', () => {

    // Checks wish list localStorage and cart localStorage. If length > 0 the number of added books will add to the icons
    if (getWishList().length === 0) {
        wishListCounter.style.display = 'none'
    } else {
        wishListCounter.style.display = 'block'
        wishListCounter.firstChild.nextSibling.innerHTML = getWishList().length
    }
    if (getCart().length === 0) {
        cartCounter.style.display = 'none'
    } else {
        cartCounter.style.display = 'block'
        cartCounter.firstChild.nextSibling.innerHTML = getCart().length
    }

    // Checks width of the window. If width less then 700, the input  makes smaller and remove search word from the button 
    if (window.screen.width <= 700) {
        form.style.width = '220px'

        searchBtn.style.width = '20px'
        searchBtn.lastChild.innerText= ''
    }

    // load book data and render to main page, when open window.
    const randomBooks = ['js', 'python', 'harry potter', 'lord of the rings', 'football']
    const randomNumber = Math.floor(Math.random() * 5)
    getData(randomBooks[randomNumber])
})

// get data from google books api and render to the addItem function
async function getData(parametr=null) {
    const value = parametr != null ? parametr : searchTerm.value 
    const resp = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${value}&key=AIzaSyD7yr_5vMFTCqhL7l5hUuVnZ8DJEluHBCY`)
    const data = await resp.json()
    const its = data.items
    its.forEach((it) => {
        addItem(it)
    })
}

// add books to the home page from google books api
function addItem(item) {

    // create div element and add class name "book"
    const book = document.createElement('div')
    book.classList.add('book')

    // render book to the html page
    book.innerHTML = `
        <div class="book__picture">
            ${"imageLinks" in item.volumeInfo ? `
            <img class="book__img" src="${item.volumeInfo.imageLinks.thumbnail}">
            ` : `
            <img class="book__img" src="https://static.wikia.nocookie.net/supernanny/images/2/2f/QuestionMark.jpg/revision/latest?cb=20180617030617">
            `}
        </div>
        <div class="book__info">
            <h3 class="book__title"><a href="#">${item.volumeInfo.title}</a></h3>
            <span class="book__author">${'authors' in item.volumeInfo ? item.volumeInfo.authors[0] : 'Unknown'}</span>
        </div>
        <div class="book__order">
            <span class="book__price">$${(Math.random() * (7.120 - 12.0200) + 12.0200).toFixed(2)}</span>
            <div class="icons">
                <button class="add_to_wish_list"><i class="fa-solid fa-heart"></i></i></button>
                <button class="add_to_cart">TO CART</button>
            </div>
        </div>
    `
    // Get book elements "image" and  "title" that open modal window with information for them
    const pics = book.querySelector('.book__picture')
    const bookTitle = book.querySelector('.book__title')
    showBookInfo(pics, item)
    showBookInfo(bookTitle, item)
    
    // Get wish list button and make event listener which remove book from localStorage, if button isn't active or add book to localSorage, if button is active 
    const wishListBtn = book.querySelector('.add_to_wish_list')
    wishListBtn.addEventListener('click', () => {
        if (wishListBtn.classList.contains('active')) {
            removeBookFromWLLS(item.id)
            wishListBtn.classList.remove('active')
        } else {
            addBookToWLLs(item.id)
            wishListBtn.classList.add('active') 
        }
        
        // Get wish list and check length of the wish list. If length > 0 we add display: block to the wish list counter
        const elements = getWishList()
        if (elements.length > 0) {
            wishListCounter.style.display = 'block'
            wishListCounter.firstChild.nextSibling.innerHTML = elements.length
        } else {
            wishListCounter.style.display = 'none'
        }
    })

    // Get cart button and make event listener which remove book from localStorage, if button isn't active or add book to localSorage, if button is active 
    const cartBtn = book.querySelector('.add_to_cart')
    cartBtn.addEventListener('click', () => {
        if (cartBtn.classList.contains('active')) {
            removeBookFromCLS(item.id)
            cartBtn.innerText = 'TO CART'
            cartBtn.classList.remove('active')
        } else {
            addBookToCLS(item.id)
            cartBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
            cartBtn.classList.add('active')
        }

        // Get cart localStorage and check length of the cart. If length > 0 we add display: block to the wish list counter
        const elements = getCart()
        if (elements.length > 0) {
            cartCounter.style.display = 'block'
            cartCounter.firstChild.nextSibling.innerHTML = elements.length
        } else {
            cartCounter.style.display = 'none'
        }
    })

    books.appendChild(book)
}

// Get wish list and return data
function getWishList() {
    const wishListIds = JSON.parse(localStorage.getItem('wishListIds'))
    return wishListIds === null ? [] : wishListIds
}

// Get wish list and return data
function getCart() {
    const cartIds = JSON.parse(localStorage.getItem('cartIds'))
    return cartIds === null ? [] : cartIds
}

// add book to the wish list localStorage
function addBookToWLLs(book) {
    const wishListIds = getWishList()
    localStorage.setItem('wishListIds', JSON.stringify([...wishListIds, book]))
}

// remove book from the wish list localStorage
function removeBookFromWLLS(bookId) {
    const wishList = getWishList()
    localStorage.setItem('wishListIds', JSON.stringify(
        wishList.filter(id => id !== bookId)
    ))
}

// add book to the cart localStorage
function addBookToCLS(book) {
    const cartIds = getCart()
    localStorage.setItem('cartIds', JSON.stringify([...cartIds, book]))
}

// remove book from the cart localStorage
function removeBookFromCLS(bookId) {
    const cart = getCart()
    localStorage.setItem('cartIds', JSON.stringify(
        cart.filter(id => id !== bookId)
    ))
}

// open modal window with book info
function showBookInfo(arg, item) {
    arg.addEventListener('click', () => {
        bookInfo.innerHTML = ''

        const bInfo = document.createElement('div')
        bInfo.classList.add('popup__info')
        bInfo.innerHTML = `
        <div class="popup__img">
        ${"imageLinks" in item.volumeInfo ? `
        <img class="book__img" src="${item.volumeInfo.imageLinks.thumbnail}">
        ` : `
        <img class="book__img" src="https://static.wikia.nocookie.net/supernanny/images/2/2f/QuestionMark.jpg/revision/latest?cb=20180617030617">
        `}
        </div>
        <div class="popup__info">
            <h2 class="popup__title">${item.volumeInfo.title}</h2>
            <div class="description">
                <h4 class="description__title">Description</h4>
                <p class="description__content">${item.volumeInfo.description}</p>
            </div>
            <div class="product_details" id="product_details">
                <h4>Product Details</h4>
                <div style="display:flex">
                    <div class="product__title">
                        <span>Publisher</span>
                        <span>Pusblish Date</span>
                        <span>Pages</span>
                        <span>Langueage</span>
                        <span>Type</span>
                    </div>
                    <div class="product__info">
                        <span>${item.volumeInfo.publisher}</span>
                        <span>${item.volumeInfo.publishedDate}</span>
                        <span>${item.volumeInfo.pageCount}</span>
                        <span>${item.volumeInfo.language}</span>
                        <span>${item.volumeInfo.printType}</span>
                    </div>
                </div>
            </div>
        </div>
        `

        // Get close button in modal window. When we click on the button the window will close
        closeBtn.addEventListener('click', () => {
            popupContainer.classList.add('hidden')
        })

        // add book info into  the modal window
        bookInfo.appendChild(bInfo)
        // Make the modal window is visible
        popupContainer.classList.remove('hidden')
    })
}

// Get search button and when we click we get data from google api
searchBtn.addEventListener('click', () => {
    books.innerHTML = ''
    getData()
})

// Get search input and when we push Enter key, we get data from google api
searchTerm.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        books.innerHTML = ''
        getData()
    }
})
