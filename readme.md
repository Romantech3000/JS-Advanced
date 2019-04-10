JavaScript - Advanced (aka "Bang! Zoom! Straight to the Moon!")
=================================================================

Un(re)solved problems:
The overall architecture of components and their data interchenge hasn't even been discussed for the webstore as a whole. Same is true for "bottom to top" Node.js server coding approach, etc.

As an example, for this project the relation and data interchange between two shopcart components (Fullcart and Livecart ) used in the same page is quite unclear. No overall software architecture, no basic data/model software designs, or even "best practices" to follow.

For now one cart component just looks for the other one being in the same page and syncronises the contents data by referencing the array of products. Doesn't look too good, but at least works somehow.

Due to many similarities of these components, it might be optimal to make one universal component, changing its' template depending on some conditionals. Something like I did for the Products component.

It also could've been a solution not to use Livecart component in Shopcart and Checkout pages whatsoever. If not for the shopcart icon origanally put into those pages by graphics/UI designer.

Also, if a user has two pages of the site opened in the browser at the same time, the shopcart data in the pages would be unsynced and thus different, which might be misleading to the user.


In total to my surprise, I couldn't really find any practical use for the knowledge received. That might be due to the fact that "usual", aka not-SPA websites can't really benefit from the use of Vue.js data-centered approach, and even very likely to be in disadvantage because of SEO issues. These factors make the field of its application seem quite narrow, and the conclusion would be that I still need to lean "JS2", but a different one, suitable for broader, real-world applications. That might be the old jQuery or something new that we missed completely.
