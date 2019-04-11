Vue.component('search-el', {
    data() {
        return {
            searchLine: ''
        }
    },

    template: `
    <form action="#" class="search-form" @submit.prevent="$parent.$refs.products.setSearchLine(searchLine)">
        <input type="text" class="input search-form__input" v-model="searchLine">
        <button class="btn search-form__btn" type="submit"></button>
    </form>
    `
});