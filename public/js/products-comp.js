Vue.component('products-el', {
    props: {
        currencyTag: String,
        imgDir: String,
        showSocBtns: {
            type: Boolean,
            default: false
        },
        maxProds: {
            type: Number,
            default: 6
        }
    },
    data () {
        return {
            products: [],
            //filtered: []
            searchLine: ''
        }
    },
    methods: {
        fetchProducts() {
            this.$parent.getJson('/api/products')  //returns a promise
                .then( (data) => {
                    //console.log('got products data:\n' + JSON.stringify(data));
                    for (let prod of data) {

                        // image array
                        let newProd = Object.assign({img: 'no_image.jpg'}, prod);
                        this.products.push(newProd);
                    }
                })
                .catch((error) => console.log('process ' + error));;
        },

        getProductById(prodId) {
            return this.products.find((el) => el.id_product === prodId);
        },
        // filterProducts() {
        //     let rex = new RegExp(this.searchLine, 'i');
        //     this.filtered = this.products.filter((item) => item.product_name.match(rex));
        // },
        setSearchLine(searchText) {
            this.searchLine = searchText;
        }
    },

    computed: {
        filtered() {
            if (this.products) {
                let rex = new RegExp(this.searchLine, 'i');
                return this.products.filter((item) => item.product_name.match(rex));
            } else {
                return res;
            }
        },
    },

    mounted() {
        this.fetchProducts();
    },
    template: `
    <div class="prodlist-flex" @click="$parent.$refs.cart.addToCartClick">
        <prod-el 
            :show-soc-btns="showSocBtns" 
            :product="product" 
            :img-dir="imgDir" 
            :currency-tag="currencyTag" 
            v-for="product of filtered.slice(0, maxProds)" 
            :key="product.id_product">
        </prod-el>
        <p v-if="!filtered.length">Нет данных</p>
    </div>`
});

Vue.component('prod-el', {
    props: [
        'product',
        'currencyTag',
        'imgDir',
        "showSocBtns"
    ],
    // @click="$parent.$emit('add-to-cart', $event)"
    template: `
    <div class="prodbox">
        <a href="singlepage.html" class="prodbox-link">
            <img :src="imgDir + product.img" :alt="product.product_name" class="prodbox-img">
            <div class="prodbox-text">
                <p class="prodbox-name">{{ product.product_name }}</p>
                <p class="prodbox-price">{{product.price.toFixed(2)}} <span v-html="currencyTag"></span></p>
            </div>
        </a>
        <div class="add2cart">
            <a href="#" class="add2cart-link buy-btn" :data-id="product.id_product">
                <img class="add2cart-img" src="assets/images/shopcart-white.svg" alt="shopcart">
                Add To Cart
            </a>
        </div>
        <div v-if="showSocBtns" class="retweet-like-flex">
            <a href="#" class="prodbox-retweet"></a>
            <a href="#" class="prodbox-like"></a>
        </div>
    </div>
    `
});

