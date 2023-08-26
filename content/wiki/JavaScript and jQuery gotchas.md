---
tags: javascript jquery wiki
cache_breaker: 1
---

# Scope

-   unlike other C-syntax-inspired languages there is no notion of "block scope" (ie. delimited by curly braces)
-   instead, we have function scope
-   functions definitions are hoisted to the top of their containing function scope (ie. they are available throughout the entire containing function, including before their definition)
-   function definitions outside of other functions are implicitly made properties of the global `window` context
-   if a variable is used before it is declared its value is `undefined`, even if it is shadowing a variable with a value and the same name from an outer scope
-   while functions are scoped to their containing function, variables are scoped only if preceded by the `var` keyword; without the `var` keyword they become properties on the global `window` object

# Function invocation

-   there are four styles of function invocation, primarily distinguished via what `this` (the function context) is set to during the duration of execution:
    -   member function invocation (eg. `thing.push(a)`): here the `push` function is a property of the `thing` object, and `this` will be set to `thing`
    -   standard function invocation (eg. `hey(a, b, c)`): `this` is set to the global `window` context; note that this is actually just a special case of member function invocation because the `hey` function is actually a property of the global `window` context
    -   `apply`/`call` invocation (eg. `hey.apply(obj, a, b, c)`): these are tools that allow us to call any function with explicit control over what `this` will be (in this example, `this` will be `obj`); the mnemonic here is that **a**pply take an **a**rray of arguments, while `call` just takes a list of arguments; particularly useful for callbacks and event handlers
    -   constructor invocation (eg. `new Foo(a, b, c)`): when a standard function invocation is preceded by `new`, a new object is instantiated and `this` will be set to that new object; useful for building prototypal [object oriented](/wiki/object_oriented) systems; if the return value of the function is not an object, `this` will be returned, otherwise the object gets returned; by convention, functions intended to be used as constructors start with a capital letter and often have noun names that describe the thing they model

# (jQuery) Events

-   in a jQuery event handler `currentTarget` refers to the element to which the event handler was originally bound; `target` refers to the element that triggered the event (ie. via clicking or other interaction); due to event capturing/bubbling, these may not actually be the same thing (source: [1](http://stackoverflow.com/questions/5921413/difference-between-e-target-and-e-currenttarget), [2](http://www.quirksmode.org/js/events_order.html), [3](http://stackoverflow.com/questions/12632426/is-there-a-difference-between-e-currenttarget-and-this)); as an additional nuance, event `delegateTarget` is delegation-aware, so when event delegation is in effect it will reference the item to which event handling was delegated, otherwise it will be the same as `currentTarget`; also note that while `$(this)` in a jQuery event handler is usually the same as `currentTarget`, it could quite easily be something else due to the use of `bind()` to enforce a specific `this`

```javascript
$("body").on("click", "table", function (event) {
    // on clicking on an element inside the `table`
    console.log(event.delegateTarget); // body
    console.log(event.currentTarget); // table
    console.log(this); // table
    console.log(event.target); // element inside table
});

$("body").on("click", function (event) {
    // on clicking on an element inside the `table`
    console.log(event.delegateTarget); // body
    console.log(event.currentTarget); // body
    console.log(this); // body
    console.log(event.target); // element inside table
});
```

-   returning `false` from a jQuery event handler is equivalent to calling both `preventDefault()` (prevents default event from occurring) and `stopPropagation()` (prevents bubbling) on the event; this contrasts with non-jQuery event handlers, in which returning `false` does not prevent bubbling ([source](http://stackoverflow.com/a/1357151/1626737))
