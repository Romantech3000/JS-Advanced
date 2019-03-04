// ### 3Напишите программу, 
// рассчитывающую стоимость и калорийность гамбургера. Можно использовать примерную архитектуру класса из 
// методички, но можно использовать и свою.

// junkFood

//*Некая сеть фастфуда предлагает несколько видов гамбургеров:
//  Маленький (50 рублей, 20 калорий).
//  Большой (100 рублей, 40 калорий). 
const sizes = [
    {id: 1, name: 'маленький', price: 50.0, calories: 20},
    {id: 2, name: 'большой', price: 200.0, calories: 40}
];

//### Гамбургер может быть с одним из нескольких видов начинок (обязательно):
//  С сыром (+10 рублей, +20 калорий).
//  С салатом (+20 рублей, +5 калорий).
//  С картофелем (+15 рублей, +10 калорий).
const stuffings = [
    {id: 1, name: 'сыр', price: 10.0, calories: 20},
    {id: 2, name: 'салат', price: 20.0, calories: 5},
    {id: 3, name: 'картошка', price: 15.0, calories: 10}
];

// ### Дополнительно гамбургер можно посыпать 
// приправой (+15 рублей, +0 калорий) и полить майонезом (+20 рублей, +5 калорий).
const toppings = [
    {id: 1, name: 'приправа', price: 15.0, calories: 0},
    {id: 2, name: 'майонез', price: 20.0, calories: 5}
];


class Hamburger {
    constructor(size, stuffing) {
        this.size = size;
        this.stuffing = stuffing;
        this.toppings = [];
    }

    addTopping(topping) {
        console.log(`adding ${JSON.stringify(topping)}`);
        this.toppings.push(JSON.parse(JSON.stringify(topping)));
    }

    getSizeName() {
        return this.size.name;
    }

    getStuffingName() {
        return this.stuffing.name;
    }

    getToppingNames() {
        return  (this.toppings.length)? this.toppings.map(topp => topp.name).join(', ') : 'No Toppings';
    }

    getPrice() {
        let hambPrice = this.size.price + this.stuffing.price;
        hambPrice += this.toppings.reduce((total, topp) => total + topp.price, 0);
        return hambPrice;
    }

    getCalories() {
        let hambCalories = this.size.calories + this.stuffing.calories;
        hambCalories += this.toppings.reduce((total, topp) => total + topp.calories, 0);
        return hambCalories;
    }

}

// we'll probably be getting the id's from UI,which would need conversion into indices
// calling the option by their names doesnt seem to be a good option programming-wise
let burger = new Hamburger(sizes[1], stuffings[2]);
console.log(burger);
burger.addTopping(toppings[1]);
burger.addTopping(toppings[0]);
console.log(`Burger size: ${burger.getSizeName()}`);
console.log(`Burger stuffing: ${burger.getStuffingName()}`);
console.log(`Burger toppings: ${burger.getToppingNames()}`);
console.log(`Burger price: ${burger.getPrice()} `);
console.log(`Burger calories: ${burger.getCalories()} `);