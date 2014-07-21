module.exports = function() {
  "use strict";
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      define([], factory);
    } else if ((typeof exports === 'undefined' ? 'undefined' : $traceurRuntime.typeof(exports)) === 'object') {
      module.exports = factory();
    } else {
      root.Drive = factory();
    }
  }(this, function() {
    var DRIVE_DEFAULTS = {
      scrollbar: true,
      friction: 0.34,
      dampening: 1.4,
      ordered: true,
      mode: 'display'
    };
    var Drive = function Drive() {
      var options = arguments[0] !== (void 0) ? arguments[0] : DRIVE_DEFAULTS;
      this.started = false;
      this.running = false;
      this.options = options;
      this.elements = [];
      this.timeline = {};
      this.computed = [];
    };
    ($traceurRuntime.createClass)(Drive, {
      add: function(tree) {
        var parent = arguments[1] !== (void 0) ? arguments[1] : false;
        if (this.started === true)
          return;
        if (tree.elements) {
          for (var i = 0,
              len = tree.elements.length; i < len; i++) {
            this.add(tree.elements[$traceurRuntime.toProperty(i)], 'TODO');
          }
        }
      },
      start: function() {
        if (this.started === true)
          return;
        this.started = true;
        this.running = true;
        if (this.options.scrollbar) {}
        for (var i = 0,
            len = this.elements.length; i < len; i++) {
          this.computed.push(this.elements[$traceurRuntime.toProperty(i)]);
        }
      },
      stop: function() {
        if (this.started === true)
          return;
        this.started = false;
        this.running = false;
      },
      pause: function() {
        if (this.running === true)
          return;
        this.running = false;
      },
      resume: function() {
        if (this.running === false)
          return;
        this.running = true;
      },
      on: function(evt) {
        var cb = arguments[1] !== (void 0) ? arguments[1] : function() {};
      },
      render: function() {}
    }, {});
    Drive.animation = function DriveAnimationDefinition() {};
    return Drive;
  }));
  return {};
}.call(Reflect.global);
