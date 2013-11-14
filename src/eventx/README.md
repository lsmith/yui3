Custom Event Infrastructure
===========================

Eventx is a replacement for the current custom event and DOM event system in
YUI3. It is based on an alternate architecture, but attempts to maintain as
much backward compatibility as possible.

Getting Started
---------------

1. Get the branch

```
git remote add lsmith https://github.com/lsmith/yui3.git
git fetch lsmith
git checkout -b eventx lsmith/eventx --no-track
```

2. Build the following modules:
   * attribute
   * base
   * console
   * console-filters
   * event (to tell it to relay to eventx-dom)
   * event-custom (to tell it to relay to eventx)
   * eventx
   * eventx-dom
   * node
   * oop
   * widget
   * yui

3. Play with it!

### What probably broke

Lack of some features or alternate implementation of some features may cause
your code to stop working. Here are some likely culprits:

* `parent.on('*:someEvent', callback);`

    Event prefixes are gone, so that "*:" is unnecessary.

* `parent.on('child-class-NAME:someEvent', callback);`

    Omit the prefix. If you were using the prefix to discern between same-named
    events from different descendant targets, you'll have to test `e.target` in
    your callback code for now either with `instanceof`, duck typing, or
    `e.target.constructor.NAME === 'child-class-NAME'`.

* `target.on('category|someEvent', callback);` and `target.detach('category|*');`

    Detach categories aren't supported. Use a Subscription object (formerly `Y.EventHandle`). E.g.
    ```
    this._handles = [
        this.on('foo', fooCallback),
        this.after('bar', barCallback)
    ];
    this._handles.push(node.on('click', '_onClick', this));
    ...
    new Y.BatchSubscription(this._handles).detach();
    ```

* All things DD. The drag-and-drop modules use the current event system in a
    weird way, and have needed to be rewritten for a long time (It's true, ask
    @davglass).

* `node.delegate('focus', callback, '.blah')` and other synthetic events.
    Existing synthetic events haven't been migrated yet.

* `Y.on('click', callback, '#notHereYet')`, `Y.on('available',...)`, and
    `Y.on('contentReady',...)`. Like synthetic events, the 'available' and
    'contentReady' events weren't migrated. Y.on()'s automatic fallback to
    'available' for selectors that don't match any existing nodes is not
    supported.

* `e.someProperty` isn't there? Try `e.get('someProperty')` or make sure the
    eventx-compat module is loaded. With the compat module, properties should
    be added to the event facade directly.

* You tell me! I need to know what falls over so I can fix it.

### Changes you should make

Unless you run into bugs, or unsupported cases (see above), you shouldn't have
to change your code. But you should, because these things will make it better.
In fact, you should do benchmarks and memory consumption comparisons and tell
me about them!

* Publish your class events statically

    ```
    function MyClass() {
        Y.EventTarget.call(this);
        // ...
    }

    Y.extend(MyClass, Y.EventTarget, {
        // prototype methods ...
    }, {
        events: {
            foo: {
                emitFacade: true,
                defaultFn: '_defFooFn',
                fireOnce: true
            },
            bar: '_defBarFn', // shorthand for { defaultFn: '_defBarFn' }
        }
    });

    // Publish more later
    MyClass.publish('baz', { ... });
    ```

* Use late bound subscriptions

    ```
    // callback is this._afterFooChange
    target.after('fooChange', '_afterFooChange', this);
    ```


Architectural Changes From Current System
-----------------------------------------

### Fewer CustomEvent instances

In the current event system, EventTargets start their life without any events.
Each instance must `publish()` an event in order for it to be `fire()`d. To
make things easier, instances `on()` method (and kin) will publish the
subscribed event if it hasn't already been published. Each published event
exists as a CustomEvent instance on the EventTarget instance. 10 instance of a
class with 10 events means 100 objects (more, really, but for simplicity we'll
stick with 100).

In eventx, EventTargets start their life with all events published on their
host class and its inheritance hierarchy. The same CustomEvents are reused
across all instances without any publishing. 10 instances of a class with 10
events means 20 objects (again, more, but details later).

### CustomEvents are stateless

In the current event system, CustomEvents are bound to a type (e.g. 'render')
and maintain their state (subscribers, fired, etc).

In eventx, CustomEvents are stateless collections of behaviors relating to
subscribing and firing. State is maintained on the EventTarget. The type is one
input to these behavioral methods, allowing the same CustomEvent to be used for
many published event types. 

### Synthetic events are no longer special

In the current system, synthetic events are a cumbersome bolt-on that suffer
less than optimal performance. This was sadly, necessarily so, due to the
current architecture.

In eventx, synthetic events are no more than CustomEvents with specific
configurations, which breaks the distinction between a "regular" CustomEvent
and a synthetic event.

### Addition of a default event and smart events

In the current system, every type (e.g. 'render' or 'fooChange') to must be
published separately.  If a class only fires facadeless notification events,
but 10 of them, that makes 10 objects. There's no support for events that match
a generic pattern in their type.

In eventx, each EventTarget gets a default event that handles subscription and
firing of events that weren't explicitly published.  A class firing 10
notification events that differ only in name, no new events need to be
published. That makes 0 objects. Eventx also supports "smart events" to match
an event to a subscription or firing signature, so you can publish one event to
handle all events matching the regex `/cli+ck|tap|poke|stab/`.

What's Missing
--------------

The current event system is very complex. Some features and use cases didn't
make it into eventx. Some of them _will_, some _won't_. The _won't_s are
negotiable, but barring core compatibility, they can probably be shimmed in
with smart events or additional compat modules. Here are some of the things
that didn't make the first cut:

* `target.on({ foo: { fn: callback, context: obj }})' (_won't_)
* `target.on({ foo: true }, callback)' (_won't_)
* `var bool = target.fire(...)` - `fire()` is now chainable
* event monitoring - should be possible with add-on module
* `new Y.EventTarget({ chain: true })` - chaining breaks everything, always has (_won't_)
* depth-first bubble path notifications - uses breadth-first now
* `target.on(aopFn, ...)` as alias for `Y.Do.before` etc (_won't_)
* `Y.on(type, callback, '#notYetHere')` - possible with add-on module
* `Y.on(type, callback, arrayOfSelectors)` - actually, it MIGHT work, but really? (_won't_)
* `node.after('click', callback)` added to separate subscriber bucket from `on()` (_won't_)
* delegate subscribers removing element in bubble path
* most synthetic events


What's New
----------

Not exhaustive:

* `MyClass.publish(...)` publishes for all instances
* "default event" logic to handle sub/detach/etc for unpublished events
* "smart events" that can handle sub/detach/fire for variety of types/sigs
* late bound defaultFn, stoppedFn, preventedFn
* late bound subscription - `target.on('foo', '_handleFoo', host)`
* event facade properties behind `get()`/`set()` with getter/setter fn support
  - eventx-compat module adds properties back to facade
* `target.delegate(customEvent, callback, filterFn)`
* `nodelist.on(type, callback)` 'this' is the Node, not the NodeList
* `nodelist.delegate(...)`
* `target.on(type, callback, contextFn)` to determine `this` during `fire()`
* `targetOrClass.publish(type, { preventDups: true })`
* `target.subscribe(type, customPhase, callback, ...)` - useful for
  `node.subscribe('click', 'capture', callback)` or events defined with custom
  execution phases.
