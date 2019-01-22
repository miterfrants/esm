// Based on `Module#load()`.
// Copyright Node.js contributors. Released under MIT license:
// https://github.com/nodejs/node/blob/master/lib/internal/modules/cjs/loader.js

import Entry from "../../entry.js"
import Loader from "../../loader.js"
import RealModule from "../../real/module.js"

import loader from "../cjs/loader.js"
import maskFunction from "../../util/mask-function.js"
import shared from "../../shared.js"

const RealProto = RealModule.prototype

const load = maskFunction(function (filename) {
  if (this.loaded) {
    throw new shared.external.Error("Module already loaded: " + this.id)
  }

  let entry = Entry.get(this)

  const { id } = entry
  const parentEntry = entry.parent
  const { scratchCache } = Loader.state.module

  // Reassociate entries from the parse phase for modules created
  // via `new Module()`.
  if (Reflect.has(scratchCache, id)) {
    const otherEntry = Entry.get(scratchCache[id])

    if (entry !== otherEntry) {
      entry = otherEntry
      entry.exports = this.exports
      entry.module = this
      entry.parent = parentEntry

      Entry.set(this, entry)
      Reflect.deleteProperty(scratchCache, id)
    }
  }

  loader(entry, filename, parentEntry)
}, RealProto.load)

export default load
