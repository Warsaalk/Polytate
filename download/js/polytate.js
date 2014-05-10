<<<<<<< HEAD
/**
* Polytate v1.0.0
*
* The MIT License (MIT)
* 
* Copyright (c) 2013 Klaas Van Parys (Warsaalk)
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, including without limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
* the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
* FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
* IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
(function(window){
		
		if( !String.prototype.contains )
		{
				//Support for String.contains < ECMAScript 6th Edition
				String.prototype.contains = function( string ){
						return ( this.indexOf( string ) !== -1 ? true : false );
				};
		}
		
		if( !Array.prototype.indexOf )
		{
		
				//Support for Array.indexOf in older browsers IE 8 & lower | < ECMAScript 5th Edition
				Array.prototype.indexOf = function( element ){
						for( var i=0, ilen=this.length; i<ilen; i++ ){
								if( this[i] == element ) return i;
						}
						return -1;
				};	
		
		}
		
		if( !Element.prototype.addEventListener )
		{
		
				//Support for Array.indexOf in older browsers IE 8 & lower | < ECMAScript 5th Edition
				Element.prototype.addEventListener = function( event, callback, bool ){
						var self = this;
						self.attachEvent( 'on'+event, function(e){ callback.call(this,e,self); } ); //Simulate this = attachedElement like addEventListener uses this 
				};	
		
		}
		//Simple function to add and remove classes from Elements
		// Browser support for classList.add & .remove > https://developer.mozilla.org/en-US/docs/Web/API/Element.classList
		if( !Element.addClass && !Element.removeClass )
		{
		
				Element.prototype.addClass = function( name ){
				
						if( typeof this.classList !== "undefined" ){
						
								this.classList.add( name );
						
						}else{
						
								var className = ( this.className.length === 0 ? '' : ' ' ) + name;
								if( !this.className.contains( name ) )
									this.className += className;
									
						}
				
				};
				
				Element.prototype.removeClass = function( name ){
				
						if( typeof this.classList !== "undefined" ){
						
								this.classList.remove( name );
						
						}else{
						
								var className = ( this.className == name ? '' : ' ' ) + name;
								if( this.className.contains( name ) )
									this.className = this.className.replace( className, '' );
									
						}							
				
				};
		
		}
		
		function getByClassName( name ){
							
				var results = [],
					list	= this.getElementsByTagName("*");
					
				for( var i=0, ilen=list.length; i<ilen; i++ ){
				
						if( list[i].className.contains( name ) ) results.push( list[i] );
				
				}
				
				return results;
				
		}
		document.getElementsByClassName 			= document.getElementsByClassName 			|| getByClassName;
		Element.prototype.getElementsByClassName 	= Element.prototype.getElementsByClassName 	|| getByClassName;
		
		if( !Event.prototype.preventDefault )
		{
		
				//Support for Event.preventDefault in IE 8
				Event.prototype.preventDefault = function(){ this.returnValue = false };
				
		}
		
		/**
		*
		* This script generates, when you look at it from the top side, a convex polygon.
		* That also explains the name Polytate, Polygon rotate. Apologies if i'm use the terms in an incorrect way :)
		* You'll notice i use the words convex a lot, it's the set of panes (pages) which make the convex polygon.
		* The script works for n number of panes, 1...n.
		* - 3 panes result in an triangle 
		* - 4 panes = square
		* - 5 panes = pentagon
		* - ...
		*
		* The polygon rotates in the order the items are positioned in the HTML. So when you push the second item i'll to the second pane, from right to left.
		* When you go from the first to the last pane it won't do the whole rotation back to the beginning but it goes directly from the first to the last.
		* Which means it rotates from the left to the right and the other way if you go from the last to the first.
		*
		* The position of the panes gets calculated at 2 events, once upon creation and also when the screen size changes.
		* The rotation doesn't change the panes but rotates the entire polygon.
		*
		* Requirements:
		* - jQuery (tested version: v1.10.2)
		*
		* Browser support: 
		* Tested in (with preserve-3d support):
		*	- Google Chrome : 31.0.1650.63 m
		*	- Mozilla Firefox : 25.0.1 & 26.0
		*	- Opera Next : 19.0.1326.21
		*	- Safari : 5.1.7 (7534.57.2)
		*	- Opera : 18.0.1284.68
		*
		* Tested in (without preserve-3d support):
		*	- Internet Explorer 8 - 11
		*
		**/
		function PolytateObject(){
		
				var _this = this;
		
				this.DOM = {
				
						items 			: [],
						panes 			: [],
						convex 			: document.createElement('div'),
						wrap 			: document.createElement('div')
				
				};
				
				this.indices = []; //Holds all hrefs, for excluding doubles & for searching
				this.maxPane = 0;
				
				this.state	= {
				
						lastPane 		: -1,
						angle 			: 0,
						lastOpposite 	: 0,
						initialRotation : 0
				
				};
				
				//Options
				this.options = {
		
						appendTo 		: null, //Node to append to
						context			: document, //Default context is document
						forceReload		: false, //When using a static website this can be set to false
						preLoad			: false, //Preload all the pages in the panes
						beforeRotate	: function(){}, //Before the rotation & loading starts do something
						orientation		: 0, //Default horizontal rotation
						reverse			: false
				
				};

				this.transformation = {
				
						rotate 			: 'rotateY', //For horizontal rotation we need to turn around the Y-axis
						operand			: 1,
				
						transformPane	: function( Pane, Angle, Opposite ){
								
								Angle = this.processAngle( Angle );
								Pane.style[$PT.browser.Transform] = this.rotate+'('+Angle+'deg) translateZ('+Opposite+'px)'; //Position a pane
						
						},
						
						transformConvex : function( Angle, Opposite ){
						
								Angle = this.processAngle( Angle );
								_this.DOM.convex.style[$PT.browser.Transform] = 'translateZ(-'+Opposite+'px) '+this.rotate+'('+Angle+'deg)'; //Transform the convex
						
						},

						processAngle	: function( Angle ){
						
								return Angle * this.operand;
						
						}
				
				};
		
		}
		
		PolytateObject.prototype.getItems = function(){
				
				var items 	= [],
					context = this.options.context;
				
				if( typeof context === 'string' ){
						
						context = document.querySelectorAll( context ); //Handle selectors, (only CSS2 in IE8)
				
				}else if( context.nodeType ){
				
						context = [ context ]; //Convert "node" to array
						
				}
				//Loop context array for polytate items
				if( context.length ){
				
						for( var i=0,ilen=context.length; i<ilen; i++ ){
								
								items = items.concat( Array.prototype.slice.call( context[i].getElementsByClassName( 'polytate-item' ) ) );
						
						}
						
				}
				
				return items;
		
		};
		
		PolytateObject.prototype.createConvex = function(){
		
				var parent = document.getElementsByTagName('body')[0]; //Default parent for the convex
		
				this.DOM.convex.className 	= 'polytate-convex';			
				this.DOM.wrap.className 	= 'polytate-wrap';

				this.DOM.wrap.appendChild( this.DOM.convex );
				
				if( this.options.appendTo ) {
				
						var to = document.getElementById( this.options.appendTo ); //User defined parent
						if( to ) parent = to;
				
				}
				
				parent.appendChild( this.DOM.wrap );
					
		
		};
		
		PolytateObject.prototype.initPanes = function() {
		
				if( !$PT.support3d ) this.initPane( $PT.no3dIndex ); //Without 3d support we only need to init one pane
		
				var ix = 0, //Actual index for pane/page using href (excludes duplicates)
					_this = this;
		
				for( var i=0, ilen=this.DOM.items.length; i<ilen; i++ ) {
			
						var exists = this.indices.indexOf( this.DOM.items[ i ].href ); //Check if the url is already indexed
						if( exists == -1 ){
						
								if( $PT.support3d ) this.initPane( ix ); //Init pane with specific turn index
								
								this.indices[ ix ] = this.DOM.items[ i ].href;
								this.DOM.items[ i ].setAttribute( 'polytate-turnindex', ix ); //Set turn index
								
								if( $PT.support3d && this.options.preLoad ) $PT.loadPage( this.DOM.items[ i ], this.DOM.panes[ ix ] ); //If preLoad = true, preload the pages in the panes
								
								ix++;
								
						}else{
						
								this.DOM.items[ i ].setAttribute( 'polytate-turnindex', exists ); //Give same turn index as duplicate url
						
						}
						
						if( !$PT.support3d ) this.DOM.items[ i ].setAttribute( 'polytate-no3d', 1 );
						
						//Custom addEventListener for IE8 sends "l" (this) like addEventListener normaly does
						this.DOM.items[ i ].addEventListener( 'click', function(e,l) { _this.changePanel( l || this , e ) }, false);
				
				}
				
				//Calculate the angle for rotation
				// equals the angle between the 2 sides from the left and right side of the pane to the center of the convex polygon.
				this.state.angle = 360 / this.DOM.panes.length;
		
		};
		
		PolytateObject.prototype.initPane = function ( i ){
		
				var pane = document.createElement( 'div' ),
					text = document.createTextNode( 'This is pane '+i );
					
				//pane.appendChild( text );
				pane.className = 'polytate-pane';
				pane.setAttribute( 'polytate-state', 'inited' );
				
				this.DOM.panes[ i ] = pane;
				this.DOM.convex.appendChild( this.DOM.panes[ i ] );
		
		};
		
		PolytateObject.prototype.changePanel = function ( item, e ){
			
				e.preventDefault(); //Cancel the normal click behaviour
		
				var no3d		= item.hasAttribute( 'polytate-no3d' ), 
					clicked 	= item.getAttribute( 'polytate-turnindex' ), //Get pane index
					pane		= ( no3d ? this.DOM.panes[ $PT.no3dIndex ] : this.DOM.panes[ clicked ] ),
					paneState	= pane.getAttribute( 'polytate-state' ),
					load		= false; //For reloading the page
				
				//Set selected state to clicked item
				if( this.state.lastPane != -1 ) this.DOM.items[ this.state.lastPane ].removeClass( 'polytate-selected' );
				this.DOM.items[ clicked ].addClass( 'polytate-selected' );
				
				//If the user want to do something before everything starts spinning 
				if( typeof this.options.beforeRotate === 'function' ) this.options.beforeRotate.call( null, item, pane );
				
				//We only have one pane so we always have to load the new page
				// or when the same item is clicked and forceReload is true
				if( no3d || ( clicked == this.state.lastPane && this.options.forceReload ) ) load = true; 
				else{
						
						if( clicked != this.state.lastPane ){
								
								if( this.state.lastPane == -1 ) this.state.lastPane = 0; //Initial state
								
								var diff = 0;
								if( clicked == 0 && this.state.lastPane == this.maxPane ) 		diff = 1; //Rotate from last to first pane, from right to left
								else if( clicked == this.maxPane && this.state.lastPane == 0 ) 	diff = -1; //Rotate from first to last pane, from left to right
								else 															diff = clicked - this.state.lastPane; //Calculate difference/"distance" between panes
								
								this.state.initialRotation -= this.state.angle * diff; //Example: From pane 1 tot 3, diff = 2, so rotate - 180 degrees (with 90deg angle, 4 panes)
								this.transformation.transformConvex( this.state.initialRotation, this.state.lastOpposite );
								
								load = !( paneState == 'loaded' && !this.options.forceReload ); //Don't load when pane is already loaded and forceReload is false, else always load
								
								
						}			
						
				}
				
				if( load ) $PT.loadPage( item, pane );
				
				this.state.lastPane = clicked;
		
		};
		
		PolytateObject.prototype.initConvex	= function() {
		
				if( !$PT.support3d ) return;
		
				//For Horizontal rotation we need the client Width for the calculations and for vertical rotation we need client Height
				var size			= ( this.options.orientation === $PT.VERTICAL ? this.DOM.convex.clientHeight : this.DOM.convex.clientWidth );
		
				var Adjacent 		= size/2, //Get half of the side so we can make a right angled triangle to the center point of the polygon
					Theta			= ( 180 - this.state.angle ) / 2, //angle from left point of the side to center point of the polygon
					radians			= ( Theta ) * Math.PI / 180, //Calculate radians of Theta
					Opposite  		= Math.tan( radians ) * Adjacent; //Apply the TOA formule the get the Opposite 
				
				this.state.lastOpposite 	= Opposite; //Save last Opposite
				
				for( var i=0, ilen=this.DOM.panes.length; i<ilen; i++ ) {
		
						var pane 	= this.DOM.panes[ i ],
							iAngle 	= this.state.angle * i;
						
						if( this.state.angle == 360 ){ iAngle = 0; Opposite = 0; } //There is only 1 pane and we don't want to turn that one 360° or translate it
						if( this.state.angle == 180 && i > 0 ) Opposite = 1; //There are only 2 panes and we don't want that they overlap so we translate the 2nd by 1px
						
						pane.style.lineHeight = this.DOM.convex.clientHeight+'px'; //TODO: remove when using in live version, this is only for a test purpose
						
						this.transformation.transformPane( pane, iAngle, Opposite );
				
				}
			
				this.transformation.transformConvex( this.state.initialRotation, this.state.lastOpposite );
				this.DOM.convex.style[$PT.browser.TransformOrigin]	= '50% 50%';
				this.DOM.wrap.style[$PT.browser.Perspective] 		= size*this.DOM.panes.length+'px'; //Larger perspective when there are more panes	
	
		};
		
		var Polytate = $PT = {
		
				//Orientation constants
				HORIZONTAL 	: 0,
				VERTICAL 	: 1,
				
				//State constants
				READY 		: 0,
				INITED		: 1,
				
				browser		: {
				
						//Default transform styles
						Transform 		: "transform",
						TransformStyle 	: "transformStyle",
						TransformOrigin : "transformOrigin",
						Perspective 	: "perspective"
					
				},
				
				support3d	: false,
				no3dIndex	: 'no3d',
				ajaxLoader	: false,			
				instances	: [], //Polytate objects
				state		: 0, //Default state
		
				init 		: function(){

						$PT.initJsTransformProps(); //Init browser style support
						$PT.test3dSupport(); //Test 3d support
						
						if( typeof window.jQuery !== "undefined" ) $PT.ajaxLoader = true; //We need jQuery to load the pages
						
						$PT.state = $PT.INITED;
						
						return $PT.support3d;

				},
				
				createInstance : function( options ){
				
						if( $PT.state === $PT.READY ) $PT.init(); //If Polytate isn't inited yet, init it :)
				
						var Poly = new PolytateObject();
				
						//Merge the user defined options with the default ones. (User overrides default)
						Poly.options 	= $PT.mergeObjects( Poly.options, options || {} );
						//Get the menu items which need to be used for the convex
						Poly.DOM.items 	= Poly.getItems();

						if( Poly.options.orientation === $PT.VERTICAL ) 	Poly.transformation.rotate = 'rotateX'; //For vertical rotation we need to turn around the X-axis 
						if( Poly.options.reverse	!== false ) 			Poly.transformation.operand= -1; //For reverse rotation make the operand negative so the degrees will also be negative
						
						Poly.createConvex();	//Start creating the convex and wrapper element
						Poly.initPanes(); //Create the panes
								
						if( $PT.support3d ){
						
								Poly.initConvex(); //When 3d is supported calculate the convex and position its panes

						}
						
						Poly.maxPane 	= Poly.indices.length - 1; //Max pane index
						
						$PT.instances.push( Poly );
														
						return Poly;

				},
				
				initJsTransformProps : function() {
				
						//Crashes in IE 8, but as IE 8 doesn't support transformations there's no need to check it.
						if( window.getComputedStyle ){
				
								var test 	= window.getComputedStyle( document.documentElement, '' ), 
									prefix 	= "";
							
								if( typeof test.webkitTransform !== "undefined" ) 	prefix = "Webkit";
								if( typeof test.MozTransform !== "undefined" )		prefix = "Moz"; 
								if( typeof test.msTransform !== "undefined" ) 		prefix = "ms";
								if( typeof test.oTransform !== "undefined" ) 		prefix = "O";
								
								if( prefix != "" ){
								
										$PT.browser.Transform 		= prefix + "Transform"; 
										$PT.browser.TransformStyle 	= prefix + "TransformStyle"; 
										$PT.browser.TransformOrigin = prefix + "TransformOrigin"; 
										$PT.browser.Perspective 	= prefix + "Perspective";
								
								}
						
						}
				
				},
				
				test3dSupport	: function() {
						
						var testDiv = document.createElement('div'); //Element to test 3dsupport
						
						//Test if convex has the correct transform style 
						if( testDiv.style[ $PT.browser.TransformStyle ] !== undefined ){
						
								testDiv.style[ $PT.browser.TransformStyle ] = 'preserve-3d'; 
								if( testDiv.style[ $PT.browser.TransformStyle ] == 'preserve-3d' ) 
									$PT.support3d = true; //Test if the preserve-3d value is accepted
						
						}
				
				},
				
				reloadConvexes	: function(){
				
						for( var i=0,ilen=$PT.instances.length; i<ilen; i++ ){
						
								$PT.instances[ i ].initConvex();
								
						}
				
				},
				
				//Simpel ajax function
				loadPage		: function( item, pane, ajaxOpt ) {
				
						$PT.clearPane( pane );
						
						var page = item.href,
							load = document.createElement( 'div' );
						
						load.className = 'polytate-loader';
						pane.appendChild( load );
						
						var	aopt = {
						
								url 		: page,
								dataType 	: 'html',
								beforeSend 	: function( xhr, props ){
										xhr.PolytatePane = pane; //Send pane with the xhr, to make sure we append to the right pane when loading is done.
										xhr.PolytateItem = item; //
								},
								success 	: $PT.ajax.Success,
								error 		: $PT.ajax.Error
						
						};
						
						aopt = $PT.mergeObjects( aopt, ajaxOpt );
						
						$.ajax( aopt );
				
				},
				//Clear a pane
				clearPane		: function( pane ){
				
						while( pane.firstChild ){
								pane.removeChild( pane.firstChild );
						}
				
				},
				
				ajax 			: {
				
						Success		: function( data, status, xhr ) {
				
								var pane = xhr.PolytatePane;
						
								$( pane ).html( data );
								pane.setAttribute( 'polytate-state', 'loaded' );
								
								if( pane.scrollHeight > pane.offsetHeight ) pane.addClass( 'polytate-scrollbar' );
						
						},
						
						Error		: function( xhr, status, error ) {
						
								var pane = xhr.PolytatePane;
						
								$( pane ).html( '<h1>Could not handle page request</h1>' );
								pane.setAttribute( 'polytate-state', 'failed' );
						
						}
				
				},
				
				mergeObjects	: function( obj1, obj2 ){
				
						var newObj = obj1;
						for( i in obj2 ){
						
								newObj[ i ] = obj2[ i ];
						
						}
						return newObj;
				
				}
		
		};
		
		window.onresize = $PT.reloadConvexes; //Adjust the Convex when the window resizes
		window.Polytate = $PT;
		
