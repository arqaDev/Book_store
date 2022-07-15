const books = document.querySelector('.books')
const bookInfo = document.querySelector('.book-info')
const popupContainer = document.querySelector('.popup-container')
const closeBtn = document.getElementById('close')
const wishListCounter = document.getElementById('wish_list_counter')


getWLLS()

// Get wish list localStorage and render to the page
function getWLLS() {
    const wishListIds = JSON.parse(localStorage.getItem('wishListIds'))
    if (wishListIds === null || wishListIds.length === 0) {
        books.innerHTML = '<h1 class="empty">Your wish list is empty!</h1>'
    } else {
        wishListIds.map((book) => {
            getData(book)
        })
    }
}

// Get data from google api by Id
async function getData(bookId) {
    const resp = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=AIzaSyD7yr_5vMFTCqhL7l5hUuVnZ8DJEluHBCY`)
    const data = await resp.json()
    addItem(data)
}

// add books to the page
function addItem(item) {
    const book = document.createElement('div')
    book.classList.add('wishList__book')
    book.innerHTML = `
        <div style='display: flex;'>
            <div class="wishList__book__picture">
                ${"imageLinks" in item.volumeInfo ? `
                <img class="wishList__book__img" src="${item.volumeInfo.imageLinks.thumbnail}">
                ` : `
                <img class="wishList__book__img" src="https://static.wikia.nocookie.net/supernanny/images/2/2f/QuestionMark.jpg/revision/latest?cb=20180617030617">
                `}
            </div>
            <div class="wishList__book__info">
                <h4 class="wishList__book__title"><a href="#">${item.volumeInfo.title}</a></h4>
                <span class="wishList__book__author">${'authors' in item.volumeInfo ? item.volumeInfo.authors[0] : 'Unknown'}</span>
            </div>
        </div>
        <div class="wishList__book__order">
            <span class="wishList__book__price">$${(Math.random() * (7.120 - 12.0200) + 12.0200).toFixed(2)}</span>
        </div>
        <i class="fa-solid fa-xmark delete"></i>
    `

    // Get delete button that delete book from page and localStorage
    const deleteBtn = book.querySelector('.delete')
    deleteBtn.addEventListener('click', () => {
        books.innerHTML = ''
        
        removeBookFromWLILS(item.id)
        getWLLS()
    })

    // Get book elements "image" and  "title" that open modal window with information for them
    const bookImg = book.querySelector('.wishList__book__img')
    const bookTitle = book.querySelector('.wishList__book__title')
    showBookInfo(bookImg, item)
    showBookInfo(bookTitle, item)

    books.appendChild(book)
}

// remove book from wish list localStorage
function removeBookFromWLILS(bookId) {
    const wishListIds = JSON.parse(localStorage.getItem('wishListIds'))
    localStorage.setItem('wishListIds', JSON.stringify(
        wishListIds.filter(id => id !== bookId)
    ))
}

// show book info into the modal window
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

        // Get close button that make the modal window is hidden
        closeBtn.addEventListener('click', () => {
            popupContainer.classList.add('hidden')
        })

        bookInfo.appendChild(bInfo)
        popupContainer.classList.remove('hidden')
    })
}