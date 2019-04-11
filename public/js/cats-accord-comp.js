let catsAccordData = [
    {
        "catName": "Category",
        "catId": 1000,

        "subCats": [
            {
                "catName": "Accessories",
                "catId": 1001
            },
            {
                "catName": "Bags",
                "catId": 1002
            },
            {
                "catName": "Denim",
                "catId": 1003
            },
            {
                "catName": "Hoodies & Sweatshirts",
                "catId": 1004
            },
            {
                "catName": "Jackets & Coats",
                "catId": 1005
            },
            {
                "catName": "Pants",
                "catId": 1006
            },
            {
                "catName": "Polos",
                "catId": 1007
            },
            {
                "catName": "Shirts",
                "catId": 1008
            },
            {
                "catName": "Shoes",
                "catId": 1009
            },
            {
                "catName": "Shorts",
                "catId": 1010
            },
            {
                "catName": "Sweaters & Knits",
                "catId": 1011
            },
            {
                "catName": "T-Shirts",
                "catId": 1012
            },
            {
                "catName": "Tanks",
                "catId": 1013
            }
        ]
    },
    {
        "catName": "Brands",
        "catId": 2000,
        "subCats": [
            {
                "catName": "BugDonald's",
                "catId": 2001
            },
            {
                "catName": "Mango",
                "catId": 2002
            },
            {
                "catName": "Mongo",
                "catId": 2003
            },
            {
                "catName": "Brand D",
                "catId": 2004
            },
            {
                "catName": "Brand Demo",
                "catId": 2005
            },
            {
                "catName": "Nerds'R'Us",
                "catId": 2006
            },
            {
                "catName": "Susanna K.",
                "catId": 2007
            },
            {
                "catName": "Buggins' Bags",
                "catId": 2008
            }
        ]
    },
    {
        "catName": "Designer",
        "catId": 3000,
        "subCats": [
            {
                "catName": "Bugs Bunny",
                "catId": 3001
            },
            {
                "catName": "Susanna K.",
                "catId": 3002
            },
            {
                "catName": "Kasper G.",
                "catId": 3003
            },
            {
                "catName": "Ze Peppa",
                "catId": 3004
            }
        ]
    }
];

// upper level categories list (headings with no links for now)
// rach top category includes one list of categories (possibly recursive)
Vue.component ('cats-accord-el', {
    data() {
        return {
            cats: catsAccordData,
            catsOpen: [true, false, false]
        }
    },
    methods: {
      headingClick(idx) {
          let wasOpen = this.catsOpen[idx];
          for (let i = 0; i < this.catsOpen.length; i++) Vue.set(this.catsOpen, i, false);
          Vue.set(this.catsOpen, idx, !wasOpen);
          //this.catsOpen[idx] = !wasOpen;
          this.$forceUpdate();
      }
    },
    mount() {
// load data from JSON file here
    },
    template: `
    <ul class="vert-menu">
        <li v-for="(cat, index) in cats">
            <h3 
                :key="'h3-'+index" 
                :class="['vert-menu__heading', {'is-open': catsOpen[index]}]" 
                @click="headingClick(index)">
                
                {{ cat.catName }}
            </h3>
            <ul class="vert-menu__sub" >
                <cats-accord-list-el :cats="cat.subCats"></cats-accord-list-el>
            </ul>
        </li>
    </ul>            
    `
});

Vue.component ('cats-accord-list-el', {
    props: {
        cats: {
            type: Array,
            default: function () {
                return [];
            }
        }
    },
    template: `
    <ul class="vert-menu__sub">
        <li v-for="cat in cats">
             <a href="#">{{ cat.catName }}</a>
             <cats-accord-list-el v-if="cat.subCats && cat.subCats.length" :cats="cats.subCats"></cats-accord-list-el>
        </li>
    </ul>
    `
});