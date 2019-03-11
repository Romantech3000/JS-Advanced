const API = 'https://raw.githubusercontent.com/Romantech3000/assets/master/homework-a/json';
/*
    Дан большой текст, в котором для оформления прямой речи используются одинарные кавычки. 
    Придумать шаблон, который заменяет одинарные кавычки на двойные. 
*/

/*
    2. Улучшить шаблон так, чтобы в конструкциях типа aren't одинарная кавычка не заменялась на двойную.
*/

/*
    Создать форму обратной связи с полями: Имя, Телефон, E-mail, текст, кнопка Отправить. 
    При нажатии на кнопку Отправить произвести валидацию полей следующим образом:
    a. Имя содержит только буквы.
    b. Телефон имеет вид +7(000)000-0000.
    c. E-mail имеет вид mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru.
    d. Текст произвольный.
    e. Если одно из полей не прошло валидацию, необходимо выделить это поле красной рамкой и сообщить пользователю об ошибке.
*/

// load the text to process
function loadText() {
    fetch('texttoreplace.txt')
        .then((reply) => reply.text())
        .then((text) => {
            const srcTextEl = document.querySelector('#source-text');
            srcTextEl.textContent = text;
        })
        .catch((error) => console.log(`Error reading text: ${error}`));
}

// the replacer
function textFilter(inText, keepApos) {
    let outText = '';
    if (!keepApos) {
        let regExp = /'/g;
        outText = inText.replace(regExp, '"');
    } else {
        // v30 working. failed to come up with a classic regexp, so turned to replacer functions
        // might need to filter out the 1st and the last offset of the string to avoid out of range indices
        // let regExp = /'/gi;
        // outText = inText.replace(regExp, (str, offset, s) => {
        //     let letters = /[a-zA-Z]/; 
        //     //  don't replace the single quote mark if it's is between 2 aphabet letters
        //     if (s[offset-1].match(letters) && s[offset+1].match(letters)) {
        //         return str; 
        //     } else {
        //         return '"';
        //     }
        // });

        //v50 working. 3 regexp's applied in sequence (1 OR'ed)
        // let regExp = /^'|'$/gi; //if it's the 1st or the last symbol of the string
        // outText = inText.replace(regExp, '"');
        // regExp = /([^a-z])'/gi; //any non-alphabetic symbol to the left
        // outText = inText.replace(regExp, '$1"');
        // regExp = /'([^a-z])/gi; //any non-alphabetic symbol to the right
        // outText = outText.replace(regExp, '$1"');

        // ver 100500. working. back to \b's. OR'd
        let regExp = /'(([^']|\b'\b)*)/gi; 
        outText = inText.replace(regExp, '"$1');

        //ver 100501 LA/LB working
        // let regExp = /^'|'$|\b'(?!\b)|(?<!\b)'\b|(?<!\b)'(?!\b)/gi;
        // outText = inText.replace(regExp, '"');
    }
    return outText;
}


function handleFilterBtnClick() {
    const srcTextEl = document.querySelector('#source-text');
    const dstTextEl = document.querySelector('#target-text');
    const aposCheckEl = document.querySelector('#keep-apos-check');

    let keepApos = aposCheckEl.checked;
    dstTextEl.textContent = textFilter(srcTextEl.textContent, keepApos);
}

// made it a tad more realistic
// the name contains only English/ Russian alphabetic characters and at least 3 characters long
// and consists of 1 to 3 words
function isName(name) {
    let res = name.match(/^[a-zа-яё]{3,}\s?[a-zа-яё]*\s?[a-zа-яё]*/i);
    return (res && res[0] === name);
}

// +7(000)000-0000.
function isPhone(phone) {
    let res = phone.match(/^\+7\(\d{3}\)\d{3}\-\d{4}/);
    return res && res[0] === phone;
}

// mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru.
// ^my[-.]?mail@mail.ru$
// real email regexp https://code.iamcal.com/php/rfc822/full_regexp.txt
// these are allowed for the local part  !#$%&‘*+–/=?^a-z0-9_`.{|}~
function isEmail(email) { 
    let res = email.match(/^\w+([-.]?\w+)*@\w+([-.]?\w+)*\.\w{2,4}$/i); // good enough for most of the sane addresses
    return (res && res[0] === email);
}

function alertInput(el) {
    el.parentElement.classList.add('alert');
    el.focus();
}

function handleFormSubmit(e) {
    e.preventDefault();
    try {
        let elems = document.querySelectorAll('#contact-form input[type="text"]');
        [...elems].forEach(elem => {
            if (elem.parentElement.classList.contains('alert')) elem.parentElement.classList.remove('alert');
        });
        let el = document.getElementById('cf-name');
        if (!isName(el.value)) {
            alertInput(el);
            return false;
        }
        el = document.getElementById('cf-phone');
        if (!isPhone(el.value)) {
            alertInput(el);
            return false;
        }

        el = document.getElementById('cf-email');
        if (!isEmail(el.value)) {
            alertInput(el);
            return false;
        }
    } catch (e) {
        throw new Error(e.message);
    }
    return false;
}

window.addEventListener('load', () => {
    const filterBtnEl = document.getElementById('filter-btn');
    filterBtnEl.addEventListener('click', handleFilterBtnClick);
    const formEl = document.getElementById('contact-form');
    formEl.addEventListener('submit', handleFormSubmit);

    loadText();
});