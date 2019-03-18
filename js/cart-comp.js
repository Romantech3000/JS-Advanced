Vue.component('cart-el', {
    props: [
        'currencyTag'
    ],
    data() {
        return {
            cartProducts: [],
            isVisibleCart: false,
            cartUrl: `${API}/cart1.json`
        }
    },

    methods: {
        loadCart() {
            this.$parent.getJson(this.cartUrl)
            // users current cart gets messed up by some weird logic
                .then((data) => {
                    console.log('got products data:\n' + JSON.stringify(data.contents));
                    for(prod of data.contents) {
                        let oldProd = this.getProductById(prod.id_product);
                        if (oldProd) {                             
                            oldProd.quantity += prod.quantity; // at least following that logic to the fullest, not just adding one piece per title
                        } else {
                            let newProd = {};
                            // leaving the properties as they were, 'cause still not sure what it's gonna be in the end
                            newProd.title = prod.product_name;
                            newProd.price = prod.price;
                            newProd.id = prod.id_product;
                            newProd.quantity = prod.quantity;
                            newProd.img = TMB_DIR + 'no_image.jpg';
                            this.cartProducts.push(newProd);
                        }
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
                const prodIdx = this.cartProducts.findIndex(prod => prod.id === product.id);
                if (prodIdx < 0) {
                    let newProd = Object.assign({quantity: quantity}, product);
                    newProd.img = newProd.img.replace(IMG_DIR, TMB_DIR); // same file name, different folder for thumbnails
                    this.cartProducts.push(newProd);
                }
                else {
                    this.cartProducts[prodIdx].quantity += quantity;
                }
            } catch(error) {
                console.log('Error: ' + error + '\n while adding product \n' + JSON.stringify(product));
            }
        },

        delProduct(prodId, delAll = true) { //delete a product from cart, delAll - all piees
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

        getProductById(prodId) {
            return this.cartProducts.find((el) => el.id === prodId);
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

    // wouldn't it be simpler and more transparent to make a local method that handles click event 
    // and calls parent's method through this.$parent.remoceClick(event) instead of emiting a non-standard event?
    template: `
    <div>
        <button class="btn btn-cart" id="show-cart-btn" type="button" @click="isVisibleCart =! isVisibleCart;">Корзина</button>
        <div id="cart" class="cart" v-show="isVisibleCart"  @click="removeClick">
            <cart-item-el :item="item" :currency-tag="currencyTag" v-for="item of cartProducts" :data-id="item.id" :key="item.id">
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

    template: `
    <div class="cart-item-flex">
        <img :src="item.img" :alt="item.title">
        <div class="cart-item-w3">
            <p class="cart-item-title">{{ item.title }}</p>
        </div>
        <div class = "cart-item-w1">
            <p class="cart-item-price" v-html="item.price + currencyTag"></p>
        </div>
        <div class = "cart-item-w1">{{ item.quantity }}</div>
        <div class = "cart-item-w1">
            <button class="del-btn" :data-id="item.id" title="Удалить" @click="$emit('remove', $event)"></button>
        </div>
    </div>    
    `
});
