window.VERA_EMITTER = window.VERA_EMITTER || {
  events: {},
  emit(event, ...args) {
    (this.events[event] || []).forEach((i) => i(...args));
  },
  on(event, cb) {
    (this.events[event] = this.events[event] || []).push(cb);
    return () => (this.events[event] = (this.events[event] || []).filter((i) => i !== cb));
  }
};
const emitter = window.VERA_EMITTER;
export default emitter;
const EVENTS = {
  CURSOR_SELECT: 'CURSOR.SELECT',
  CURSOR_MOVE: 'CURSOR.MOVE',
  CURSOR_CLICK: 'CURSOR.CLICK',
  CAMERA_CONTROL: 'CAMERA.CONTROL',
  USERNAME: 'USERNAME'
};
export { EVENTS };