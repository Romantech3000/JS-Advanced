const IMG_DIR = 'assets/images/';
let currencyTag = '&euro;';

const vm = new Vue({
    el: '#vm',
    data: {
        currencyTag: currencyTag,
        imgDir: IMG_DIR
    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then((response) => {
                    return response.json();
                })
                .catch((error) => { 
                    console.log(`fetching data from ${url} ${error}`);
                    this.$refs.error.showBox('Fetch Data Error', error);
                });
        },
        postJson(url, data) {
            return fetch(url, {
                method: 'POST',
                cache: "no-cache",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })
                .then((response) => {
                    return response.json();
                })
                .catch((error) => {
                    console.log('posting data... ' + error);
                    this.$refs.error.showBox('Fetch Data Error', error);
                });
        },
        putJson(url, data) {
            return fetch(url, {
                method: 'PUT',
                cache: "no-cache",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })
                .then((response) => {
                    return response.json();
                })
                .catch((error) => {
                    console.log('changing data... ' + error);
                    this.$refs.error.showBox('Fetch Data Error', error);
                });
        },

        delJson(url) {
            return fetch(url, {
                method: 'DELETE',
                cache: "no-cache",
                headers: {"Content-Type": "application/json"}
            })
                .then((response) => {
                    return response.json();
                })
                .catch((error) => {
                    console.log('deleting... ' + error);
                    this.$refs.error.showBox('Fetch Data Error', error);
                });
        },
    },
    mounted() {
    }
});