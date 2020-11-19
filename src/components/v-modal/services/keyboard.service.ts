import {
	EventListenerServiceEventName,
	EventListenerService,
	EventListenerServiceInterface,
} from '@/components/services/event-listener.service';

export interface KeyboardServiceInterface {
	init: () => void;
	destroy: () => void;
	onEsc: (escKeyHandler: () => void) => void;
	onTabNavigation: (tabKeysNavHandler: (event: KeyboardEvent) => void) => void;
}

export class KeyboardService implements KeyboardServiceInterface {
	private _escKeyHandler?: () => void;
	private _tabKeysNavHandler?: (event: KeyboardEvent) => void;
	private _eventListener!: EventListenerServiceInterface;

	constructor() {
		this._eventListener = new EventListenerService(EventListenerServiceEventName.KEY_DOWN);

		this._eventListener.onEvent((event: Event) => {
			this._handler(event as KeyboardEvent);
		});
	}

	public init() {
		this._eventListener.init();
	}

	public destroy() {
		this._eventListener.destroy();
	}

	public onEsc(escKeyHandler: () => void) {
		this._escKeyHandler = escKeyHandler;
	}

	public onTabNavigation(tabKeysNavHandler: (event: KeyboardEvent) => void) {
		this._tabKeysNavHandler = tabKeysNavHandler;
	}

	private _handler(event: KeyboardEvent): void {
		const key: string = event.key;
		const keyCode: number = event.keyCode;

		switch (true) {
			case (key && 'Escape' === key) || (keyCode && 27 === keyCode): {
				event.preventDefault();
				this._escKeyHandler && this._escKeyHandler();

				break;
			}
			case (key && 'Tab' === key) || (keyCode && 9 === keyCode): {
				this._tabKeysNavHandler && this._tabKeysNavHandler(event);

				break;
			}
			default:
				break;
		}
	}
}
