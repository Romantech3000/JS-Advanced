const IMG_DIR = 'assets/images/';
const currencyTag = '&euro;';

const products = [
    {id: 1, title: 'Notebook', price: 2000},
    {id: 2, title: 'Mouse', price: 20},
    {id: 3, title: 'Keyboard', price: 200},
    {id: 4, title: 'Gamepad', price: 50},
];

const renderProduct = (title = 'No Title', price = 999999.99, image = 'no_image.jpg') => {
    //Shouldn't I be creating it using DOM? Works for practicing ES6 template strings though
    return `<div class="product-item">
                <a class="product-item-link"  href="#">
                <h3 class="product-item-title">${title}</h3>
                <img src="${IMG_DIR + image}" alt="${title}">
                <div class="product-item-bottom-flex">
                    <p class="product-item-price">${price + " " + currencyTag}</p>
                    <button class="buy-btn">Купить</button>
                </div>
                </a>
            </div>`;
};

// since .map returns an array, it's converted into a string when the result is being assigned
// to string innerHTML. the conversion calls toString() method, that returns a comma-separated string
// To prevent it we should convert the array into a string explicitly e.g. using join()
const renderPage = list => document.querySelector('.products').innerHTML 
        = list.map(item => renderProduct(item.title, item.price)).join('');


renderPage(products);
