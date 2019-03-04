const IMG_DIR = 'assets/images/';
const TMB_DIR = 'assets/thumbnails/'; //thumbnails
let currencyTag = '&euro;';

class ProductsList {
    constructor(container = '.products'){
        this.container = container;
        this.goods = []; // "raw" prodict data
        this.allProducts = []; //
        this._fetchProducts()
    }
    _fetchProducts(){
        this.goods = [
            {id: 1, title: 'Notebook', price: 2000},
            {id: 2, title: 'Mouse', price: 20},
            {id: 3, title: 'Keyboard', price: 200},
            {id: 4, title: 'Gamepad', price: 50},
            {id: 5, title: 'Chair', price: 150},
        ];
    }
    render(){
        const block = document.querySelector(this.container);
        for (let product of this.goods){
            const productObj = new ProductItem(product);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
        block.insertAdjacentHTML('afterend', `<p class="cart-total">Стоимость товаров: ${this.getTotal()} ${currencyTag}</p>`);
    }

    getTotal() {
        return this.goods.reduce( (total, prod) => total + prod.price, 0 );
    }
}


class ProductItem {
    constructor(product, img = 'no_image.jpg'){
        this.title = product.title;
        this.price = product.price;
        this.id = product.id;
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


let list = new ProductsList();
list.render();

