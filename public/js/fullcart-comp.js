// it's mostly the same component as cart-comp.js, just the templates are different
// there should be some way to reuse cart-comp with some conditionals

//const TMB_DIR = 'assets/thumbnails/'; // also defined in cart-comp.js
Vue.component('fullcart-el', {
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
                        let newProd = Object.assign({img: 'no_image.jpg'}, prod);
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

        clearCart() {
            if (confirm('Are you sure you want to clear the cart?')) {
                console.log(`Clearing shop cart`);
                this.$parent.delJson(`${this.cartUrl}/all`)
                    .then((resJson) => {
                        if (resJson.result === 1) {
                            this.cartProducts = [];
                            this.syncLivecart();
                        }
                        else console.log(`Got result = ${resJson.result} from clearJson`);
                    });
            }
        },

        updateProduct(prodId) {
            const prodIdx = this.cartProducts.findIndex(prod => prod.id_product === prodId);
            if (prodIdx >= 0) {
                console.log(`Updating product with ID = ${prodId}`);
                // augmenting old incremental logic with ability to directly set the quantity value
                this.$parent.putJson(`${this.cartUrl}/${prodId}`, {quantity: 0, newQuantity: this.cartProducts[prodIdx].quantity})
                    .then((resJson) => {
                        if (resJson.result !== 1) {
                            console.log(`Got result = ${resJson.result} from putJson`);
                        }
                    });
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

        syncLivecart() {
            // if there's a livecart component in the same page, udate livecart products
            if (this.$parent.$refs.cart) this.$parent.$refs.cart.cartProducts = this.cartProducts;
        }
    },

    computed: {
        isCartEmpty() {    
            return !(this.cartProducts && this.cartProducts.length > 0);
        },

        cartTotal() {
            return this.cartProducts.reduce((total, prod) => {
                return total + prod.price * prod.quantity;
            }, 0);
        },

        numProducts() {
            return this.cartProducts.reduce((total, prod) => {
                return total + prod.quantity;
            }, 0);
        }
    },

    mounted() {
        this.loadCart(this.cartUrl);
       // this.syncLivecart();
    },

    template: `
    <div class="fullcart-block" @click="removeClick">
        <div class="cart-header-flex">
            <div class="cart-list-col-45">Product Details</div>
            <div class="cart-list-col">unit Price</div>
            <div class="cart-list-col">Quantity</div>
            <div class="cart-list-col">shipping</div>
            <div class="cart-list-col">Subtotal</div>
            <div class="cart-list-col">ACTION</div>
        </div>
        
        <fullcart-item-el
             :currency-tag="currencyTag"
             v-for="item of cartProducts"
             :item="item"
             :data-id="item.id_product"
             :key="item.id_product"
             @quantichange="updateProduct(item.id_product)"
        >
        </fullcart-item-el>
        <p v-if="isCartEmpty">The Cart Is Empty</p>
        
        <div class="cart-buttons-flex">
            <a href="#" class="cart-btn-long" @click.prevent="clearCart">Clear shopping cart</a>
            <a href="#" class="cart-btn-long">Continue shopping</a>
        </div>
        
        <div class="cart-btm-flex">
            <div class="cart-btm-flex-item">
                <p class="cart-sum-title">Shipping Adress</p>
                <select class="country-sel" name="country" id="country">
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Canada">Canada</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Russia">Russia</option>
                    <option value="Japan">Japan</option>
                </select>
                <input class="cart-address-input" type="text" placeholder="State">
                <input class="cart-address-input" type="text" placeholder="Postcode / Zip">
            </div>
            <div class="cart-btm-flex-item">
                <p class="cart-sum-title">coupon  discount</p>
                <p class="coupon-explain">Enter your coupon code if you have one</p>
                <input class="cart-coupon-input" type="text">
                <a href="#" class="cart-btn-s">Apply coupon</a>
            </div>
            <div class="cart-btm-summary">
                <p class="cart-summ-subtotal">Sub total <span class="cart-subtot-price" v-html="currencyTag + '&nbsp;' + cartTotal.toFixed(2)">$0</span></p>
                <p class="cart-total">GRAND TOTAL<span class="cart-total-price" v-html="currencyTag + '&nbsp;' + cartTotal.toFixed(2)">$0</span></p>
                <p class="cart-checkout-pos">
                <a href="checkout.html" class="cart-checkout-btn">proceed to checkout</a></p>
            </div>
        </div>
    
    </div>
`
});

Vue.component('fullcart-item-el', {
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


        <div class="cart-row-flex">
            <div class="cart-list-col-45">
                <img class="cart-list-img" :src="imgDir + item.img" :alt="item.product_name">
                <div class="cart-prod-details">
                    <span class="cart-prod-name">{{ item.product_name }}</span>
                    <!--p class="stars">&#xe806;&#xe806;&#xe806;&#xe806;&#xf123;</p-->
                    <p class="cart-prod-params">Color:<span class="cart-prod-param-value">Red</span><br>
                        Size:<span class="cart-prod-param-value">Xll</span></p>
                </div>
            </div>
            <div class="cart-list-col"><span v-html="currencyTag"></span> {{ item.price }}</div>
            <div class="cart-list-col"><input class="cart-list-quant" type="text" v-model.number="item.quantity" @change="$emit('quantichange', item)"></div>
            <div class="cart-list-col">FREE</div>
            <div class="cart-list-col"><span v-html="currencyTag"></span> {{item.price * item.quantity}}</div>
            <div class="cart-list-col"><a class="cart-prod-del del-btn" :data-id="item.id_product" title="Delete">&#xe80c;</a></div>
        </div>
    `
});
