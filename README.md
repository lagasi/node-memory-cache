# Memory Cache

Simple memory cache for Node.js with only one dependency, [rfdc](https://github.com/davidmarkclements/rfdc) for creating deep copies.

[![Build Status](https://travis-ci.org/lagasi/node-memory-cache.svg?branch=master)](https://travis-ci.org/lagasi/node-memory-cache)

## Installation

```npm install node-memory-cache```

## Usage

```javascript
const Cache = require("node-memory-cache")

var cache = new Cache({
  ttl: 1000,
  checkPeriod: 600000
})

console.log(cache.get("foo")) // undefined

cache.set("foo", "bar")
console.log(cache.has("foo")) // true
console.log(cache.get("foo")) // "bar"
setTimeout(() => console.log(cache.get("foo")), 2000) // undefined

```

## API

### Options

| name        | default | description |
| ----------- | ------- | ------------|
| ttl         | 100     | Number of milliseconds before cached element expires. `0` = element doesn't expire |
| checkPeriod | 600     | How often to check cache for expired elements and delete them from memory in milliseconds. `0` = don't check |


### Properties

` size `

Returns the number of elements in cache expired or not.

` stats `

Returns stats for hits and misses.

```javascript
{
  hits: 18,
  misses: 26
}
```

### Methods

` has(key) `

Checks if `key` exists

` get(key) `

Gets copy of value associated with `key` or `undefined` if there is none.

` set(key, value[, ttl[, callback]]) `

Set the `value` for the `key` in the cache. An alternative `ttl` can be set. An optional `callback` will be called when the cached element expires. Returns cache for chaining.

` delete(key) `

Deletes element from cache. Returns `true` if element exists and has been removed or `false` if element does not exist.

` deleteExpired() `

Deletes expired elements from cache.

` clear() `

Clears cache and stats
