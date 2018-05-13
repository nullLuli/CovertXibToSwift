exports.Action = function (dict, plistCenter) {
    this.sourceID = dict["source-id"]
    this.sourceName = plistCenter.getNameOf(this.sourceID)
    this.destinationID = dict["destination-id"]
    this.destinationClassName = plistCenter.getClassOf(this.destinationID)
    this.actionName = dict["label"]

    var eventType = dict["event-type"]
    eventType.replace(/ /g, '')
    eventType = dcfirst(eventType)
    this.eventType = eventType

    var description
    description = this.sourceName + ".addTarget(self, action: #selector(" + this.destinationClassName + "." + this.actionName + "), for: ." + this.eventType + ")"
    this.description = description

    function dcfirst(str) {
        str = str.replace(/\b\w+\b/g, function (word) {  
            return word.substring(0, 1).toLowerCase() + word.substring(1);
        })
    }
 }