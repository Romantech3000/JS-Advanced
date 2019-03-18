const API = 'https://raw.githubusercontent.com/Romantech3000/assets/master/homework-a/json';
const IMG_DIR = 'https://raw.githubusercontent.com/Romantech3000/assets/master/homework-a/images/';
const TMB_DIR = 'https://raw.githubusercontent.com/Romantech3000/assets/master/homework-a/thumbnails/';
let currencyTag = '&euro;';

// Homework Task3: to see the error message pop up change API path, say, to /json1
// "SyntaxError: Unexpected token"

const vm = new Vue({
    el: '#vm',
    data: {
        // what would be the best way to pass language/currency parameters into the components?
        // maybe yet another component showing the price and the current currency symbol, 
        // so the number and the symbol can swap their places would work
        currencyTag: currencyTag
    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then((response) => {
                    return response.json();
                })
                .catch((error) => { 
                    console.log('fetching data... ' + error);
                    this.$refs.error.showBox('Fetch Data Error', error);
                });
        },
    },
    mounted() {
    }
});