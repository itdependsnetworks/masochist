---
tags: vim wiki
cache_breaker: 1
---

This can be tricky. The basic idea is:

1.  Collapse each function onto one line (note that you can only do this if you have a non-ambiguous way of identifying the beginning and end of each function)
2.  Sort the one-liners
3.  Expand the one-liners back into multi-line form

The trick here is to use a unique marker to represent newlines (eg. `@@@`) so that they can be correctly restored.

# Example

Given some JavaScript methods in an object:

```javascript
const methods = {
    foo() {
        // contents
    },

    bar() {
        // contents
    },

    baz() {
        // contents
    },
};
```

Here we can make a pattern that identifies the start of each method (in this case, `) {`; but note, if we had `if` statements or similar inside the methods we'd need to come up with something more specific, like `() {` or something more complicated).

Likewise, we can identify the end of each method by looking for `},`.

So, with that in mind:

    " select range to be sorted, then:
    :g/\v\) \{/,/\v\},/ s/$\n/@@@
    " (Vim expands that to: `:'<,'>g/\v\) \{/,/\v\},/ s/$\n/@@@`

    " Then select the lines and:
    :sort
    " (Vim expands that to: `:'<,'>sort`)

    " Then select the lines and split back onto multiple lines again:
    :s/@@@/\r/g
    " (Vim expands that to: `:'<,'>s/@@@/\r/g`)

## See also

-   [Sorting .gitmodules entries with Vim](/wiki/Sorting_.gitmodules_entries_with_Vim)

## Source

-   <http://stackoverflow.com/a/5618692/2103996>
