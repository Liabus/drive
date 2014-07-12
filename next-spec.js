//Define reusable animation:
Drive.animation('scrollHeight', {
  //Redundant, also delared above, we just offer two styles:
  name: 'scrollHeight',
  animations: [
    {
      timeline: {
        start: 0,
        end: 'height * 2'
      },
      property: 'translateY',
      start: '100%',
      end: '-100%'
    }
  ]
});

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
  //Optional. Can also be defined in the declaration: drive.add(string, object);
  name: 'element-name',
  timeline: {
    //Start at absolute 0:
    start: 0,
    //End at the timeline keyword last, which is the last timeline that this element contains:
    end: 'last'
  },
  selector: '#cody-start',
  animations: [
    //Use the scrollHeight animation from before:
    'scrollHeight'
  ],
  //Children:
  elements: [
    {
      timeline: {
        //Relative to parent? In this context that means relative to element-name.
        relative: 'parent',
        
        //From 0sp to 100sp:
        start: 0,
        end: 100
      },
      //Define some animations
      animations: {
        {
          //Pull in the scrollHeight animation from before:
          use: 'scrollHeight',
          //Adjust the timeline though:
          timeline: {
            //Add a relative to the timeline:
            relative: 'element-name'
            //You can make any adjustments here, like change start and end. It will just overwrite the defined animation.
          }
        },
        //The is the same as above using shorthands:
        {
          use: 'scrollHeight',
          relative: 'element-name'
        }
        //Of course, this is very similar to the plain string syntax, just adding a relative here.
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
 * parent -> The timeline is relative to the nearest direct parent element's timeline.
 */
