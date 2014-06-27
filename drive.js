(function(global){

  var count = 0;

  function timeGen(tree, relTo, val){
    if(!relTo || !tree[relTo]) return val;
    var vals = val.split('.');
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
    for(var i  = 0; i < animations.length; i++) {
      // If the position is within the range of animation
      if(animations[i].start <=  pos && animations[i] >= pos) {
        active.push(animations[i]);
      }

      // If the animation start times are past the position,
      // then the possible animations have run out
      if(animations[i].start > pos) {
        return active;
      }
    }

    return active;
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
    }

    function scroll(e) {
      preventDefault(e);
      
      scrollPos += e.wheelDeltaY/10;
      
      if(scrollPos < 0) scrollPos = 0;
      //TODO: Upper limit
      
      $(document.body).scrollTop(scrollPos);

      console.log(scrollPos);
    }

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

      //TODO:
      var $el;

      //pull out parts:
      var timeline = el.timeline;
      var animations = el.animations;
      
      var relative = timeline.relative || el.relative || false;
      
      if(!el.name){
        el.name = 'drive-dy-' + ++count;
      }

      tree[el.name] = {
        //TODO: Check to make sure this height code works correctly:
        height: $el.height(),
        start: timeGen(tree, relative, timeline.start),
        end: timeGen(tree, relative, timeline.start)
      };

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
        // Set the flag
        inserted = false;

        // Time sort the animations
        for(var k = 0; k < timeline.length; k++) {
          // Break ties with end times
          if(animations[j].start === timeline[k].start && animations[j].end < timeline[k].end) {
            timeline.splice(k, 0, animations[j]);
            inserted = true;
            break;
          }

          // If the animation is earlier than the one in the index, insert
          if(animations[j].start < timeline[k].start) {
            timeline.splice(k, 0, animations[j]);
            inserted = true;
            break;
          }
        }

        // Otherwise insert at the end
        if(inserted === false) {
          timeline.push(animations[j]);
        }
      };
    };

    console.log(tree);

    return 'smile';

  };




  //Add Drive to the global variable.
  global.drive = drive;

})(window);
