Polytate
========

This will make switching between pages on your website more fun.

Code & Info more will be pushed soon

This script generates, when you look at it from the top side, a convex polygon.
That also explains the name Polytate, Polygon rotate. Apologies if i'm use the terms in an incorrect way.
You'll notice i use the words convex a lot, it's the set of panes (pages) which make the convex polygon.
The script works for n number of panes, 1...n.
  - 3 panes result in an triangle 
  - 4 panes = square
  - 5 panes = pentagon
  - ...

The polygon rotates in the order the items are positioned in the HTML. So when you push the second item i'll to the second pane, from right to left.
When you go from the first to the last pane it won't do the whole rotation back to the beginning but it goes directly from the first to the last.
Which means it rotates from the left to the right and the other way if you go from the last to the first.

The position of the panes gets calculated at 2 events, once upon creation and also when the screen size changes.
The rotation doesn't change the panes but rotates the entire polygon.

Requirements:
  - jQuery (tested version: v1.10.2)
	
Browser support: 
Tested in (with preserve-3d support):
  - Google Chrome : 31.0.1650.63 m
  - Mozilla Firefox : 25.0.1 & 26.0
  - Opera Next : 19.0.1326.21
  - Safari : 5.1.7 (7534.57.2)
  - Opera : 18.0.1284.68

Tested in (without preserve-3d support):
  - Internet Explorer 8 - 11
