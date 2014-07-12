Welcome to drive.js
---

Requires:

- jQuery
- Knowledge of the API
- JS Objects out your ass

Yeah.

      ...,
      ......,
       ........
        .........
           ........
           ........,
          ...``......
         ,...   ,.....
         ....     .....
         ...,      .....
         ...,       ....,
         ...         ....
         ...          ....                  `
        `...          ,..,                :..
        ...,          `...                ..:
        ...,           ...   ,
        ,..`           ..:   ..
        ,..            ..   :..,                                 ::
        :..           ,..   ....                               :...
        ,..           ..    .....                  :      ,   ,....
        ,.,          ..,   ..  ...,      ,.:      `.     ,   ... ..
        ,.:         ,..   ,.    ...     :...      ..     .   ., .,
        ...         ..`  :.`    ...    :....     :..    `:  ,...`
        ..         ..,  ,.,     ..    ..,...    `...    .   ,..
        ..       ,.., `..,     ..:   ..  `..:  `....   ,,   ,.      `
        .,      ...,  ...      ,.` ,.,    ....,.: ..   .    ,.,    .  
        :     :...:   ,.       ......      ....`  ,.  ..    ,...,..
           ,......            `...:        `:.    :..,.      ,...`
          .....,              `,.                 :...
          .,`                                     `..


#drive-next

This entire library is unstable and relatively purpose built. A future version is being developed side-by-side with the current version, and will aim to solve some of the problems of the current library, while still maintaining the same flexibility and power.

**Current phase:** Design

##general idea

The library lets you specifiy elements, and animations that will happen on those elements over positions of time.
These times are defined as a "timeline", which keeps track of start and end times of animations, allows you to specify animations relative to other elements, etc.
The timeline uses the concept of SPs (Simulated Pixels), which are pixel-like, so you can roughly define your elements timeline with numbers that are roughly pixels.
Timelines support various keywords, allowing you to easily animate over computed values such as the height, or specify your own computation function.

There currently is no dependency resolution mechanism in the relatives, so you must manage that yourself and ensure that you have your elements in order. (there is a todo about this)

We use RequestAnimationFrame to move elements along space based scroll position and the timeline you define. By default, we use linear easing, although the scroll position is exponentially managed to give the easing feeling. You can also specify your own easing function.

##todo
- Finalize the specification of Drive.
- Write timeline generation function.
- Eval is evil. Rudimentary math parser? Suck it up?
- Remove jQuery dependency?
- Figure out how to support more flexible timelines (Drive's SPs are cool but not great.)
- Relatives to non-named elements.
- Lazy execution via `drive.start()` function, create relative dependency tree.
- Support custom easing functions in animations (linear by default).
- Custom functions in timeline. Figure out a mechanism for the recalculation of these. We don't want to run every frame, but want to allow them to hypothetically run more than once. Maybe default to on resize, and then give them some mechanism to get it run every frame if they're insane.
- Decide if the renderFn stays in.
- Figure out what methods exist on the instance.
- Named instances with internal cache?
- Add multiple out-of-animating display modes. Figure out how these work with the parent elements hiding when children still animating. Maybe offer per-element mode options.
- Better persist options (replaced with mode?).
- Figure out the difference between self and parent relative keywords. I think self makes sense in the context of per-animation timelines. Parent makes sense for child elements.
