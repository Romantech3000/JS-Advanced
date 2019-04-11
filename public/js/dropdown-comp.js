let catsData = [
    {
        "catName": "Men",
        "catId": 1,
        "subCats": [
            {
                "catName": "Tees/Tank tops",
                "catId": 201
            },
            {
                "catName": "Shirts/Polos",
                "catId": 202
            },
            {
                "catName": "Sweaters",
                "catId": 203
            },
            {
                "catName": "Sweatshirts/Hoodies",
                "catId": 204
            },
            {
                "catName": "Blazers",
                "catId": 205
            },
            {
                "catName": "Jackets/vests",
                "catId": 206
            }
        ]
    },
    {
        "catName": "Women",
        "catId": 2,
        "subCats": [
            {
                "catName": "Dresses",
                "catId": 101
            },
            {
                "catName": "Tops",
                "catId": 102
            },
            {
                "catName": "Sweaters/Knits",
                "catId": 103
            },
            {
                "catName": "Jackets/Coats",
                "catId": 104
            },
            {
                "catName": "Blazers",
                "catId": 105
            },
            {
                "catName": "Denim",
                "catId": 106
            },
            {
                "catName": "Leggings/Pants",
                "catId": 107
            },
            {
                "catName": "Skirts/Shorts",
                "catId": 108
            },
            {
                "catName": "Accessories",
                "catId": 109
            },
            {
                "catName": "Bags/Purses",
                "catId": 110
            },
            {
                "catName": "Swimwear/Underwear",
                "catId": 111
            },
            {
                "catName": "Nightwear",
                "catId": 112
            },
            {
                "catName": "Shoes",
                "catId": 113
            },
            {
                "catName": "Beauty",
                "catId": 114
            }
        ]
    }
];

// upper level categories list (headings with no links for now)
// each top category includes one list of categories (possibly recursive)
Vue.component ('cats-dropdown-el', {
    data() {
        return {
            cats: catsData,
            isCatsDropVisible: false
        }
    },
    mount() {
// load data from JSON file here
    },
    template: `
    <div class="search-cat-drop-wrap">
        <button class="search-browse" @click.prevent="isCatsDropVisible = !isCatsDropVisible">Browse</button>
        <div v-if="isCatsDropVisible" class="search-cat-drop">
        <ul class="search-cat-drop__ul">
            <li v-for="cat in cats">
                <h3 class="search-cat-drop__heading">{{ cat.catName }}</h3>
                <cat-list-el :cats="cat.subCats"></cat-list-el>            
            </li>
        </ul>
        </div>        
    </div> 
    `
});

Vue.component ('cat-list-el', {
    props: {
        cats: {
            type: Array,
            default: function () {
                return [];
            }
        }
    },
    template: `
    <ul class="search-cat-drop__ul">
        <li v-for="cat in cats">
             <a href="#" class="search-cat-drop__link">{{ cat.catName }}</a>
             <cat-list-el v-if="cat.subCats && cat.subCats.length" :cats="cats.subCats"></cat-list-el>
        </li>
    </ul>
    `
});