var colors = [
    {
        name: 'Red',
        hex: '#e22'
    },
    {
        name: 'Green',
        hex: '#0e2'
    },
    {
        name: 'Blue',
        hex: '#22e'
    },
    {
        name: 'Pink',
        hex: '#e05'
    },
    {
        name: 'Orange',
        hex: '#e50'
    },
    {
        name: 'Black',
        hex: '#000'
    },
    {
        name: 'Grey',
        hex: '#888'
    }
];

// ==============================================================================================
// build color select dropdown lists in each container the real select elemsnts are located
// ==============================================================================================
function buildColorSelect() {
    var wrapEls = document.getElementsByClassName('color-sel-wrap'); //all color select wrappers
    var origSelEl; //<select> inside the wrapper (original)
    var newSelEl; //div representing selected item 
    var newOptEl;
    var optListEl // div containing all new select option items
    //var tinyBoxEl; //small colored rectangle in color dropdown list
    var tinyBoxHtml; //


    for (var i = 0; i < wrapEls.length; i++) { 
        origSelEl = wrapEls[i].getElementsByTagName('select')[0]; //color <select> element
        
        // for each original select control make a div to represent the selected item
        newSelEl = document.createElement('div');
        newSelEl.classList.add('select-selected');
        
        //tinyBoxEl = document.createElement('span');
        //tinyBoxEl.classList.add('sel-color-tinybox');

        // draw a color box and the original select selected content
        
        tinyBoxHtml = '<span class="sel-color-tinybox" style="background-color: ' +
            hexByName(origSelEl.options[origSelEl.selectedIndex].value) + '"></span>'; //generating color rectangle HTML
        newSelEl.innerHTML = '<span>' 
                    + origSelEl.options[origSelEl.selectedIndex].innerHTML +  '</span>';

        wrapEls[i].appendChild(newSelEl); // adding the newly created item to the wrapper

        // Create and populate the options list container
        optListEl = document.createElement('div');
        optListEl.classList.add('select-items');
        optListEl.classList.add('select-hide');
        // copying selection items from the original selection
        
        for (var j = 1; j < origSelEl.options.length; j++) {
            newOptEl = document.createElement('div');
            tinyBoxHtml = '<span class="sel-color-tinybox" style="background-color: ' +
                hexByName(origSelEl.options[j].value) + '"></span>'; //color rectangle
            newOptEl.innerHTML = tinyBoxHtml + '<span>' + origSelEl.options[j].innerHTML + '</span>';
            
            //probably it'd be better to attach it to optListEl once. for now attaching to every option item
            newOptEl.addEventListener('click', function (e) {
                // update the original select and the selected item
                //   optListEl  color-sel-wrap // getting original select
                var realSelEl = this.parentNode.parentNode.getElementsByTagName('select')[0];
                var fakeSelEl = this.parentNode.previousSibling; //previous sibling is fake select element
                var fakeText = this.getElementsByTagName('span')[1].textContent;
    
                // looking up the corresponding original select option and selectiong it
                for (var i = 0; i < realSelEl.options.length; i++) {
                    //if (oSelEl.options[i].innerHTML == this.innerHTML) {
                    if (realSelEl.options[i].textContent == fakeText) {
                        console.log('found ' + fakeText);
                        realSelEl.selectedIndex = i; // selecting the option
                        // both spans get copied into the fake select element
                        fakeSelEl.innerHTML = this.innerHTML;
                        
                        //removing the class showing the element in the list is selected
                        var selOptEls = this.parentNode.getElementsByClassName('option-is-selected');
                        // shouldn't there be just one? [0]
                        for (var k = 0; k < selOptEls.length; k++) {
                            selOptEls[k].classList.remove('option-is-selected');
                        }
                        // marking the clicked option as selected
                        this.classList.add('option-is-selected');
                        break;
                    }
                }
                fakeSelEl.click();
            });
            optListEl.appendChild(newOptEl);
        }
        wrapEls[i].appendChild(optListEl);
        newSelEl.addEventListener('click', function(e) {
           // console.log(e.target);
            e.stopPropagation(); // try without it
            closeAllOptLists(this);
            this.nextSibling.classList.toggle('select-hide');
            this.classList.toggle('select-arrow-active');
        });
    }
}

