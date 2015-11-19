# Oath.js

## `new Oath(executor)`

The Oath constructor. It takes a single function 
argument `executor`. Returns a new Oath when 
invoked with the `new` keyword.

### `executor(resolve, reject)`

The defining function for an Oath. It is passed 
two callbacks when invoked by the Oath constructor:

#### `resolve(resolutionValue)`

`resolve`, if/when invoked, will resolve the Oath 
with the value passed to it. If `resolutionValue` is 
also an Oath, the resolution or rejection of 
`resolutionValue` will cascade to the Oath being created.

#### `reject(error)`

`reject`, if/when invoked, will reject the Oath with 
the value passed to it. This should be used only with 
instances of `Error` or one of its subclasses (e.g., 
`RangeError`).

## Instance methods

### `oath#then(onResolve)`

Standard `then` method for those familiar with promises.

**Returns** a new Oath chained to `oath`.

#### `onResolve(resolutionValue)`

### `oath#catch(onReject)`

Standard `catch` method for those familiar with promises.

**Returns** a new Oath chained to `oath`.

#### `onReject(error)`

## Static methods

### `Oath.all(oathArray)`

Creates a new Oath that resolves only once all Oaths in 
`oathArray` have resolved. It rejects if one or more Oaths 
in the passed-in array reject.

**Returns** a new Oath chained to all Oaths in `oathArray`.

### `Oath.race(oathArray)`

Creates a new Oath that resolves if one or more Oaths in 
`oathArray` resolves. It rejects only if all Oaths in 
the passed-in array reject.

**Returns** a new Oath chained to all Oaths in `oathArray`.
