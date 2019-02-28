const products = [
    {id: 1, title: 'Notebook', price: 2000},
    {id: 2, title: 'Mouse', price: 20},
    {id: 3, title: 'Keyboard', price: 200},
    {id: 4, title: 'Gamepad', price: 50},
];

const renderProduct = (title = 'No Title', price = 999999.99, image = 'assets/images/no_image.jpg') => {
    return `<div class="product-item">
                <h3>${title}</h3>
                <img src="${image}">
                <p>${price}</p>
                <button class="buy-btn">Купить</button>
            </div>`;
};

const renderPage = list => {
    const productsList = list.map(item => renderProduct(item.title, item.price));
    document.querySelector('.products').innerHTML = productsList;
};

renderPage(products);