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

  /*
   * DRIVE INITIALIZER
   * =================
   */
  var drive = function drive(selector, options){
    
    var $body = $(document.body);

    //DRM:
    var _0xc5e7=["\x6C\x69\x61\x62\x75\x73\x2D","\x69\x6E\x64\x65\x78\x4F\x66","\x63\x6F\x6D\x70\x61\x6E\x79","\x49\x6E\x76\x61\x6C\x69\x64\x20\x53\x74\x61\x72\x74\x75\x70\x20\x43\x6F\x6E\x66\x69\x67\x75\x72\x61\x74\x69\x6F\x6E"];if(options[_0xc5e7[2]][_0xc5e7[1]](_0xc5e7[0])!==0){throw _0xc5e7[3];return ;} ;

    //Setup scrolling intercept:
    var scrollPos = 0;
    var tweenPos = 0;

    var maxHeight = 0;

    function keydown(e) {
      for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i].key) {
          if(keys[i].dir === 'up'){
            scroll({deltaY: 200, preventDefault: drive.nop});
          }else{
            scroll({deltaY: -200, preventDefault: drive.nop});
          }
          return;
        }
      }
    };

    function scroll(e) {
      e.preventDefault();

      scrollPos += -1 * ( e.deltaY / 1.5 );

      if(scrollPos < 0) scrollPos = 0;
      if(scrollPos > maxHeight) scrollPos = maxHeight;
    };
    
    $body.on('keydown', keydown);
    $body.on('mousewheel', scroll);


    //Grab a reference to the element.
    var $el = $(selector);
    $el.addClass('drive-parent');

    //Retrieve the height:
    var height = options.height || $el.height();

    //Get the elements from the options object:
    var elements = options.elements;

    var tree = {};

    var timeline = [];
    //Keep track of the tree elements that we are currently animating, so we can apply before/after CSS.
    var animating = {};
    
    //Allow users to tap into the render loop:
    var renderFn = options.render || drive.nop;
    
    //To prevent layout thrashing:
    var transitionCache = {};
    
    
    var $thumb = $();
    var dragging = false;
    //Implement the scrollbar
    if(options.scrollbar){
      //Append the scrollbar:
      $body.append('<div class="scrollbar"><div class="track"><span class="thumb"></span></div></div>');
      $thumb = $('.scrollbar .track .thumb');
      $thumb.on('mousedown', function(){
        dragging = true;
        $body.on('mousemove', function(e){
          if(dragging){
            var percentDown = e.clientY / window.innerHeight;
            if(percentDown > 0.985){
              percentDown = 1;
            }if(percentDown < 0.015){
              percentDown = 0;
            }
            $thumb.css('top', percentDown * 100 + '%');
            //Update scroll position:
            scrollPos = percentDown * maxHeight;
          }
        });
      });
      $body.on('mouseup', function(){
        if(dragging){
          dragging = false;
          $body.off('mousemove');
        }
      });
    }
    
    

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
      
      //Don't hide persisting elements:
      if(!el.persist){
        $el.css('display', 'none');
      }

      var t = {
        $: $el,
        height: $el.height(),
        start: timeGen(tree, relative, tl.start, $el),
        end: timeGen(tree, relative, tl.end, $el),
        persist: el.persist
      };

      tree[el.name] = t;

      //Loop through the animations:
      for(var j = 0; j < animations.length; j++){

        var tl = {
          start: t.start,
          end: t.end
        };

        if(animations[j].timeline){
          tl.start = timeGen(tree, animations[j].timeline.relative, animations[j].timeline.start, $el);
          tl.end = timeGen(tree, animations[j].timeline.relative, animations[j].timeline.end, $el);
        }

        //.log(tl);

        //Just push, we can sort later:
        timeline.push({
          $: $el,
          element: el,
          animation: animations[j],
          start: tl.start,
          end: tl.end
        });
      };
    };

    maxHeight = getMaxHeight(timeline);

    /* An array to keep track of elements that
       were active to hide them when they go out
       of frame */
    var prevActive = [];

    function animationLoop(){
      requestAnimationFrame(animationLoop);

      //Tweening
      //Calculate difference between scrollPos and tweenPos;
      //Arb max scroll px at one time
      var scrollDiff = (scrollPos - tweenPos) * 0.34;
      tweenPos = Math.round((tweenPos + scrollDiff) * 10000) / 10000;
      
      if(!dragging){
        $thumb.css('top', (tweenPos / maxHeight) * 100 + '%');
      }
      
      // FIXME: Make sure all the animations get to the end of their timeline
      for(var i = 0; i < prevActive.length; i++) {
        an = prevActive[i];
        if(an.end < tweenPos) {
          var end = an.end;
          var anim = parseAnimationType(an.animation.property.toLowerCase());
          var unit = an.animation.end.slice(-1);
          if(!isNaN(parseInt(unit))) unit = '';
          applyStyle(an.$, anim.animation, anim.property, parseInt(an.animation.end), unit, an.element.name, transitionCache);
        } else if(an.start > tweenPos) {
          var end = an.start;
          var anim = parseAnimationType(an.animation.property.toLowerCase());
          var unit = an.animation.end.slice(-1);
          if(!isNaN(parseInt(unit))) unit = '';
          applyStyle(an.$, anim.animation, anim.property, parseInt(an.animation.start), unit, an.element.name, transitionCache);
        }
      }

      //Reset animating:
      animating = {};

      var anims = getAnimationsForFrame(timeline, tweenPos, animating);
      var percent = 0;
      var lc = '';

      hideOutOfFrameAnimations(tree, animating, tweenPos);

      for(var i = 0; i < anims.length; i++){
        var an = anims[i];

        percent = (tweenPos - an.start) / (an.end - an.start);
        lc = an.animation.property.toLowerCase();
        var unit = an.animation.start.slice(-1);

        // For cases where there is no units
        if(!isNaN(parseInt(unit))) {
          unit = '';
        }

        var sv = parseFloat(an.animation.start);
        var ev = parseFloat(an.animation.end);
        var diff = sv - ev;

        /// So for things that start w/ 100, 100 - (0 * 100) = 100
        // And for 0 starts, 0 - (0 * -100) = 0, but still ends up in the right place
        var position = sv - (percent * diff);

        var animObj = parseAnimationType(lc);

        var animType = animObj.animation;
        var prop = animObj.property;

        if(prop){
          applyStyle(an.$, animType, prop, position, unit, an.element.name, transitionCache);
        }
      }

      // Keep track of the current animations
      prevActive = anims;
      
      
      if(renderFn) window.setTimeout(function(){renderFn(anims, tree, animating, timeline)}, 1);
      
    };

    requestAnimationFrame(animationLoop);

    return 'smile';
  };
  
  drive.nop = function(){};

  function parseAnimationType(lcAnimation) {
    var prop = '';
    var animType = '';

    switch(lcAnimation) {
      case 'translatey':
      case 'scroll':
        prop = 'translateY';
        animType = 'transform';
        break;
      case 'translatex':
        prop = 'translateX';
        animType = 'transform';
        break;
      case 'scale':
        prop = 'scale'
        animType = 'transform';
      default:
        prop = lcAnimation;
        break;
    }

    return {property: prop, animation: animType};
  }

  function hideOutOfFrameAnimations(tree, animating, scrollPos) {
    for(var t in tree){
      var tr = tree[t];
      if(tree.hasOwnProperty(t) && !animating[t] && !tr.persist){
        //Check to see if we're in the tree's timeline:
        if(tr.start < scrollPos || tr.end > scrollPos){
          tree[t].$.css('display', 'none');
        };
      }
    }
  }

  function applyStyle($el, animType, prop, position, unit, name, transitionCache){
    //Limit precision:
    position = Math.round(position * 100000) / 100000;
    
    //Ensure visibility is set to visible.
    var el = $el.get(0);
    el.css('display', 'block');
    
    if(animType){
      if(animType === 'transform'){
        
        if(transitionCache[name]){
          transitionCache[name][prop] = {
            prop: prop,
            position: position,
            unit: unit
          };
        }else{
          transitionCache[name] = {};
          transitionCache[name][prop] = {
            prop: prop,
            position: position,
            unit: unit
          };
        }
        
        var constructed = '';
        for(var x in transitionCache[name]){
          if(transitionCache[name].hasOwnProperty(x)){
            var y = transitionCache[name][x];
            constructed += y.prop + '(' + y.position + y.unit  + ')';
          }
        }
        
        //Enable hardware acceleration:
        constructed += ' translateZ(0)';
        
        el.css('transform', constructed);
        el.css('-webkit-transform', constructed);
        el.css('-ms-transform', constructed);
        el.css('-moz-transform', constructed);
        el.css('-o-transform', constructed);
      }
    }else{
      el.css(prop, position + unit);
    }
  };


  function timeGen(tree, relTo, val, $el){

    // So if the val includes a height or width
    if(typeof val === 'string'){
      var height = $el.height();
      var width = $el.width();
      //Eval is evil, but don't be stupid:
      if(val.indexOf('height') > -1 || val.indexOf('width') > -1) {
        val = eval(val);
      }
    }

    // If no relative, return raw
    if(!relTo) return val;

    // Split the relative
    var vals = relTo.split('.');

    // If the relative element doesn't exist
    if(!tree[vals[0]]) return val;

    // Get the relative value
    var t = tree[vals[0]];
    var type = 'start';
    if(vals.length > 1){
      type = vals[1];
    }

    // Get change the percentage to a number
    if(val.toString().slice(-1) === '%') {
      val = (parseInt(val)/100) * (t.end - t.start);
    }

    return t[type] + val;
  };

  //Animations should be the timeline. Pos is the current scroll position:
  function getAnimationsForFrame(animations, pos, animating){

    // Array of active animations
    var active = [];

    // Find the active animations
    for(var i = 0; i < animations.length; i++){
      // If the position is within the range of animation
      if(animations[i].start <= pos && animations[i].end >= pos) {
        active.push(animations[i]);
        animating[animations[i].element.name] = true;
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
