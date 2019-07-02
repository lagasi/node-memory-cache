const clone = require("rfdc")({proto: true})

/**
 * In memory cache
 */
module.exports = class Cache {
  constructor(options = {}) {
    this._map = new Map()
    this._stats = {
      hits: 0,
      misses: 0,
    }

    this.ttl = options.ttl || 100000
    const checkPeriod = options.checkPeriod || 600000

    if (checkPeriod > 0) {
      this._checkIntervalId = setInterval(this.deleteExpired.bind(this), checkPeriod)
    }
  }

  /**
   * Checks if key exists
   * @param {object} key
   * @return {boolean}
   */
  has(key) {
    return this._map.has(key)
  }

  /**
   * Gets the value stored in cache
   * @param {object} key
   * @return {object} Gets copy of value associated with key or undefined if there is none
   */
  get(key) {
    let obj = this._map.get(key)

    if (obj === undefined)  {
      this._stats.misses++
      return undefined
    }

    if (obj.expires && obj.expires < Date.now()) {
      this._stats.misses++
      this._map.delete(key)
      return undefined
    }
    this._stats.hits++

    return clone(obj.val)
  }

  /**
   * Set the value for the key in the cache. Returns cache for chaining.
   * @param {object} key
   * @param {object} value
   * @param {number=} ttl Time to live in ms
   * @param {function=} cb Optional callback when cached value expires
   * @return {object} self
   */
  set(key, value, ttl = this.ttl, cb) {
    let obj = {
      val: value,
    }
    if (ttl) {
      obj.expires = Date.now() + ttl
    }
    if (cb) {
      setTimeout(() => {
        cb(this._map.get(key).val)
      }, ttl)
    }
    this._map.set(key, obj)
    return this
  }

  /**
   * Deletes an element from cache
   * @param {object} key
   * @return if key existed and was removed
   */
  delete(key) {
    return this._map.delete(key)
  }

  /**
   * Deletes expired elements from memory
   */
  deleteExpired() {
    const now = Date.now()

    for (let item of this._map.entries()) {
      if (item[1].val.expires && item.val.expires < now) {
        this._map.delete(item[0])
      }
    }
  }

  /**
   * Clears cache and stats
   */
  clear() {
    this._map.clear()
    this._stats.hits = 0
    this._stats.misses = 0
  }

  /**
   * Number of elements in cache whethere expired or not
   * @type {number}
   */
  get size() {
    return this._map.size
  }

  /**
   * Stats for hits and misses
   * @type {object}
   */
  get stats() {
    return this._stats
  }
}
