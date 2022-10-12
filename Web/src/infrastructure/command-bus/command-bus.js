
import EventEmitter from "events";
import { CommandTypeEnum } from "./command-type-enum"
class CommandBus {
    constructor(params) {
        this.eventEmitter = new EventEmitter();
    }

    static staticClass = new CommandBus();
    static sc = CommandBus.staticClass;

    publish = (commandType, payload) => {
        this.eventEmitter.emit(commandType, payload);
    }

    alertError = (message) => this.publish(CommandTypeEnum.Alert, { type: "error", message: message })
    alertSuccess = (message) => this.publish(CommandTypeEnum.Alert, { type: "success", message: message })
    alertInfo = (message) => this.publish(CommandTypeEnum.Alert, { type: "info", message: message })


}

export default CommandBus;