=======
/**
* Polytate v1.0.0
*
* The MIT License (MIT)
* 
* Copyright (c) 2013 Klaas Van Parys (Warsaalk)
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, including without limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
* the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
* FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
* IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
(function(window){
		
		if( !String.prototype.contains )
		{
				//Support for String.contains < ECMAScript 6th Edition
				String.prototype.contains = function( string ){
						return ( this.indexOf( string ) !== -1 ? true : false );
				};
		}
		
		if( !Array.prototype.indexOf )
		{
		
				//Support for Array.indexOf in older browsers IE 8 & lower | < ECMAScript 5th Edition
				Array.prototype.indexOf = function( element ){
						for( var i=0, ilen=this.length; i<ilen; i++ ){
								if( this[i] == element ) return i;
						}
						return -1;
				};	
		
		}
		
		if( !Element.prototype.addEventListener )
		{
		
				//Support for Array.indexOf in older browsers IE 8 & lower | < ECMAScript 5th Edition
				Element.prototype.addEventListener = function( event, callback, bool ){
						var self = this;
						self.attachEvent( 'on'+event, function(e){ callback.call(this,e,self); } ); //Simulate this = attachedElement like addEventListener uses this 
				};	
		
		}
		//Simple function to add and remove classes from Elements
		// Browser support for classList.add & .remove > https://developer.mozilla.org/en-US/docs/Web/API/Element.classList
		if( !Element.addClass && !Element.removeClass )
		{
		
				Element.prototype.addClass = function( name ){
				
						if( typeof this.classList !== "undefined" ){
						
								this.classList.add( name );
						
						}else{
						
								var className = ( this.className.length === 0 ? '' : ' ' ) + name;
								if( !this.className.contains( name ) )
									this.className += className;
									
						}
				
				};
				
				Element.prototype.removeClass = function( name ){
				
						if( typeof this.classList !== "undefined" ){
						
								this.classList.remove( name );
						
						}else{
						
								var className = ( this.className == name ? '' : ' ' ) + name;
								if( this.className.contains( name ) )
									this.className = this.className.replace( className, '' );
									
						}							
				
				};
		
		}
		
		function getByClassName( name ){
							
				var results = [],
					list	= this.getElementsByTagName("*");
					
				for( var i=0, ilen=list.length; i<ilen; i++ ){
				
						if( list[i].className.contains( name ) ) results.push( list[i] );
				
				}
				
				return results;
				
		}
		document.getElementsByClassName 			= document.getElementsByClassName 			|| getByClassName;
		Element.prototype.getElementsByClassName 	= Element.prototype.getElementsByClassName 	|| getByClassName;
		
		if( !Event.prototype.preventDefault )
		{
		
				//Support for Event.preventDefault in IE 8
				Event.prototype.preventDefault = function(){ this.returnValue = false };
				
		}
		
		/**
		*
		* This script generates, when you look at it from the top side, a convex polygon.
		* That also explains the name Polytate, Polygon rotate. Apologies if i'm use the terms in an incorrect way :)
		* You'll notice i use the words convex a lot, it's the set of panes (pages) which make the convex polygon.
		* The script works for n number of panes, 1...n.
		* - 3 panes result in an triangle 
		* - 4 panes = square
		* - 5 panes = pentagon
		* - ...
		*
		* The polygon rotates in the order the items are positioned in the HTML. So when you push the second item i'll to the second pane, from right to left.
		* When you go from the first to the last pane it won't do the whole rotation back to the beginning but it goes directly from the first to the last.
		* Which means it rotates from the left to the right and the other way if you go from the last to the first.
		*
		* The position of the panes gets calculated at 2 events, once upon creation and also when the screen size changes.
		* The rotation doesn't change the panes but rotates the entire polygon.
		*
		* Requirements:
		* - jQuery (tested version: v1.10.2)
		*
		* Browser support: 
		* Tested in (with preserve-3d support):
		*	- Google Chrome : 31.0.1650.63 m
		*	- Mozilla Firefox : 25.0.1 & 26.0
		*	- Opera Next : 19.0.1326.21
		*	- Safari : 5.1.7 (7534.57.2)
		*	- Opera : 18.0.1284.68
		*
		* Tested in (without preserve-3d support):
		*	- Internet Explorer 8 - 11
		*
		**/
		function PolytateObject(){
		
				var _this = this;
		
				this.DOM = {
				
						items 			: [],
						panes 			: [],
						convex 			: document.createElement('div'),
						wrap 			: document.createElement('div')
				
				};
				
				this.indices = []; //Holds all hrefs, for excluding doubles & for searching
				this.maxPane = 0;
				
				this.state	= {
				
						lastPane 		: -1,
						angle 			: 0,
						lastOpposite 	: 0,
						initialRotation : 0
				
				};
				
				//Options
				this.options = {
		
						appendTo 		: null, //Node to append to
						context			: document, //Default context is document
						forceReload		: false, //When using a static website this can be set to false
						preLoad			: false, //Preload all the pages in the panes
						beforeRotate	: function(){}, //Before the rotation & loading starts do something
						orientation		: 0, //Default horizontal rotation
						reverse			: false
				
				};

				this.transformation = {
				
						rotate 			: 'rotateY', //For horizontal rotation we need to turn around the Y-axis
						operand			: 1,
				
						transformPane	: function( Pane, Angle, Opposite ){
								
								Angle = this.processAngle( Angle );
								Pane.style[$PT.browser.Transform] = this.rotate+'('+Angle+'deg) translateZ('+Opposite+'px)'; //Position a pane
						
						},
						
						transformConvex : function( Angle, Opposite ){
						
								Angle = this.processAngle( Angle );
								_this.DOM.convex.style[$PT.browser.Transform] = 'translateZ(-'+Opposite+'px) '+this.rotate+'('+Angle+'deg)'; //Transform the convex
						
						},

						processAngle	: function( Angle ){
						
								return Angle * this.operand;
						
						}
				
				};
		
		}
		
		PolytateObject.prototype.getItems = function(){
				
				var items 	= [],
					context = this.options.context;
				
				if( typeof context === 'string' ){
						
						context = document.querySelectorAll( context ); //Handle selectors, (only CSS2 in IE8)
				
				}else if( context.nodeType ){
				
						context = [ context ]; //Convert "node" to array
						
				}
				//Loop context array for polytate items
				if( context.length ){
				
						for( var i=0,ilen=context.length; i<ilen; i++ ){
								
								items = items.concat( Array.prototype.slice.call( context[i].getElementsByClassName( 'polytate-item' ) ) );
						
						}
						
				}
				
				return items;
		
		};
		
		PolytateObject.prototype.createConvex = function(){
		
				var parent = document.getElementsByTagName('body')[0]; //Default parent for the convex
		
				this.DOM.convex.className 	= 'polytate-convex';			
				this.DOM.wrap.className 	= 'polytate-wrap';

				this.DOM.wrap.appendChild( this.DOM.convex );
				
				if( this.options.appendTo ) {
				
						var to = document.getElementById( this.options.appendTo ); //User defined parent
						if( to ) parent = to;
				
				}
				
				parent.appendChild( this.DOM.wrap );
					
		
		};
		
		PolytateObject.prototype.initPanes = function() {
		
				if( !$PT.support3d ) this.initPane( $PT.no3dIndex ); //Without 3d support we only need to init one pane
		
				var ix = 0, //Actual index for pane/page using href (excludes duplicates)
					_this = this;
		
				for( var i=0, ilen=this.DOM.items.length; i<ilen; i++ ) {
			
						var exists = this.indices.indexOf( this.DOM.items[ i ].href ); //Check if the url is already indexed
						if( exists == -1 ){
						
								if( $PT.support3d ) this.initPane( ix ); //Init pane with specific turn index
								
								this.indices[ ix ] = this.DOM.items[ i ].href;
								this.DOM.items[ i ].setAttribute( 'polytate-turnindex', ix ); //Set turn index
								
								if( $PT.support3d && this.options.preLoad ) $PT.loadPage( this.DOM.items[ i ], this.DOM.panes[ ix ] ); //If preLoad = true, preload the pages in the panes
								
								ix++;
								
						}else{
						
								this.DOM.items[ i ].setAttribute( 'polytate-turnindex', exists ); //Give same turn index as duplicate url
						
						}
						
						if( !$PT.support3d ) this.DOM.items[ i ].setAttribute( 'polytate-no3d', 1 );
						
						//Custom addEventListener for IE8 sends "l" (this) like addEventListener normaly does
						this.DOM.items[ i ].addEventListener( 'click', function(e,l) { _this.changePanel( l || this , e ) }, false);
				
				}
				
				//Calculate the angle for rotation
				// equals the angle between the 2 sides from the left and right side of the pane to the center of the convex polygon.
				this.state.angle = 360 / this.DOM.panes.length;
		
		};
		
		PolytateObject.prototype.initPane = function ( i ){
		
				var pane = document.createElement( 'div' ),
					text = document.createTextNode( 'This is pane '+i );
					
				//pane.appendChild( text );
				pane.className = 'polytate-pane';
				pane.setAttribute( 'polytate-state', 'inited' );
				
				this.DOM.panes[ i ] = pane;
				this.DOM.convex.appendChild( this.DOM.panes[ i ] );
		
		};
		
		PolytateObject.prototype.changePanel = function ( item, e ){
			
				e.preventDefault(); //Cancel the normal click behaviour
		
				var no3d		= item.hasAttribute( 'polytate-no3d' ), 
					clicked 	= item.getAttribute( 'polytate-turnindex' ), //Get pane index
					pane		= ( no3d ? this.DOM.panes[ $PT.no3dIndex ] : this.DOM.panes[ clicked ] ),
					paneState	= pane.getAttribute( 'polytate-state' ),
					load		= false; //For reloading the page
				
				//Set selected state to clicked item
				if( this.state.lastPane != -1 ) this.DOM.items[ this.state.lastPane ].removeClass( 'polytate-selected' );
				this.DOM.items[ clicked ].addClass( 'polytate-selected' );
				
				//If the user want to do something before everything starts spinning 
				if( typeof this.options.beforeRotate === 'function' ) this.options.beforeRotate.call( null, item, pane );
				
				//We only have one pane so we always have to load the new page
				// or when the same item is clicked and forceReload is true
				if( no3d || ( clicked == this.state.lastPane && this.options.forceReload ) ) load = true; 
				else{
						
						if( clicked != this.state.lastPane ){
								
								if( this.state.lastPane == -1 ) this.state.lastPane = 0; //Initial state
								
								var diff = 0;
								if( clicked == 0 && this.state.lastPane == this.maxPane ) 		diff = 1; //Rotate from last to first pane, from right to left
								else if( clicked == this.maxPane && this.state.lastPane == 0 ) 	diff = -1; //Rotate from first to last pane, from left to right
								else 															diff = clicked - this.state.lastPane; //Calculate difference/"distance" between panes
								
								this.state.initialRotation -= this.state.angle * diff; //Example: From pane 1 tot 3, diff = 2, so rotate - 180 degrees (with 90deg angle, 4 panes)
								this.transformation.transformConvex( this.state.initialRotation, this.state.lastOpposite );
								
								load = !( paneState == 'loaded' && !this.options.forceReload ); //Don't load when pane is already loaded and forceReload is false, else always load
								
								
						}			
						
				}
				
				if( load ) $PT.loadPage( item, pane );
				
				this.state.lastPane = clicked;
		
		};
		
		PolytateObject.prototype.initConvex	= function() {
		
				if( !$PT.support3d ) return;
		
				//For Horizontal rotation we need the client Width for the calculations and for vertical rotation we need client Height
				var size			= ( this.options.orientation === $PT.VERTICAL ? this.DOM.convex.clientHeight : this.DOM.convex.clientWidth );
		
				var Adjacent 		= size/2, //Get half of the side so we can make a right angled triangle to the center point of the polygon
					Theta			= ( 180 - this.state.angle ) / 2, //angle from left point of the side to center point of the polygon
					radians			= ( Theta ) * Math.PI / 180, //Calculate radians of Theta
					Opposite  		= Math.tan( radians ) * Adjacent; //Apply the TOA formule the get the Opposite 
				
				this.state.lastOpposite 	= Opposite; //Save last Opposite
				
				for( var i=0, ilen=this.DOM.panes.length; i<ilen; i++ ) {
		
						var pane 	= this.DOM.panes[ i ],
							iAngle 	= this.state.angle * i;
						
						if( this.state.angle == 360 ){ iAngle = 0; Opposite = 0; } //There is only 1 pane and we don't want to turn that one 360° or translate it
						if( this.state.angle == 180 && i > 0 ) Opposite = 1; //There are only 2 panes and we don't want that they overlap so we translate the 2nd by 1px
						
						pane.style.lineHeight = this.DOM.convex.clientHeight+'px'; //TODO: remove when using in live version, this is only for a test purpose
						
						this.transformation.transformPane( pane, iAngle, Opposite );
				
				}
			
				this.transformation.transformConvex( this.state.initialRotation, this.state.lastOpposite );
				this.DOM.convex.style[$PT.browser.TransformOrigin]	= '50% 50%';
				this.DOM.wrap.style[$PT.browser.Perspective] 		= size*this.DOM.panes.length+'px'; //Larger perspective when there are more panes	
	
		};
		
		var Polytate = $PT = {
		
				//Orientation constants
				HORIZONTAL 	: 0,
				VERTICAL 	: 1,
				
				//State constants
				READY 		: 0,
				INITED		: 1,
				
				browser		: {
				
						//Default transform styles
						Transform 		: "transform",
						TransformStyle 	: "transformStyle",
						TransformOrigin : "transformOrigin",
						Perspective 	: "perspective"
					
				},
				
				support3d	: false,
				no3dIndex	: 'no3d',
				ajaxLoader	: false,			
				instances	: [], //Polytate objects
				state		: 0, //Default state
		
				init 		: function(){

						$PT.initJsTransformProps(); //Init browser style support
						$PT.test3dSupport(); //Test 3d support
						
						if( typeof window.jQuery !== "undefined" ) $PT.ajaxLoader = true; //We need jQuery to load the pages
						
						$PT.state = $PT.INITED;
						
						return $PT.support3d;

				},
				
				createInstance : function( options ){
				
						if( $PT.state === $PT.READY ) $PT.init(); //If Polytate isn't inited yet, init it :)
				
						var Poly = new PolytateObject();
				
						//Merge the user defined options with the default ones. (User overrides default)
						Poly.options 	= $PT.mergeObjects( Poly.options, options || {} );
						//Get the menu items which need to be used for the convex
						Poly.DOM.items 	= Poly.getItems();

						if( Poly.options.orientation === $PT.VERTICAL ) 	Poly.transformation.rotate = 'rotateX'; //For vertical rotation we need to turn around the X-axis 
						if( Poly.options.reverse	!== false ) 			Poly.transformation.operand= -1; //For reverse rotation make the operand negative so the degrees will also be negative
						
						Poly.createConvex();	//Start creating the convex and wrapper element
						Poly.initPanes(); //Create the panes
								
						if( $PT.support3d ){
						
								Poly.initConvex(); //When 3d is supported calculate the convex and position its panes

						}
						
						Poly.maxPane 	= Poly.indices.length - 1; //Max pane index
						
						$PT.instances.push( Poly );
														
						return Poly;

				},
				
				initJsTransformProps : function() {
				
						//Crashes in IE 8, but as IE 8 doesn't support transformations there's no need to check it.
						if( window.getComputedStyle ){
				
								var test 	= window.getComputedStyle( document.documentElement, '' ), 
									prefix 	= "";
							
								if( typeof test.webkitTransform !== "undefined" ) 	prefix = "Webkit";
								if( typeof test.MozTransform !== "undefined" )		prefix = "Moz"; 
								if( typeof test.msTransform !== "undefined" ) 		prefix = "ms";
								if( typeof test.oTransform !== "undefined" ) 		prefix = "O";
								
								if( prefix != "" ){
								
										$PT.browser.Transform 		= prefix + "Transform"; 
										$PT.browser.TransformStyle 	= prefix + "TransformStyle"; 
										$PT.browser.TransformOrigin = prefix + "TransformOrigin"; 
										$PT.browser.Perspective 	= prefix + "Perspective";
								
								}
						
						}
				
				},
				
				test3dSupport	: function() {
						
						var testDiv = document.createElement('div'); //Element to test 3dsupport
						
						//Test if convex has the correct transform style 
						if( testDiv.style[ $PT.browser.TransformStyle ] !== undefined ){
						
								testDiv.style[ $PT.browser.TransformStyle ] = 'preserve-3d'; 
								if( testDiv.style[ $PT.browser.TransformStyle ] == 'preserve-3d' ) 
									$PT.support3d = true; //Test if the preserve-3d value is accepted
						
						}
				
				},
				
				reloadConvexes	: function(){
				
						for( var i=0,ilen=$PT.instances.length; i<ilen; i++ ){
						
								$PT.instances[ i ].initConvex();
								
						}
				
				},
				
				//Simpel ajax function
				loadPage		: function( item, pane, ajaxOpt ) {
				
						$PT.clearPane( pane );
						
						var page = item.href,
							load = document.createElement( 'div' );
						
						load.className = 'polytate-loader';
						pane.appendChild( load );
						
						var	aopt = {
						
								url 		: page,
								dataType 	: 'html',
								beforeSend 	: function( xhr, props ){
										xhr.PolytatePane = pane; //Send pane with the xhr, to make sure we append to the right pane when loading is done.
										xhr.PolytateItem = item; //
								},
								success 	: $PT.ajax.Success,
								error 		: $PT.ajax.Error
						
						};
						
						aopt = $PT.mergeObjects( aopt, ajaxOpt );
						
						$.ajax( aopt );
				
				},
				//Clear a pane
				clearPane		: function( pane ){
				
						while( pane.firstChild ){
								pane.removeChild( pane.firstChild );
						}
				
				},
				
				ajax 			: {
				
						Success		: function( data, status, xhr ) {
				
								var pane = xhr.PolytatePane;
						
								$( pane ).html( data );
								pane.setAttribute( 'polytate-state', 'loaded' );
								
								if( pane.scrollHeight > pane.offsetHeight ) pane.addClass( 'polytate-scrollbar' );
						
						},
						
						Error		: function( xhr, status, error ) {
						
								var pane = xhr.PolytatePane;
						
								$( pane ).html( '<h1>Could not handle page request</h1>' );
								pane.setAttribute( 'polytate-state', 'failed' );
						
						}
				
				},
				
				mergeObjects	: function( obj1, obj2 ){
				
						var newObj = obj1;
						for( i in obj2 ){
						
								newObj[ i ] = obj2[ i ];
						
						}
						return newObj;
				
				}
		
		};
		
		window.onresize = $PT.reloadConvexes; //Adjust the Convex when the window resizes
		window.Polytate = $PT;
		
>>>>>>> branch 'master' of https://github.com/Warsaalk/Polytate.git
})(window);
