(function(){
  //Create a new instance of Drive in the body with the default options.
  var drive = new Drive(document.body);
  
  //Add the fade-in element
  drive.add({
    selector: '#fadeIn',
    timeline: {
      start: 0,
      end: 100
    },
    animations: [
      {
        property: 'opacity',
        from: 0,
        to: 1
      }
    ]
  });
  
  //Start drive:
  drive.start();
})();