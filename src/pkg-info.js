import fs from "./fs.js"
import OrderedMap from "./ordered-map.js"
import path from "path"
import utils from "./utils.js"

const defaultOptions = {
  cache: ".esm-cache",
  cjs: false,
  esm: false,
  ext: false,
  var: false
}

class PkgInfo {
  constructor(dirPath, range, options) {
    options = utils.createOptions(options, defaultOptions)

    const cache = new OrderedMap
    const cacheDir =  options.cache
    const cachePath = typeof cacheDir === "string" ? path.join(dirPath, cacheDir) : null
    const cacheFileNames = cachePath === null ? null : fs.readdir(cachePath)
    let nameCount = cacheFileNames === null ? 0 : cacheFileNames.length

    while (nameCount--) {
      // Later, in Module._extensions[".js"], we'll change the value to the actual
      // contents of the file, but for now we merely register that it exists.
      cache.set(cacheFileNames[nameCount], true)
    }

    this.cache = cache
    this.cachePath = cachePath
    this.dirPath = dirPath
    this.options = options
    this.range = range
  }
}

Object.setPrototypeOf(PkgInfo.prototype, null)

export default PkgInfo
