# Polytate

Make switching between pages on your website more fun.

CODE will be pushed soon
**Still working on this page**

## Info

The script generates, when you look at it from the top side, a convex polygon.
That also explains the name Polytate, Polygon rotate. Apologies if i'm use the terms in an incorrect way.
You'll notice i use the words convex a lot, it's the set of panes (pages) which make the convex polygon.
The script works for n number of panes, 1...n.
  - 3 panes results in an triangle 
  - 4 panes = square
  - 5 panes = pentagon
  - ...

The polygon rotates in the order the items are positioned in the HTML. So when you push the second item i'll to the second pane, from right to left.
When you go from the first to the last pane it won't do the whole rotation back to the beginning but it goes directly from the first to the last.
Which means it rotates from the left to the right and the other way if you go from the last to the first.

The position of the panes gets calculated at 2 events, once upon creation and also when the screen size changes.
The rotation doesn't change the panes but rotates the entire polygon.

## Usage

First in the HTML head you'll need to add the css and javascript.
```html
	<link rel="stylesheet" type="text/css" href="css/polytate.css" media="screen" />
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/polytate.min.js"></script>
```
The pages you want to use need to be links, A elements in HTML. They also need to have this class: polytate-item
```html
	<ul id="menu">
		<li><a href="one.html" class="polytate-item">One</a></li>
		<li><a href="two.html" class="polytate-item">Two</a></li>
		<li><a href="three.html" class="polytate-item">Three</a></li>
		<li><a href="four.html" class="polytate-item">Four</a></li>
	</ul>
```
At the bottom of the page you can create a Polytate instance, you can call the method by using the global variable, Polytate or $PT
```javascript
	Polytate.createInstance(); //OR $PT.createInstance();
```

### Options
 They are all optional.

 - appendTo: The element the polygon should be appended to, this should be the ID of an element. Values: string
 - context: A context where the instance should search its pages, with class="polytate-item". Values: an Element like in the [Options example][optionexample], a NodeList or a CSS2 selector
 - forceReload: Always force reloading a page on rotation or link click. Values: `true` or `false`
 - preLoad: Preload all the pages into the polygon. Values: `true` or `false` **Attention** This doesn't work in browser which don't support 3d, you could create a fallback by using the `$PT.loadPage()` function.
 - beforeRotate: TODO
 - orientation
 - reverse

### Options example
```javascript
	var options = {
		appendTo		: 'page',
		orientation		: $PT.VERTICAL,
		reverse			: true,
		context			: document.getElementById('menu'),
		preLoad			: true
	};
			
	Polytate.init(); //This is OPTIONAL, else the first creation will handle the initialization
	Polytate.createInstance( options );
```

## Requirements
  - jQuery (tested version: v1.10.2)
	
## Browser support (tested)

With 3d support:
  - Google Chrome : 31.0.1650.63 m
  - Mozilla Firefox : 25.0.1 & 26.0
  - Opera Next : 19.0.1326.21
  - Safari : 5.1.7 (7534.57.2)
  - Opera : 18.0.1284.68

Without 3d support:
  - Internet Explorer 8 - 11

## Author

Klaas Van Parys

## License

Licensed under [MIT][mit]. Enjoy.

[mit]: http://www.opensource.org/licenses/mit-license.php
[jquery]: http://jquery.com/
[exampleoption]: https://github.com/Warsaalk/Polytate#options-example
