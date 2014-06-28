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

/*
---

name: B part of ProjectA

description: ProjectB, extending ProjectA

requires: [ProjectA/ProjectA]

provides: ProjectB

...
*/

var projectB = function(){
	return [projectA.name].concat('ProjectB');
};
