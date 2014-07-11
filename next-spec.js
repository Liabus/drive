var drive = new Drive({
  scrollbar: true,
  friction: 0.34,
  dampening: 1.4,
  
  //Disable forced heiarchy:
  ordered: true,
  
  //Adjust display mode:
  mode: 'none|visibility|display|opacity'
});

//Add a new drive element:
drive.add({
  timeline: {
    //Start at absolute 0:
    start: 0,
    //End at the timeline keyword last, which is the last timeline that this element contains:
    end: 'last'
  },
  selector: '#cody-start',
  animations: [
  
  ],
  //Children:
  elements: [
    {
      timeline: {
        relative: '',
        start: 0,
        end: 100
      },
      //We use child selectors here, so this should match the HTML hierarchy.
      selector: '.scroll-body'
      //You can keep nesting elements, these are recursively executed.
      elements: []
    }
  ]
});

//Start Drive instance:
drive.start();


/*
 * TIMELINE KEYWORDS
 * =================
 * height -> The computed height of the element.
 * last -> The last timeline value of all child elements.
 *
 * Keywords are evaluated and support expressions, so 'height * 2' is supported.
 *
 * RELATIVE KEYWORDS
 * =================
 * self -> The timeline is relative to the nearest element's timeline.
 */
