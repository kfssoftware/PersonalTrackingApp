import React, { useCallback, useEffect } from "react"
import EventBus from "../event-bus";
import { EventTypeEnum } from "../event-type-enum";
import useEventBusListener from "./use-event-bus-listener";

function useOnEntityUpdated(entityType = null, entityId = null, onUpdated = ({ entityType, entityId }) => { }) {

    const entityTypeFilter = entityType;
    const entityIdFilter = entityId;
    const eventReceived = useCallback(({ entityId, entityType }) => {
        if ((entityTypeFilter == null || entityTypeFilter == undefined || entityType == entityTypeFilter) &&
            (entityIdFilter == null || entityIdFilter == undefined || entityId == entityIdFilter))
            onUpdated({ entityId, entityType });
    }, [entityType, entityId, onUpdated]);

    useEventBusListener(EventTypeEnum.EntityUpdated, eventReceived);

}
export default useOnEntityUpdated;