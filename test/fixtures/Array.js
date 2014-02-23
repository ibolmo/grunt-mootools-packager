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

/*<1.2compat>*/

Array.alias('extend', 'append');

var $pick = function(){
	return Array.from(arguments).pick();
};

/*</1.2compat>*/
