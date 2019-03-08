const API = 'https://raw.githubusercontent.com/Romantech3000/assets/master/homework-a/json';
const IMG_DIR = 'https://raw.githubusercontent.com/Romantech3000/assets/master/homework-a/images/';

//const IMG_DIR = 'assets/images/';
const TMB_DIR = 'assets/thumbnails/'; //thumbnails
let currencyTag = '&euro;';



class ProductsList {
    constructor(container = '.products') {
        this.container = container;
        this.goods = []; // "raw" prodict data. temporary storage for each portion of data from server
        // the whole array of products we will be working with. newly created, processed and stored
        // properties and methods are available, etc.
        this.allProducts = [];

// Переделайте GoodsList так, чтобы fetchGoods() возвращал промис, а render() вызывался в обработчике этого промиса.
        this._fetchProducts()
            .then( (data) => {
                this.goods = [...data];
                console.log('got products data:\n' + JSON.stringify(this.goods));
                this.render();
            })
            .catch((err) => console.log(err));
    }

    _fetchProducts(){
        return fetch(`${API}/catalog_data1.json`)  //a promise
            .then((response) => response.json()) // promise as well
            .catch((error) => console.log('Error: ' + error)); // is it necessary here or reject can be handled "downstream"?
    }

    render(){
        const block = document.querySelector(this.container);
        for (let product of this.goods){
            const productObj = new ProductItem(product);

            //// adding to previous data Maybe we should check if the products has been already added to allProducys
            this.allProducts.push(productObj);       
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
        block.insertAdjacentHTML('afterend', `<p class="cart-total">Стоимость товаров: ${this.getTotal()} ${currencyTag}</p>`);
    }

    getTotal() {
        //return this.goods.reduce( (total, prod) => total + prod.price, 0 );
        // Только для подсчета стоимости, вы сейчас итерируете массив goods -
        // на самом деле в этом массиве хранятся сырые данные, лучше итерировать this.allProducts -
        // в этом массиве хранятся уже непосредственно объекты товаров
        return this.allProducts.reduce( (total, prod) => total + prod.price, 0 );
    }
}


class ProductItem {
    constructor(product, img = 'no_image.jpg'){
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
        this.img = img;
    }


    render(){
        return `<div class="product-item" data-id="${this.id}">
            <a class="product-item-link"  href="#">
                <img src="${IMG_DIR + this.img}" alt="${this.title}">
                <h3 class="product-item-title">${this.title}</h3>
                <div class="product-item-bottom-flex">
                    <p class="product-item-price">${this.price + " " + currencyTag}</p>
                    <button class="buy-btn" data-id="${this.id}">Купить</button>
                </div>
            </a>
        </div>`;
    }
}

class ShopCart {
    constructor(container = '#cart') {
        this.container = container;
        this.products = [];
        this.isVisible = false;
    }

    get visible() {
        return this.isVisible;
    }

    set visible(vis) {
        let cartEl = document.querySelector(this.container);

        if (cartEl) {
            if (vis) {
                cartEl.classList.add('cart-show');
            } else {
                cartEl.classList.remove('cart-show');
            }
            this.isVisible = vis;
        } else {
            console.log('Cant find the cart block')
        }
    }

    addProduct(product, quantity = 1) {
        const prodIdx = this.products.findIndex(prod => prod.id === product.id);
        if (prodIdx < 0) {
            this.products.push(product);
            this.products[this.products.products.length-1].quantity = quantity;
        }
        else {
            this.products[prodIdx].quantity += quantity;
        }
    }

    delProduct(prodId) {
        const prodIdx = this.products.findIndex(prod => prod.id === prodId);
        if (prodIdx >= 0) this.products.splice(prodIdx, 1);
    }

    render() {
        const containerEl = document.querySelector(this.container);
        let content = '';
        this.products.forEach(prod => {
            const cartItem = new CartItem(product);
            content += cartItem.render();
        });
        containerEl.innerHTML = content;
    }

    getTotal() {
        let total = 0;
        //this.products.forEach(prod => {total += prod.price * prod.quantity});
        // for .. of practice
        for (let prod of this.products) total += prod.price * prod.quantity;
        return total;
    }
}

class CartItem {
    constructor(product) {
        this.id = prodict.id;
        this.price = product.price;
        this.title = product.title;
        this.quantity = product.quantity;
    }

    render() {
        return `<div class="cart-item-flex" data-id="${this.id}">
                <img src="${TMB_DIR + this.img}" alt="${this.title}">
                <div class="cart-item-w3">
                    <p class="cart-item-title">${this.title}</p>
                </div>
                <div class = "cart-item-w1">
                    <p class="product-item-price">${this.price + " " + currencyTag}</p>
                </div>
                <div class = "cart-item-w1">
                    ${this.quantity}
                </div>
                <div>
                    <button class="del-btn" data-id="${this.id}">Удалить</button>
                </div>
            </a>
        </div>`;
    }
}


function init() {

    let list = new ProductsList();
    let cart = new ShopCart();

    const showCartEl = document.querySelector('#show-cart-btn');
    if (showCartEl) {
        showCartEl.addEventListener('click', () => { cart.visible = !cart.visible});
    }

    const prodsEl = document.querySelector('.products');

    prodsEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-btn')) {
            let prodId = +e.target.dataset.id;
            console.log(prodId);
            e.preventDefault();
        };
    })
}


window.addEventListener('load', init);