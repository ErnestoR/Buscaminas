# MineSweeper for Extjs 4.1

## History
While I was checking out http://try.sencha.com I came across this example:
http://try.sencha.com/extjs/4.1.1/community/minesweeper/ by manduks-http://www.armando.mx/#/title

I really liked the example yet it wasn't a complete version of Minesweeper it was missing several configs to make the game fully playable so I decided to create the full version of Minesweeper in Extjs.

##Development
Since I originally thought about extending @manduks I forked his project. Yet when analyzing the code and planning the revealing algorithm I realized that his grid.Panel didn't adjust well to my solution so I created my own UX extending from Ext.view.View