import log4js from 'log4js'

log4js.configure({
    appenders: {
        console: {type: "console"},
        myConsoleLogger: {type: "logLevelFilter", appender: 'console', level: "trace"},

        warningFile: {type: "file", filename: 'warnings.log'},
        myWarningFile: {type: "logLevelFilter", appender: 'warningFile', level: "warn"},

        errorFile: {type: "file", filename: 'errors.log'},
        myErrorFile: {type: "logLevelFilter", appender: 'errorFile', level: "error"}
    },
    categories: {
        default: {
            appenders: ["myConsoleLogger"], 
            level: "all"
        },
        logger: {
            appenders: ["myConsoleLogger", "myWarningFile", "myErrorFile"],
            level: "all"
        }
    }
})
export default log4js.getLogger('logger');