Vue.component('products-el', {
    props: [
        'currencyTag',
        'imgDir'
    ],
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
    <div class="products" @click="$parent.$refs.cart.addToCartClick">
        <prod-el :product="product" :img-dir="imgDir" :currency-tag="currencyTag" v-for="product of filtered" :key="product.id_product">
        </prod-el>
        <p v-if="!filtered.length">Нет данных</p>
    </div>`
});

Vue.component('prod-el', {
    props: [
        'product',
        'currencyTag',
        'imgDir'
    ],
    // @click="$parent.$emit('add-to-cart', $event)"
    template: `
        <div class="product-item">
            <a class="product-item-link" href="#">
                <img :src="imgDir + product.img" :alt="product.product_name">
                <h3 class="product-item-title">{{ product.product_name }}</h3>
                <div class="product-item-bottom-flex">
                    <p class="product-item-price">{{product.price}} <span v-html="currencyTag"></span></p>
                    <button class="btn buy-btn" :data-id="product.id_product">Купить</button>
                </div>
            </a>
        </div>    
    `
});