export interface FocusTrapServiceInterface {
	focus: () => void;
	blur: () => void;
	trapFocus: (e: KeyboardEvent) => void;
}

export class FocusTrapService implements FocusTrapServiceInterface {
	private _initiallyFocusedElement: HTMLElement | null = null;
	private readonly _firstFocusableElement: HTMLElement;
	private readonly _lastFocusableElement: HTMLElement;

	constructor(focusContainer: HTMLElement, lastFocusElement: HTMLElement) {
		this._firstFocusableElement = focusContainer;
		this._lastFocusableElement = lastFocusElement;
	}

	public focus() {
		const lastFocusedElement: Element | null = document.activeElement;

		if (lastFocusedElement) {
			this._setInitiallyFocusedElement(lastFocusedElement as HTMLElement);
		}

		this._firstFocusableElement.focus();
	}

	public blur() {
		if (!this._initiallyFocusedElement) {
			return;
		}

		this._initiallyFocusedElement.focus();
	}

	public trapFocus(e: KeyboardEvent) {
		const lastFocusedElement: Element | null = document.activeElement;

		if (!lastFocusedElement) {
			return;
		}

		if (e.shiftKey) {
			if (lastFocusedElement === this._firstFocusableElement) {
				this._lastFocusableElement.focus();

				e.preventDefault();
			}

			return;
		}

		if (lastFocusedElement === this._lastFocusableElement) {
			this._firstFocusableElement.focus();

			e.preventDefault();
		}
	}

	private _setInitiallyFocusedElement(el: HTMLElement) {
		this._initiallyFocusedElement = el;
	}
}
