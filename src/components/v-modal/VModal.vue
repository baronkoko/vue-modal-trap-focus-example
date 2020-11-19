<template>
	<transition
		name="fade"
		@after-enter="setModalIsReady(true)"
		@after-leave="setModalIsReady(false)"
	>
		<div
			v-if="open"
			:class="['v-modal-ui', modalClassNames]"
			ref="modal"
			role="dialog"
			aria-modal="true"
			:aria-labelledby="modalTitleId"
		>
			<div
				ref="overlay"
				class="v-modal-ui__overlay"
				tabindex="0"
				@mousedown.self="closeModalOnOverlayClick"
			>
				<slot
					:title="title"
					:modal-title-id="modalTitleId"
					:handle-modal-close="handleModalClose"
				/>
				<button
					ref="closeBtn"
					class="v-modal-ui__keyboard-close-btn"
					type="button"
					@click="handleModalClose"
				>
					Close (Esc)
				</button>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
	import { Component, Prop, Ref, Emit, Watch, Vue } from 'vue-property-decorator';

	// Services
	import {
		KeyboardService,
		KeyboardServiceInterface,
	} from '@/components/v-modal/services/keyboard.service';
	import {
		FocusTrapService,
		FocusTrapServiceInterface,
	} from '@/components/v-modal/services/focus-trap.service';

	// Utils
	import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
	import { getUniqId } from '@/utils/number.ts';

	@Component({
		name: 'VModal',
	})
	export default class VModal extends Vue {
		@Ref('modal') private readonly modal?: HTMLElement;
		@Ref('overlay') private readonly overlay?: HTMLElement;
		@Ref('closeBtn') private readonly closeBtn?: HTMLElement;

		@Prop({
			type: String,
			default: (): string => ' ',
		})
		private readonly title!: string;

		@Prop({
			type: Boolean,
			default: (): boolean => false,
		})
		private readonly open!: boolean;

		private modalIsReady = false;
		private keyBoardService: KeyboardServiceInterface = new KeyboardService();
		private focusTrapService: FocusTrapServiceInterface | null = null;
		private readonly modalTitleId = `v-modal-${getUniqId()}`;

		get modalClassNames(): string[] {
			return [this.modalIsReady ? 'is-open' : ''];
		}

		@Watch('open')
		private onOpenChanged(value: boolean) {
			value ? this.handleModalOpen() : this.handleModalClose();
		}

		created() {
			this.init();
		}

		beforeDestroy() {
			this.handleModalClose();
		}

		@Emit('on-close')
		private emitOnClose(): void {
			return;
		}

		@Emit('on-open')
		private emitOnOpen(): void {
			return;
		}

		private init() {
			this.initKeyboardServiceListeners();
		}

		private handleModalOpen() {
			this.onModalOpen();
			this.emitOnOpen();
		}

		private handleModalClose() {
			this.onModalClose();
			this.emitOnClose();
		}

		private async onModalOpen() {
			await this.$nextTick();

			if (!this.modal) {
				return;
			}

			disableBodyScroll(this.modal, {
				reserveScrollBarGap: true,
			});

			this.initFocusTrapService();
			this.keyBoardService.init();
			this.focusTrapService && this.focusTrapService.focus();
		}

		private onModalClose() {
			clearAllBodyScrollLocks();
			this.keyBoardService.destroy();
			this.focusTrapService && this.focusTrapService.blur();
		}

		private initKeyboardServiceListeners() {
			this.keyBoardService.onEsc(() => {
				this.handleModalClose();
			});
			this.keyBoardService.onTabNavigation((event: KeyboardEvent) => {
				this.focusTrapService && this.focusTrapService.trapFocus(event);
			});
		}

		private initFocusTrapService() {
			if (!this.overlay || !this.closeBtn) {
				return;
			}

			this.focusTrapService = new FocusTrapService(this.overlay, this.closeBtn);
		}

		private closeModalOnOverlayClick(event: Event) {
			if (event.target === this.overlay) {
				this.handleModalClose();
			}
		}

		private setModalIsReady(state: boolean) {
			this.$nextTick(() => {
				this.modalIsReady = state;
			});
		}
	}
</script>

<style scoped lang="scss">
	$v-modal-ui-overlay-bg-color: rgba(255, 255, 255, 0.59) !default;
	$v-modal-ui-z-index: 2 !default;

	.v-modal-ui {
		$self: &;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		z-index: $v-modal-ui-z-index;

		&__overlay {
			display: flex;
			flex-flow: column nowrap;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			flex-grow: 0;
			width: 100%;
			min-height: 100%;
			margin: auto;
			background-color: $v-modal-ui-overlay-bg-color;

			&:focus {
				outline: none;
			}
		}

		&__keyboard-close-btn {
			position: absolute;
			right: 10px;
			top: 10px;
			transform: translateY(-120%);
			opacity: 0;
			transition: opacity 0.3s ease, transform 0.3s ease;
			z-index: 1;

			&:focus {
				transform: translateY(0);
				opacity: 1;
			}
		}
	}
</style>
