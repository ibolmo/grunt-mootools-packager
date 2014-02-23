/*
---

name: Core

description: Mock Core

provides: [Core, MooTools, Type, typeOf, instanceOf, Native]

...
*/

(function(){

this.MooTools = {
	version: '1.4.6dev',
	build: '%build%'
};

Array.implement({

	/*<!ES5>*/
	forEach: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) fn.call(bind, this[i], i, this);
		}
	},
	/*</!ES5>*/

	each: function(fn, bind){
		Array.forEach(this, fn, bind);
		return this;
	}

});



})();

/*
---

name: String

description: Mock String

requires: [Type, Array]

provides: String

...
*/

String.implement({


});

/*
---

name: Array

description: Mock Array

requires: [Type, String]

provides: Array

...
*/

Array.implement({

	/*<!ES5>*/
	every: function(fn, bind){
		for (var i = 0, l = this.length >>> 0; i < l; i++){
			if ((i in this) && !fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},
	/*</!ES5>*/

	clean: function(){
		return this.filter(function(item){
			return item != null;
		});
	},

});



/*
---

name: 000OutOfOrder

description: Mock dependency to check for naming order problem.

requires: Array

provides: OutOfOrder

...
*/

var OutOfOrder = function(){};

/*
---

name: Solo

description: Mock dependency with no requires.

provides: Solo

...
*/

var Solo = function(){};
