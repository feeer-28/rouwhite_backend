import { EventEmitter } from 'node:events';
class BusLocationStore {
    store = new Map();
    events = new EventEmitter();
    set(idBus, latitud, longitud) {
        this.store.set(idBus, { latitud, longitud, updatedAt: Date.now() });
        this.events.emit(this.eventName(idBus), this.store.get(idBus));
    }
    get(idBus) {
        return this.store.get(idBus);
    }
    eventName(idBus) {
        return `bus:loc:${idBus}`;
    }
    onLocation(idBus, listener) {
        const evt = this.eventName(idBus);
        this.events.on(evt, listener);
        return () => this.events.off(evt, listener);
    }
}
const busLocationStore = new BusLocationStore();
export default busLocationStore;
//# sourceMappingURL=bus_location_store.js.map