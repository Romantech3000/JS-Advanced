//
// tried mixing the old classes stripped of render methods and new Vue object data and methods
// Failed to see the reason to get rid of them
// or to come up with new optimal storage structure for methods and data. 
// Why not add just two references to the Cart and Product List classes to the Vue object and reference their data and call their methods?
// Why Vue data object is better than spacifically structured class objects?
// Both approaches seems to work OK, and so do all the messy options in the middle.
// Unclear, unsatisfactory

// I'll probably get rid of the classes when moving to the components that are going to keep things separate anyway
// add-to-cart and del-from-cart click event listeners are moved inside the Cart class

// also products.length cart.products.length


const API = 'https://raw.githubusercontent.com/Romantech3000/assets/master/homework-a/json';
const IMG_DIR = 'https://raw.githubusercontent.com/Romantech3000/assets/master/homework-a/images/';
const TMB_DIR = 'https://raw.githubusercontent.com/Romantech3000/assets/master/homework-a/thumbnails/';

let currencyTag = '&euro;';


class ProductsList {
    constructor(container = '.products') {
        this.container = container;
        this.goods = []; // "raw" prodict data. temporary storage for each portion of data from server

        // "clean" array of products data we will be working with. newly created, processed and stored
        // properties and methods are available, etc.
        this.allProducts = [];
        this.filtered = [];
        
        this._fetchProducts();
    }

    _fetchProducts(){
        fetch(`${API}/catalog_data1.json`)  //returns a promise
            .then((response) => response.json()) 
            .then( (data) => {
                this.goods = [...data];
                console.log('got products data:\n' + JSON.stringify(this.goods));

                for (let product of this.goods){
                    const productObj = new ProductItem(product);
        
                // what if the products being added are already in allProducts array
                // e.g. after [next page], then [previous page]
                // shouldn't frontend replace the old products then?
                    this.allProducts.push(productObj);
                    this.filtered.push(productObj);
                }
            })
            .catch((error) => console.log('Error: ' + error)); // is it necessary here or reject can be handled "downstream"?
    }

    getProductById(prodId) {
        return this.allProducts.find((el) => el.id === prodId);
    }

    getTotal() {
        return this.allProducts.reduce( (total, prod) => total + prod.price, 0 );
    }
}

// no more methods, but leaving it a class for now
class ProductItem {
    constructor(product, img = IMG_DIR + 'no_image.jpg') {
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
        this.img = img;
    }
}


// moved event processing inside the class in this implementation
// so now the constructor requires the prodlist object to be passed as a parameter
class ShopCart {
    constructor(prodlist, container = '#cart') {
        this.container = container;
        this.products = [];
        this.isVisible = false;
        this.isEmpty = true;

        // product list "add to cart" button click
        // l8r -> not intuitive to the user so far, so some visuals should be added 
        const prodsEl = document.querySelector('.products');
        prodsEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('buy-btn')) {
                this.addProduct(prodlist.getProductById(+e.target.dataset.id));
                e.preventDefault();
            }
        });
    }

    addProduct(product, quantity = 1) {
        const prodIdx = this.products.findIndex(prod => prod.id === product.id);
        if (prodIdx < 0) {
            let newProd = Object.assign({quantity: quantity}, product);
            newProd.img = newProd.img.replace(IMG_DIR, TMB_DIR); // same file name, different folder
            this.products.push(newProd);
        }
        else {
            this.products[prodIdx].quantity += quantity;
        }
    }

    delProduct(prodId, delAll = true) {
        const prodIdx = this.products.findIndex(prod => prod.id === prodId);
        if (prodIdx >= 0) {
            this.products[prodIdx].quantity--;
            if (delAll || this.products[prodIdx].quantity < 1) this.products.splice(prodIdx, 1);
        }
    }

    getTotal() {
        let total = 0;
        //this.products.forEach(prod => {total += prod.price * prod.quantity});
        // for .. of practice
        for (let prod of this.products) total += prod.price * prod.quantity;
        return total;
    }
}



let vueApp = new Vue({
    el: '#vue-wrap',
    methods: {
        //getJson
        getCartTotal() {
            return this.cart.getTotal();
        },

        // still using target's dataset and class name 
        //to avoid adding an event listener to every button
        remove: function(event) {
            if (event.target.classList.contains('del-btn')) {
                this.cart.delProduct(+event.target.dataset.id, false);
                event.preventDefault();
            }
        },

        filterProducts() {
            if (this.products) {
                let rex = new RegExp(this.searchLine, 'i');
                this.filtered = this.products.filter((item) => item.title.match(rex));
            }
        }
    },

    computed: {

//added this because cart.products.length in v-if  didn't work (".length of undefined ...")
// didn't expect that to happen
        isCartEmpty() {    
            if (this.cart.products) { 
                return this.cart.products.length < 1;
            }
            return true;
        }
    },
    data: {
        products: [], // references to 
        filtered: [],

        cart: {},
        searchLine: '',
        isVisibleCart: false,

        currencyTag: '&euro;' // never really changes, but I need to pass it somehow
    },
    mounted() {
        const prodList = new ProductsList();
        this.products = prodList.allProducts;
        this.filtered = prodList.filtered;

        this.cart = new ShopCart(prodList);
    }
});

