import ESM from "../constant/esm.js"

import shared from "../shared.js"

function init() {
  const {
    PKG_DIRNAME
  } = ESM

  const columnInfoRegExp = /:1:\d+(?=\)?$)/gm
  const runtimeRegExp = /\w+\u200d\.(\w+)(\.)?/g
  const traceRegExp = /(\n +at .+)+$/

  function scrubStackTrace(stack) {
    if (typeof stack !== "string") {
      return ""
    }

    const match = traceRegExp.exec(stack)

    if (match === null) {
      return stack
    }

    const { index } = match
    const message = stack.slice(0, index)

    let trace = stack.slice(index)
    const lines = trace.split("\n")
    const filtered = lines.filter((line) => line.indexOf(PKG_DIRNAME) === -1)

    trace = filtered.join("\n")
    trace = trace.replace(columnInfoRegExp, ":1")
    trace = trace.replace(runtimeRegExp, replaceRuntime)

    return message + trace
  }

  function replaceRuntime(match, name, dot = "") {
    if (name === "i") {
      return "import" + dot
    }

    if (name === "r") {
      return "require" + dot
    }

    return ""
  }

  return scrubStackTrace
}

export default shared.inited
  ? shared.module.errorScrubStackTrace
  : shared.module.errorScrubStackTrace = init()
