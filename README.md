# Polytate

Make switching between pages on your website more fun.

CODE will be pushed soon
**Still working on this page**

## Index
- [Live example][link0]
- [Demo][link1]
- [Info][link2]
- [Usage][link3]
- [Options][link4]
- [Options example][link5]
- [Requirements][link6]
- [Browser support][link7]
- [License][link8]

## Live example

I designed Polytate for one of my website, [UniverseView](http://universeview.be).

## Demo

The demo is hosted on my website.
Link to the: [Demo][demo]

Feel free to inspect the HTML and other code to view how Polytate is used.

Polytate options used in demo:
**Right Polytate**
```javascript
	{
		appendTo		: 'hor',
		orientation		: $PT.HORIZONTAL,
		reverse			: false,
		context			: '#hori'
	}
```
**Left Polytate**
```javascript
	{
			
		appendTo		: 'ver',
		orientation		: $PT.VERTICAL,
		reverse			: true,
		context			: document.getElementById('vert'),
		preLoad			: true
	}
```

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
The pages you want to use need to be links, A elements in HTML, i call them items. They also need to have this class: polytate-item. When the same link is used in the same context, they'll point to the same pane.
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

| Option      	| Values/Types        | Description                                                                                                        |
| ------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `appendTo`    | `string`   		  | The element the polygon should be appended to, the string must be the ID of an element. |
| `context` 	| `Node`, `NodeList` or `selector`   | A context where the instance should search its items, with *class="polytate-item"*. The selector is limited to CSS2 selectors. |
| `forceReload`    | `true` or `false`   | Always force reloading a page on rotation or item click. |
| `preLoad`    | `true` or `false`   | Preload all the pages into the polygon. **Attention:** This doesn't work in browsers which don't support 3d, you could create a fallback by using the `$PT.loadPage()` function when the site is loaded. |
| `beforeRotate`     | `function` | An callback function which needs to be executed before the polygon starts rotating. |
| `orientation`     | `$PT.HORIZONTAL` or `$PT.VERTICAL` | The orientation of the rotation and panes. `$PT.HORIZONTAL` uses rotation around the x-axis and `$PT.VERTICAL` around the z-axis. |
| `reverse`    | `true` or `false`           | Reverse the rotation. |

### Options example
```javascript
	var options = {
		appendTo		: 'page', //Append to the element with ID "page"
		orientation		: $PT.VERTICAL, //Use vertical rotation
		reverse			: true, //Reverse the rotation
		context			: document.getElementById('menu'), //Append to the element with ID "menu"
		preLoad			: true //Preload all the pages
	};
			
	Polytate.init(); //This is OPTIONAL, if not present the first creation will handle the initialization
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

Licensed under [MIT][mit]. Have fun.

[mit]: http://www.opensource.org/licenses/mit-license.php
[demo]: http://polytate.warsaalk.be/
[jquery]: http://jquery.com/
[link0]: https://github.com/Warsaalk/Polytate#live-example
[link1]: https://github.com/Warsaalk/Polytate#demo
[link2]: https://github.com/Warsaalk/Polytate#info
[link3]: https://github.com/Warsaalk/Polytate#usage
[link4]: https://github.com/Warsaalk/Polytate#options
[link5]: https://github.com/Warsaalk/Polytate#options-example
[link6]: https://github.com/Warsaalk/Polytate#requirements
[link7]: https://github.com/Warsaalk/Polytate#browser-support-tested
[link8]: https://github.com/Warsaalk/Polytate#license
