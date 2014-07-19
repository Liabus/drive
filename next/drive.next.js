//TODO: Everything

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
  
  //Set default options:
  const DRIVE_DEFAULTS = {
    scrollbar: true,
    friction: 0.34,
    dampening: 1.4,
    ordered: true,
    mode: 'display'
  };
  
  /*
   * DRIVE CLASS
   */

  class Drive {
    //Public constructor for drive:
    constructor(options = DRIVE_DEFAULTS) {
      this.started = false;
      this.running = false;
    }
    
  
    /*
     * INSTANCE METHODS
     */
  
    //Method to start a drive instance:
    start() {
      //Only run if we're not started:
      if (this.started === true) return;
    
      //Set started and running to true.
      this.started = true;
      this.running = true;
    }
    
    //Completely stop a Drive instance:
    stop() {
      //Only run if we're started:
      if (this.started === true) return;
    
      this.started = false;
      this.running = false;
    }
    
    //Pause a drive instance (to later be started).
    pause() {
      //Only run if we're not paused:
      if (this.running === true) return;
    
      //Set to not running (so we can resume).
      this.running = false;
    }
    
    //Resume a Drive instance (one that was paused).
    resume() {
      //Only run if we're paused:
      if (this.running === false) return;
    
      //Set back to running (so we can pause).
      this.running = true;
    }
  }
  
  
  /*
   * STATIC METHODS
   */
  
  Drive.animation = function DriveAnimationDefinition () {
    
  };
  
  //Export Drive class
  return Drive;
}));