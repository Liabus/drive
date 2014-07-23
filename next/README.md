#drive-next

This entire library is unstable and relatively purpose built. A future version is being developed side-by-side with the current version, and will aim to solve some of the problems of the current library, while providing more flexibility and power.

**Current phase:** Design

###general idea

The library lets you specifiy elements, and animations that will happen on those elements over positions of time.
These times are defined as a "timeline", which keeps track of start and end times of animations, allows you to specify animations relative to other elements, etc.
The timeline uses the concept of SPs (Simulated Pixels), which are pixel-like, so you can roughly define your elements timeline with numbers that are roughly pixels.
Timelines support various keywords, allowing you to easily animate over computed values such as the height, or specify your own computation function.

There currently is no dependency resolution mechanism in the relatives, so you must manage that yourself and ensure that you have your elements in order. (there is a todo about this)

We use RequestAnimationFrame to move elements along space based scroll position and the timeline you define. By default, we use linear easing, although the scroll position is exponentially managed to give the easing feeling. You can also specify your own easing function.

###planned features

- Stand-alone JS Library.
- Compatible with IE9+.
- Relatives managed with dependency resolver.
  - Allows out-of-order element definition.
- Multiple Drive instances allowed per page.
- Lazy start with `drive.start()` function.
- Pause/Resume/Destroy functionality.
- Supports nested elements.
  - Optionally disabled the forced HTML hierarchy requirement.
- Relatives to non-named elements (names are now the selectors by default).
- Reusable animation definitions.
- Multiple animation-complete display modes. (figure out how these work with the parent elements hiding when children still animating)
- Define where events are captured the scrollbar will go.
- Provides a (fast) refresh method that rebuilds the internal timeline (heights could change, etc). Auto-runs on window resize.
- Event system allowing you to listen for when things happen (scroll, render, etc.).
  - Supports multiple event listeners and an `off()` function to remove event listeners.

###possible features

- Support custom easing functions in animations (linear by default).
- Custom functions in timeline. Figure out a mechanism for the recalculation of these. We don't want to run every frame, but want to allow them to hypothetically run more than once. Maybe default to on resize, and then give them some mechanism to get it run every frame if they're insane.
- Figure out what methods exist on the instance.
- Relatives to non-named elements (by selector).
- Eval is evil (and slow). Rudimentary math parser? Suck it up? Slow probably isn't a big deal because it's a one-time calculation.
- Better persist options (replaced with mode?).
- Per-element display mode.
- Define the drive event capture parent and scrollbar parent separetly.
- Before/After styles.
- Optional "prepare" mode which will put elements in the style they would be at in the beginning of their timeline when drive starts.
- From/To String (from: 'opacity: 0', to: 'opacity: 1') instead of requiring per-property definitions.

###eventual

- Figure out how to support more flexible (better) timeline definitions (Drive's SPs are cool but not great.)
- Custom functions in timeline. Figure out a mechanism for the recalculation of these. We don't want to run every frame, but want to allow them to hypothetically run more than once. Maybe default to on resize, and then give them some mechanism to get it run every frame if they're insane.
  - Also, how do relatives to calculated timeline values resolve? 


###todo

- Establish browser compatibility (Likely IE9/10+).
- Finalize the specification of Drive.
- Write comprehensive timeline generation function.
- Figure out the difference between self and parent relative keywords. I think self makes sense in the context of per-animation timelines. Parent makes sense for child elements. Is the self keyword needed if the animations are relative to self by default?
- Are animations automatically relative to the element's timeline?