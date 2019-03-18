Vue.component('products-el', {
    props: [
        'currencyTag'
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
            this.$parent.getJson(`${API}/catalog_data1.json`)  //returns a promise
                .then( (data) => {
                    let goods = [...data];
                    console.log('got products data:\n' + JSON.stringify(goods));
                    for (let product of goods) {
                        let newProd = {};
                        // just leaving the properties as they were
                        newProd.title = product.product_name;
                        newProd.price = product.price;
                        newProd.id = product.id_product;
                        newProd.img = IMG_DIR + 'no_image.jpg';
                        this.products.push(newProd);
                        //this.filtered.push(newProd);
                    }
                })
                .catch((error) => console.log('process ' + error));;
        },

        getProductById(prodId) {
            return this.products.find((el) => el.id === prodId);
        },
        // filterProducts() {
        //     let rex = new RegExp(this.searchLine, 'i');
        //     this.filtered = this.products.filter((item) => item.title.match(rex));
        // },
        setSearchLine(searchText) {
            this.searchLine = searchText;
        }
    },

    computed: {
        filtered() {
            if (this.products) {
                let rex = new RegExp(this.searchLine, 'i');
                return this.products.filter((item) => item.title.match(rex));
            } else {
                return res;
            }
        },
    },

    mounted() {
        this.fetchProducts();
    },
    // moved event listener to the parent, so less event listeners are attached
    // it has rely on the event target this way
    template: `
    <div class="products" @click="$parent.$refs.cart.addToCartClick">
        <prod-el :product="product" :currency-tag="currencyTag" v-for="product of filtered" :key="product.id">
        </prod-el>
        <p v-if="!filtered.length">Нет данных</p>
    </div>`
});

Vue.component('prod-el', {
    props: [
        'product',
        'currencyTag'
    ],
    // @click="$parent.$emit('add-to-cart', $event)"
    template: `
        <div class="product-item">
            <a class="product-item-link" href="#">
                <img :src="product.img" :alt="product.title">
                <h3 class="product-item-title">{{ product.title }}</h3>
                <div class="product-item-bottom-flex">
                    <p class="product-item-price">{{product.price}} <span v-html="currencyTag"></span></p>
                    <button class="btn buy-btn" :data-id="product.id">Купить</button>
                </div>
            </a>
        </div>    
    `
});