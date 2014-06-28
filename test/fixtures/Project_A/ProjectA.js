/*
---

name: Main

description: Provides projectA.

provides: [ProjectA, ProjectA.Fn]

...
*/

var projectA = {};
projectA.Fn = function(){
	return 'ProjectA';
};
projectA.name = ['Main'];
