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

name: Secondary

description: ProjectA.Secondary, just a small extension

requires: [/ProjectA]

provides: [ProjectA.Secondary]

...
*/

projectA.name = projectA.name.concat('Secondary');
