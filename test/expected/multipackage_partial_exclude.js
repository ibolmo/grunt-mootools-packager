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
