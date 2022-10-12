import React, { useCallback, useEffect } from "react"
import EventBus from "../event-bus";
import { EventTypeEnum } from "../event-type-enum";
import useEventBusListener from "./use-event-bus-listener";

function useOnEntityCreated(entityType = null, entityId = null, onCreated = ({ entityType, entityId }) => { }) {

    const entityTypeFilter = entityType;
    const entityIdFilter = entityId;
    const eventReceived = useCallback(({ entityId, entityType }) => {
        if ((entityTypeFilter == null || entityTypeFilter == undefined || entityType == entityTypeFilter) &&
            (entityIdFilter == null || entityIdFilter == undefined || entityId == entityIdFilter))
            onCreated({ entityId, entityType });
    }, [entityType, entityId, onCreated]);

    useEventBusListener(EventTypeEnum.EntityCreated, eventReceived);

}
export default useOnEntityCreated;