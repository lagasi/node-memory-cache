const expect = require("chai").expect
const sinon = require("sinon")
const Cache = require("./index")

var cache, stats, clock

describe("memory-cache", function() {

  before(() => {
    cache = new Cache({
      ttl: 100,
      checkPeriod: 600
    })
    stats = {
      hits: 0,
      misses: 0,
    }
    clock = sinon.useFakeTimers()
  })

  after(() => {
    clock.restore()
  })

  it("should be undefined", (done) => {
    expect(cache.get("foo")).to.equal(undefined)
    stats.misses++
    done()
  })

  it("should equal bar", (done) => {
    cache.set("foo", "bar")
    expect(cache.has("foo")).to.equal(true)
    expect(cache.get("foo")).to.equal("bar")
    stats.hits++
    done()
  })

  it("should expire", (done) => {
    clock.tick(101)
    expect(cache.get("foo")).to.equal(undefined)
    stats.misses++
    done()
  })

  it("should return correct size", (done) => {
    cache.set("foo2", "baz")
    cache.set("foo3", "bay")
    expect(cache.size).to.equal(2)
    done()
  })

  it("should delete", (done) => {
    cache.delete("foo2")
    expect(cache.size).to.equal(1)
    done()
  })

  it("should return stats", (done) => {
    expect(cache.stats).to.be.an("object").eql(stats)
    done()
  })

  it("should clear", (done) => {
    cache.clear()
    expect(cache.get("foo3")).to.equal(undefined)
    expect(cache.size).to.equal(0)
    done()
  })

})
