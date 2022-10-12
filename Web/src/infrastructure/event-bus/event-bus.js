import EventEmitter from "events";
import { EventTypeEnum } from "./event-type-enum";

class EventBus {
    constructor(params) {
        this.eventEmitter = new EventEmitter();
    }

    static staticClass = new EventBus();
    static sc = EventBus.staticClass;

    onEntityUpdated = ({ entityType, entityId }) =>
        this.eventEmitter.emit(EventTypeEnum.EntityUpdated, { entityId, entityType });

    onEntityCreated = ({ entityType, entityId }) =>
        this.eventEmitter.emit(EventTypeEnum.EntityCreated, { entityId, entityType });

    onEntityDeleted = ({ entityType, entityId }) =>
        this.eventEmitter.emit(EventTypeEnum.EntityDeleted, { entityId, entityType });
}

export default EventBus;