//
function closeAllOptLists(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var optListEls, fakeSelEls, i, arrNo = [];

    optListEls = document.getElementsByClassName("select-items");
    fakeSelEls = document.getElementsByClassName("select-selected");

    for (i = 0; i < fakeSelEls.length; i++) {
        if (elmnt == fakeSelEls[i]) { //
          arrNo.push(i)
        } else {
          fakeSelEls[i].classList.remove("select-arrow-active");
        }
    }

    for (i = 0; i < optListEls.length; i++) {
        if (arrNo.indexOf(i)) {
          optListEls[i].classList.add("select-hide");
        }
    }
}


//====================================================
// returns color hex string by by the given color name
function hexByName(colorName) {
    for (var i = 0; i < colors.length; i++) {
        if (colorName == colors[i].name) return colors[i].hex;
    }
    return '#fff';
}

// =========================================================================================
// build a fake select dropdown list in the same container a real select elemsnt is located
// =========================================================================================
function buildTextSelect() {
    var wrapEls = document.getElementsByClassName('text-sel-wrap'); //all color select wrappers
    var origSelEl; //<select> inside the wrapper (original)
    var newSelEl; //div representing selected item 
    var newOptEl;
    var optListEl // div containing all new select option items


    for (var i = 0; i < wrapEls.length; i++) { 
        origSelEl = wrapEls[i].getElementsByTagName('select')[0]; //color <select> element
        
        // for each original select control make a div to represent the selected item
        newSelEl = document.createElement('div');
        newSelEl.classList.add('select-selected');
        newSelEl.innerHTML = origSelEl.options[origSelEl.selectedIndex].innerHTML;

        wrapEls[i].appendChild(newSelEl); // adding the newly created item to the wrapper

        // Create and populate the options list container
        optListEl = document.createElement('div');
        optListEl.classList.add('select-items');
        optListEl.classList.add('select-hide');
        // copying selection items from the original selection
        
        for (var j = 1; j < origSelEl.options.length; j++) {
            newOptEl = document.createElement('div');
            newOptEl.innerHTML = origSelEl.options[j].innerHTML;
            
            //probably it'd be better to attach it to optListEl once. for now attaching to every option item
            newOptEl.addEventListener('click', function (e) {
                // update the original select and the selected item
                //   optListEl  text-sel-wrap // getting original select
                var realSelEl = this.parentNode.parentNode.getElementsByTagName('select')[0];
                var fakeSelEl = this.parentNode.previousSibling; //previous sibling is fake select element
                var fakeText = this.textContent;
    
                // looking up the corresponding original select option and selectiong it
                for (var i = 0; i < realSelEl.options.length; i++) {
                    //if (oSelEl.options[i].innerHTML == this.innerHTML) {
                    if (realSelEl.options[i].textContent == fakeText) {
                        console.log('found ' + fakeText);
                        realSelEl.selectedIndex = i; // selecting the option
                        // both spans get copied into the fake select element
                        fakeSelEl.innerHTML = this.innerHTML;
                        
                        //removing the class showing the element in the list is selected
                        var selOptEls = this.parentNode.getElementsByClassName('option-is-selected');
                        // shouldn't there be just one? [0]
                        for (var k = 0; k < selOptEls.length; k++) {
                            selOptEls[k].classList.remove('option-is-selected');
                        }
                        // marking the clicked option as selected
                        this.classList.add('option-is-selected');
                        break;
                    }
                }
                fakeSelEl.click();
            });
            optListEl.appendChild(newOptEl);
        }
        wrapEls[i].appendChild(optListEl);
        newSelEl.addEventListener('click', function(e) {
            e.stopPropagation(); // try without it
            closeAllOptLists(this);
            this.nextSibling.classList.toggle('select-hide');
            this.classList.toggle('select-arrow-active');
        });
    }
}

document.addEventListener('click', closeAllOptLists);
window.addEventListener('load', buildColorSelect);
window.addEventListener('load', buildTextSelect);