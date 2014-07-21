//TODO: Most things

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Drive = factory();
  }
}(this, function(){
  
  /*
   * VARIABLES
   */
  
  //TODO: Figure out if the friction value should be something like 3 and then divide by it. We don't want dampening and friction in different units.
  
  //Set default options:
  var DRIVE_DEFAULTS = {
    //Display a scrollbar in the drive parent.
    scrollbar: true,
    //The friction value that will be applied to tween animations
    friction: 0.34,
    //Max number of SPs that will be scrolled in one frame:
    maxScroll: 100,
    //The amount that the scroll values will be divided by to allow dampening 
    dampening: 1,
    //Ordered mode requires the HTML structure to match the element structure that you're providing drive (enforced by stacking selectors).
    //Non-Ordered mode uses the plain selectors that you pass in and doesn't require things to be structred in any particular way.
    ordered: true,
    //Controls how elements not currently animating will be hidden. You can set this to "display", "visibility", "opacity", or "none".
    mode: 'display'
  };
  
  /*
   * DRIVE CLASS
   */

  var Drive = function DriveConstructor (options) {
    //Default options:
    options = options || DRIVE_DEFAULTS;
    
    this.started = false;
    this.running = false;
    
    //Copy over the options:
    this.options = options;
    
    //Holding event listeners:
    this.events = {};
    this._eventKey = 0;
    
    //Internal elements (with incomplete timelines).
    this.elements = [];
    
    //Internal key/value association of elements and their timeline values for O(1) lookups.
    this.timeline = {};
    
    //Once you call .start() this will be populated by the computed elements (with computede timelines.)
    this.computed = [];
  };
  
  
  /*
   * INSTANCE METHODS
   */
  
  Drive.prototype.add = function (tree, parent) {
    //Only allow additions if we haven't built our internal tree yet.
    if (this.started === true) return;
    
    //TODO: Add element in position based on relative:
    
    if (tree.elements) {
      //Add all child elements:
      for (var i = 0, len = tree.elements.length; i < len; i++) {
        //TODO: Figure out how to declare the current element as the parent element:
        this.add(tree.elements[i], 'TODO');
      }
    }
  };
  
  //Method to start a drive instance:
  Drive.prototype.start = function () {
    //Only run if we're not started:
    if (this.started === true) return;
  
    //Set started and running to true.
    this.started = true;
    this.running = true;
    
    //Inject the scrollbar:
    if (this.options.scrollbar) {
      //TODO: Inject HTML for scrollbar.
    }
    
    for (var i = 0, len = this.elements.length; i < len; i++) {
      
      //TODO: Compute timeline:
      this.computed.push(this.elements[i]);
      
    }
    
    //Kick off the animation loop:
    window.requestAnimationFrame(this.render);
  };
  
  
  // Completely destroy (stop) a Drive instance.
  
  // The reason why this is called destroy and not stop is because stop implies that you can re-call start to restore the state, 
  // but this clears out all of the internal references to the elements, so it can't re-construct the timelines or anything.
  
  // The difference between this and pause is that this does a memory cleanup,
  // as well as removes CSS classes it has added. It does it's best to return
  // things to the original state before Drive started.
  Drive.prototype.destroy = function () {
    //Only run if we're started:
    if (this.started === true) return;
  
    this.started = false;
    this.running = false;
  };
    
  //Pause a drive instance (to later be started).
  Drive.prototype.pause = function () {
    //Only run if we're not paused:
    if (this.running === true) return;
  
    //Set to not running (so we can resume).
    this.running = false;
  };
    
  //Resume a Drive instance (one that was paused).
  Drive.prototype.resume = function () {
    //Only run if we're paused:
    if (this.running === false) return;
  
    //Set back to running (so we can pause).
    this.running = true;
    
    //TODO: Kick animation frames back in:
  };
  
  //Set up a drive event listener:
  Drive.prototype.on = function (evt, fn) {
    //Increment our event key:
    this._eventKey++;
    
    //Check to see if we've got other listeners registered:
    if (!this.events[evt]) {
      this.events[evt] = [];
    }
    
    //Add the listener to the event arry:
    this.events[evt].push({
      id: this._eventKey,
      fn: cb
    });
  };
  
  //Remove an event listener:
  Drive.prototype.off = function (evt, id) {
    if (!evt) {
      //Clear all event listeners:
      this.events = {};
    } else if(!id) {
      //Clear all of one type of event listeners:
      this.events[evt] = [];
    } else {
      //Clear a specific event listener:
      var listeners = this.events[evt];
      for (var i = 0, len = listeners.length; i < len; i++) {
        //Check to see if the listener ID is the same as the one passed in:
        if (listeners[i].id === id) {
          //Cut out the listener:
          this.events[evt].splice(i, 1);
          break;
        }
      }
    }
  };
  
  /*
   * PRIVATE FUNCTIONS
   */
  
  //Call all of the listeners for a specific event:
  Drive.prototype._callEvent = function (evt) {
    //Check to see if we have registered listeners:
    if (this.events[evt]) {
      var listeners = this.events[evt];
      for (var i = 0, len = listeners.length; i < len; i++) {
        //Call the event listener:
        listeners[i].fn.call(this);
      }
    }
  };
    
  /*
   * RUNTIME LOOP
   */
  
  Drive.prototype.render = function () {
    //If we're not running and we haven't started, we shouldn't animate a frame:
    if (!this.running || !this.started) return;
    
    //Request the next frame:
    window.requestAnimationFrame(this.render);
    
    //TODO: Render loop
  };
  
  
  /*
   * STATIC METHODS
   */
  
  //Reuable NOP
  Drive.nop = function (){};
  
  //Define a reusable animation for Drive.
  Drive.animation = function DriveAnimationDefinition () {
    
  };
  
  //Export Drive class
  return Drive;
}));