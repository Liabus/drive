//requestAnimationFrame Shim:
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


(function(global){

  var count = 0;

  function timeGen(tree, relTo, val, $el){
    if(val === 'height'){
      return $el.height();
    };
    if(!relTo || !tree[relTo]) return val;
    var vals = relTo.split('.');
    var t = tree[vals[0]];
    var type = 'start';
    if(vals.length > 1){
      type = vals[1];
    }
    return t[type] + val;
  };

  //Animations should be the timeline. Pos is the current scroll position:
  function getAnimationsForFrame(animations, pos){

    // Array of active animations
    var active = [];

    // Find the active animations
    for(var i = 0; i < animations.length; i++){
      // If the position is within the range of animation
      if(animations[i].start <= pos && animations[i].end >= pos) {
        active.push(animations[i]);
      }
    }

    return active;
  };
  
  function getMaxHeight(animations){
    var h = 0;
    for(var i = 0; i < animations.length; i++){
      
      h = Math.max(h, animations[i].end);
    }
    return h;
  };

  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault){
      e.preventDefault();
    }
    e.returnValue = false;
  };

  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  var keys = [
    {key: 38, dir: 'up'},
    {key: 40, dir: 'down'},
    {key: 32, dir: 'down'},
    {key: 42, dir: 'down'}
  ];
 
  var drive = function drive(selector, options){

    //Setup scrolling intercept:
    var scrollPos = 0;
    
    var maxHeight = 0;

    function keydown(e) {
      for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i].key) {
          if(keys[i].dir === 'up'){
            scroll({wheelDeltaY: -100});
          }else{
            scroll({wheelDeltaY: 100});
          }
          return;
        }
      }
    };

    function scroll(e) {
      preventDefault(e);
      
      scrollPos += e.wheelDeltaY/10;
      
      if(scrollPos < 0) scrollPos = 0;
      if(scrollPos > maxHeight) scrollPos = maxHeight;
    };
    
    if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', scroll, false);
    }
    window.onmousewheel = document.onmousewheel = scroll;
    document.onkeydown = keydown;
    

    //Grab a reference to the element.
    var $el = $(selector);
    
    $el.children().each(function(i, child){
      $(child).addClass('drive-block')
    });
    
    //TODO: hide all elements under the selector, position fixed (or absolute).
 
    //Retrieve the height:
    var height = options.height || $el.height();

    //Get the elements from the options object:
    var elements = options.elements;

    var tree = {};

    var timeline = [];
    //Keep track of the tree elements that we are currently animating, so we can apply before/after CSS.
    var animating = {};
 
    //Loop through the elements:
    for(var i = 0; i < elements.length; i++){
      var el = elements[i];

      var $el = $(el.selector);

      //pull out parts:
      var animations = el.animations;
      
      var tl = el.timeline;
      
      var relative = tl.relative || el.relative || false;
      
      if(!el.name){
        el.name = 'drive-dy-' + ++count;
      }

      var t = {
        $: $el,
        height: $el.height(),
        start: timeGen(tree, relative, tl.start, $el),
        end: timeGen(tree, relative, tl.end, $el)
      };
      
      tree[el.name] = t;

      /*
      // TODO: Do we add the selector to the tree?
      if(!el.selector) {
        tree[el.name].selector = el.selector;
      }*/

      //Loop through the animations:

      // Check if an animation had been inserted
      var inserted = false;

      // Loop through the animations
      for(var j = 0; j < animations.length; j++){
        //Just push, we can sort later:
        timeline.push({
          $: $el,
          element: el,
          animation: animations[j],
          start: t.start,
          end: t.end
        });
      };
    };
    
    maxHeight = getMaxHeight(timeline);
    
    
    function animationLoop(){
      requestAnimationFrame(animationLoop);
      
      var anims = getAnimationsForFrame(timeline, scrollPos);
      var percent = 0;
      var lc = '';
      
      for(var i = 0; i < anims.length; i++){
        var an = anims[i];
        
        percent = (scrollPos) / (an.end - an.start);
        lc = an.animation.property.toLowerCase();
        
        var unit = an.animation.start.slice(-1);
        
        var sv = parseInt(an.animation.start);
        var ev = parseInt(an.animation.end);
        var diff = sv - ev;
        var neg = an.animation.start.charAt(0) === '-' ? true : false;
        
        //Generic Translatey/scroll property
        if(lc === 'translatey' || lc === 'scroll'){
          an.$.css('transform', 'translateY(' + (neg ? '-' : '') + (percent * diff) + unit + ')');
        }
      }
      
    };
    
    requestAnimationFrame(animationLoop);
    

    return 'smile';

  };




  //Add Drive to the global variable.
  global.drive = drive;

})(window);
