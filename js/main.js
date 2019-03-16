//
// Version 2.0 
// Got rid of all classes and moved all data into the Vue object
// Why Vue data object is better than spacifically structured class objects?
// In Version 1.0 (previous commit) just referenced external ProductList and Shopcart classes instances from Vue data
// Both approaches seems to work OK, and so do all the messy options in the middle.

// also products.length cart.products.length seem to cause problems


const API = 'https://raw.githubusercontent.com/Romantech3000/assets/master/homework-a/json';
const IMG_DIR = 'https://raw.githubusercontent.com/Romantech3000/assets/master/homework-a/images/';
const TMB_DIR = 'https://raw.githubusercontent.com/Romantech3000/assets/master/homework-a/thumbnails/';

let currencyTag = '&euro;';

let vueApp = new Vue({
    el: '#vue-wrap',
    methods: {
        fetchProducts(){
            fetch(`${API}/catalog_data1.json`)  //returns a promise
                .then((response) => response.json()) 
                .then( (data) => {
                    let goods = [...data];
                    console.log('got products data:\n' + JSON.stringify(this.goods));
                    for (let product of goods) {
                        let newProd = {};
                        // just leaving the properties as they were
                        newProd.title = product.product_name;
                        newProd.price = product.price;
                        newProd.id = product.id_product;
                        newProd.img = IMG_DIR + 'no_image.jpg';
                        this.products.push(newProd);
                        this.filtered.push(newProd);
                    }
                })
                .catch((error) => console.log('Error: ' + error));
        },

        filterProducts() {
            let rex = new RegExp(this.searchLine, 'i');
            this.filtered = this.products.filter((item) => item.title.match(rex));
        },

        getProductById(prodId) {
            return this.products.find((el) => el.id === prodId);
        },

        addProduct(product, quantity = 1) { // add 2 cart
            const prodIdx = this.cartProducts.findIndex(prod => prod.id === product.id);
            if (prodIdx < 0) {
                let newProd = Object.assign({quantity: quantity}, product);
                newProd.img = newProd.img.replace(IMG_DIR, TMB_DIR); // same file name, different folder for thumbnails
                this.cartProducts.push(newProd);
            }
            else {
                this.cartProducts[prodIdx].quantity += quantity;
            }
        },


        delProduct(prodId, delAll = true) {
            const prodIdx = this.cartProducts.findIndex(prod => prod.id === prodId);
            if (prodIdx >= 0) {
                this.cartProducts[prodIdx].quantity--;
                if (delAll || this.cartProducts[prodIdx].quantity < 1) this.cartProducts.splice(prodIdx, 1);
            }
        },


        removeClick: function(event) {
            if (event.target.classList.contains('del-btn')) {
                this.delProduct(+event.target.dataset.id, false);
                event.preventDefault();
            }    
        },

        addToCartClick(e) {
            if (e.target.classList.contains('buy-btn')) {
                this.addProduct(this.getProductById(+e.target.dataset.id));
                e.preventDefault();
            }
        }


    },

    computed: {
        // imho a better way to filter products
        // should change automatically when products or searchLine change
        // filtered() {
        //     if (this.products) {
        //         let rex = new RegExp(this.searchLine, 'i');
        //         return this.products.filter((item) => item.title.match(rex));
        //     } else {
        //         return res;
        //     }
        // },

    //added this because cart.products.length in v-if  didn't work (".length of undefined ...")
    // didn't expect that to happen
        isCartEmpty() {    
            return !(this.cartProducts && this.cartProducts.length > 0);
        },

        cartTotal() {
            //let total = 0; for (let prod of this.cartProducts) total += prod.price * prod.quantity;
            return this.cartProducts.reduce((total, prod) => total + prod.price*prod.quantity, 0);
        }
    },
    data: {
        products: [],
        filtered: [],
        cartProducts: [],

        searchLine: '',
        isVisibleCart: false,

        currencyTag: '&euro;' // never really changes, but I need to pass it somehow
    },
    mounted() {
        this.fetchProducts();
    }
});

