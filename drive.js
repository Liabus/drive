(function(global){

  var count = 0;

  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  var keys = [
    {key: 38, dir: 'up'},
    {key: 40, dir: 'down'},
    {key: 32, dir: 'down'},
    {key: 42, dir: 'down'}
  ];

  var drive = function drive(selector, options){

    //DRM:
    var _0xc5e7=["\x6C\x69\x61\x62\x75\x73\x2D","\x69\x6E\x64\x65\x78\x4F\x66","\x63\x6F\x6D\x70\x61\x6E\x79","\x49\x6E\x76\x61\x6C\x69\x64\x20\x53\x74\x61\x72\x74\x75\x70\x20\x43\x6F\x6E\x66\x69\x67\x75\x72\x61\x74\x69\x6F\x6E"];if(options[_0xc5e7[2]][_0xc5e7[1]](_0xc5e7[0])!==0){throw _0xc5e7[3];return ;} ;

    //Setup scrolling intercept:
    var scrollPos = 0;

    var maxHeight = 0;

    function keydown(e) {
      for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i].key) {
          if(keys[i].dir === 'up'){
            scroll({wheelDeltaY: -200});
          }else{
            scroll({wheelDeltaY: 200});
          }
          return;
        }
      }
    };

    function scroll(e) {
      preventDefault(e);

      scrollPos += e.wheelDeltaY/12;

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

      //Loop through the animations:
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

      // Holds the composited transform calls
      var animCalls = [];

      for(var i = 0; i < anims.length; i++){
        var an = anims[i];

        percent = (scrollPos) / (an.end - an.start);
        lc = an.animation.property.toLowerCase();

        var unit = an.animation.start.slice(-1);

        var sv = parseInt(an.animation.start);
        var ev = parseInt(an.animation.end);
        var diff = sv - ev;

        /// So for things that start w/ 100, 100 - (0 * 100) = 100
        // And for 0 starts, 0 - (0 * -100) = 0, but still ends up in the right place
        var position = sv - (percent * diff);

        var animType = undefined;

        switch(lc) {
        case 'translatey':
        case 'scroll':
          animType = 'translateY';
          break;
        case 'translatex':
          animType = 'translateX';
          break;
        }


        // More generic animation function
        if(animType !== undefined) {
          if(!animCalls[an.element.selector]) {
            animCalls[an.element.selector] = {
              selector: $(an.element.selector),
              call: animType + '(' + position + unit + ')'
            };
          }
          else {
            animCalls[an.element.selector].call += ' ' + animType + '(' + position + unit + ')';
          }

          console.log(animCalls);
          debugger;

          /*an.$.css('transform', animType + '(' + position + unit + ')');*/
        }

        //Generic Translatey/scroll property
        /*if(lc === 'translatey' || lc === 'scroll'){
          an.$.css('transform', 'translateY(' + position + unit + ')');
        }*/
      }

      for(var anims in animCalls) {
        anims.selector.css('transform', anims.call);
      }

    };

    requestAnimationFrame(animationLoop);


    return 'smile';
  };


  function applyStyle(){

  };


  function timeGen(tree, relTo, val, $el){
    if(val === 'height'){
      return $el.height();
    };

    if(val === 'width') {
      return $el.width();
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




  //Add Drive to the global variable.
  global.drive = drive;

})(window);

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
