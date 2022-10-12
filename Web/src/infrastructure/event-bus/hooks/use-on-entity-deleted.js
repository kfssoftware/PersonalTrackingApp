import React, { useCallback, useEffect } from "react"
import EventBus from "../event-bus";
import { EventTypeEnum } from "../event-type-enum";
import useEventBusListener from "./use-event-bus-listener";

function useOnEntityDeleted(entityType = null, entityId = null, onDeleted = ({ entityType, entityId }) => { }) {

    const entityTypeFilter = entityType;
    const entityIdFilter = entityId;
    const eventReceived = useCallback(({ entityId, entityType }) => {
        if ((entityTypeFilter == null || entityTypeFilter == undefined || entityType == entityTypeFilter) &&
            (entityIdFilter == null || entityIdFilter == undefined || entityId == entityIdFilter))
            onDeleted({ entityId, entityType });
    }, [entityType, entityId, onDeleted]);

    useEventBusListener(EventTypeEnum.EntityDeleted, eventReceived);

}
export default useOnEntityDeleted;