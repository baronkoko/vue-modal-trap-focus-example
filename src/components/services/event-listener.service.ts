export enum EventListenerServiceEventName {
	KEY_DOWN = 'keydown',
}

export interface EventListenerServiceInterface {
	onEvent: (onEvent: (e: Event) => void) => void;
	init: () => void;
	destroy: () => void;
}

export class EventListenerService implements EventListenerServiceInterface {
	private readonly eventName: EventListenerServiceEventName;
	private _onEvent?: (e: Event) => void;
	private _boundedEventListenersHandler: (e: Event) => void = this._eventListenersHandler.bind(
		this
	);

	constructor(eventName: EventListenerServiceEventName) {
		this.eventName = eventName;
	}

	public onEvent(onEvent: (e: Event) => void) {
		this._onEvent = onEvent;
	}

	public init() {
		this._toggleListener(true);
	}

	public destroy() {
		this._toggleListener(false);
	}

	private _toggleListener(state: boolean) {
		state
			? document.addEventListener(this.eventName, this._boundedEventListenersHandler)
			: document.removeEventListener(this.eventName, this._boundedEventListenersHandler);
	}

	private _eventListenersHandler(e: Event) {
		if (this._onEvent) {
			this._onEvent(e);
		}
	}
}
