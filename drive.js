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
    
  };
 
  var drive = function drive(selector, options){
    
    //Setup scrolling intercept:
    $(document.body).mousewheel(function(e, delta){
      e.preventDefault();
    });
    
    //Grab a reference to the element.
    var $el = $(selector);
 
    //Retrieve the height:
    var height = options.height || $el.height();
 
    //Get the elements from the options object:
    var elements = options.elements;
 
    var tree = {};
 
    var timeline = [];
 
    //Loop through the elements:
    for(var i = 0; i < elements.length; i++){
      var el = elements[i];
 
      //TODO:
      var $el;
 
      //pull out parts:
      var timeline = el.timeline;
      var animations = el.animations;
 
      if(!el.name){
        el.name = 'drive-dy-' + ++count;
      }
 
      tree[el.name] = {
        //TODO: Check to make sure this height code works correctly:
        height: $el.height(),
        start: timeGen(tree, timeline.relative, timeline.start),
        end: timeGen(tree, timeline.relative, timeline.start)
      };
 
      //Loop through the animations:
      for(var j = 0; j < animations.length; j++){
        timeline.push({
          //TODO: Push in animation values.
        });
      };
    };
 
    console.log(tree);
 
    return 'smile';
 
  };
 
 
 
 
  //Add Drive to the global variable.
  global.drive = drive;
 
})(window);