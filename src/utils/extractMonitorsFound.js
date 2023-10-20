function extractMonitorsFound(documents) {
  const monitorsMap = new Map()
  const monitors = []

  documents.forEach((document) => {
    const {
      moqaID,
      Timestamp: { seconds },
      ...rest
    } = document

    if (!monitorsMap.has(moqaID)) {
      const lastTimestamp = seconds
      const monitorData = { moqaID, lastTimestamp, ...rest }
      monitorsMap.set(moqaID, monitorData)
      monitors.push(monitorData)
    }
  })

  return monitors
}

module.exports = extractMonitorsFound