import { EventEmitter } from 'node:events'

type Location = {
  latitud: number
  longitud: number
  updatedAt: number // epoch ms
}

class BusLocationStore {
  private store = new Map<number, Location>()
  private events = new EventEmitter()

  public set(idBus: number, latitud: number, longitud: number) {
    this.store.set(idBus, { latitud, longitud, updatedAt: Date.now() })
    this.events.emit(this.eventName(idBus), this.store.get(idBus)!)
  }

  public get(idBus: number): Location | undefined {
    return this.store.get(idBus)
  }

  private eventName(idBus: number) {
    return `bus:loc:${idBus}`
  }

  // Suscripción para SSE: retorna un unsubscribe
  public onLocation(idBus: number, listener: (loc: Location) => void) {
    const evt = this.eventName(idBus)
    this.events.on(evt, listener)
    return () => this.events.off(evt, listener)
  }
}

const busLocationStore = new BusLocationStore()
export default busLocationStore
