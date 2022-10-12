import React, { useEffect } from "react"
import EventBus from "../event-bus";
import { EventTypeEnum } from "../event-type-enum";

function useEventBusListener(eventType = EventTypeEnum.None, callback = (data) => { }) {

    useEffect(() => {
        const call = (data) => {
            callback(data);
        }

        EventBus.sc.eventEmitter.addListener(eventType, call);
        return () => {
            EventBus.sc.eventEmitter.removeListener(eventType, call)
        }
    }, [eventType, callback]);

}
export default useEventBusListener;