import React, { useEffect } from "react"
import CommandBus from "../command-bus";
import { CommandTypeEnum } from "../command-type-enum";

function useCommandBusListener(comandType = CommandTypeEnum.None, callback = (data) => { }) {

    useEffect(() => {
        const call = (data) => {
            callback(data);
        }

        CommandBus.sc.eventEmitter.addListener(comandType, call);
        return () => {
            CommandBus.sc.eventEmitter.removeListener(comandType, call)
        }
    }, [comandType, callback]);

}
export default useCommandBusListener;