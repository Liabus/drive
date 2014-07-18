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
  
  //Public constructor for drive:
  var Drive = function DriveConstructor () {
    this.started = false;
    this.running = false;
  };
  
  //Method to start a drive instance:
  Drive.prototype.start = function () {
    //Only run if we're not started:
    if (this.started === true) return;
    
    //Set started and running to true.
    this.started = true;
    this.running = true;
  };
  
  //Completely stop a Drive instance:
  Drive.prototype.stop = function () {
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
  };

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return Drive;
}));