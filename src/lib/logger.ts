const info = (...msg: any[]) => {
  console.info("########## ", ...msg)
}

const error = (...msg: any[]) => {
  console.error("########## ", ...msg)
}

const logger = { info, error }

export default logger
