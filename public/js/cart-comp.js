//const TMB_DIR = 'https://raw.githubusercontent.com/Romantech3000/assets/master/homework-a/thumbnails/';
const TMB_DIR = 'assets/thumbnails/';
Vue.component('cart-el', {
    props: [
        'currencyTag'
    ],
    data() {
        return {
            cartProducts: [],
            isVisibleCart: false,
            cartUrl: '/api/cart'
        }
    },

    methods: {
        loadCart() {
            this.$parent.getJson(this.cartUrl)
            // users current cart gets messed up by some weird logic
                .then((data) => {
                    console.log('got cart data:\n' + JSON.stringify(data.contents));
                    for(prod of data.contents) {
                        let newProd = Object.assign({img: TMB_DIR + 'no_image.jpg'}, prod);
                        this.cartProducts.push(newProd);
                    }
                })
                .catch((error) => {console.log(`Cart Json error: ${error}`)});
        },

        addToCartClick(e) {
            if (e.target.classList.contains('buy-btn')) {
                //this.getJson(check_product_url).then((data) => {if (data.result === 1) {}else{alert(`Error: can't add product ${+e.target.dataset.id}`);}})
                this.addProduct(this.$parent.$refs.products.getProductById(+e.target.dataset.id));
                e.preventDefault();
            }
        },

        addProduct(product, quantity = 1) { // add to cart
            try {
                const find = this.cartProducts.find(prod => prod.id_product === product.id_product);
                let newProd = Object.assign({quantity: quantity}, product);
                if (find) {
                    this.$parent.putJson(`${this.cartUrl}/${find.id_product}`, {quantity: quantity})
                        .then((resJson) => {
                            if (resJson.result === 1) find.quantity += quantity;
                            else console.log(`Got result = ${resJson.result} from putJson`);
                        });
                } else {
                    this.$parent.postJson(this.cartUrl, newProd)
                        .then((resJson) => {
                                if (resJson.result === 1) this.cartProducts.push(newProd);
                                else console.log(`Got result = ${resJson.result} from postJson`);
                        });
                    //newProd.img = newProd.img.replace(IMG_DIR, TMB_DIR); // same file name, different folder for thumbnails
                }
            } catch(error) {
                console.log('Error: ' + error + '\n while adding product \n' + JSON.stringify(product));
            }
        },

        delProduct(prodId, delAll = true) { //delete a product from cart, delAll - all piees
            const prodIdx = this.cartProducts.findIndex(prod => prod.id_product === prodId);
            if (prodIdx >= 0) {
                console.log(`Deleting product with ID: ${prodId}`);
                if (delAll || this.cartProducts[prodIdx].quantity < 2) {
                    console.log(`Calling API: ${this.cartUrl}/${prodId}`);
                    this.$parent.delJson(`${this.cartUrl}/${prodId}`)
                        .then((resJson) => {
                            if (resJson.result === 1) this.cartProducts.splice(prodIdx, 1);
                            else console.log(`Got result = ${resJson.result} from delJson`);
                        });
                } else {
                    this.$parent.putJson(`${this.cartUrl}/${prodId}`, {quantity: -1})
                        .then((resJson) => {
                            if (resJson.result === 1) {
                                this.cartProducts[prodIdx].quantity--;
                            }
                            else {
                                console.log(`Got result = ${resJson.result} from putJson`);
                            }
                        });

                }
            } else {
                console.log('Error: can\'t find the product to delete');
            }
        },

        removeClick: function(event) {
            if (event.target.classList.contains('del-btn')) {
                this.delProduct(+event.target.dataset.id, false);
                event.preventDefault();
            }    
        },

        getProductById(prodId) {
            return this.cartProducts.find((el) => el.id_product === prodId);
        },
    },

    computed: {
        isCartEmpty() {    
            return !(this.cartProducts && this.cartProducts.length > 0);
        },

        cartTotal() {
            return this.cartProducts.reduce((total, prod) => {
                return total + prod.price * prod.quantity;
            }, 0);
        }
    },

    mounted() {
        this.loadCart(this.cartUrl);
    },

    template: `
    <div>
        <button class="btn btn-cart" id="show-cart-btn" type="button" @click="isVisibleCart =! isVisibleCart;">Корзина</button>
        <div id="cart" class="cart" v-show="isVisibleCart"  @click="removeClick">
            <cart-item-el :item="item" :currency-tag="currencyTag" v-for="item of cartProducts" :data-id="item.id_product" :key="item.id_product">
            </cart-item-el>
            <p v-if="isCartEmpty">Корзина пуста</p>
            <div v-else class="cart__total-flex">
                <p class="cart-total">Total price: </p>
                <p class="cart-total" v-html="cartTotal + currencyTag"></p>
            </div>
        </div>
    </div>`
});

Vue.component('cart-item-el', {
    props: [
        'item',
        'currencyTag'
    ],
    data() {
        return {
            imgDir: TMB_DIR
        }
    },

    template: `
    <div class="cart-item-flex">
        <img :src="imgDir + item.img" :alt="item.product_name">
        <div class="cart-item-w3">
            <p class="cart-item-title">{{ item.product_name }}</p>
        </div>
        <div class = "cart-item-w1">
            <p class="cart-item-price" v-html="item.price + currencyTag"></p>
        </div>
        <div class = "cart-item-w1">{{ item.quantity }}</div>
        <div class = "cart-item-w1">
            <button class="del-btn" :data-id="item.id_product" title="Удалить" @click="$emit('remove', $event)"></button>
        </div>
    </div>    
    `
});
