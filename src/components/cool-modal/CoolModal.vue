<template>
	<VModal :open="open" title="Very cool modal" @on-close="emitOnClose">
		<template #default="{ title, modalTitleId }">
			<div class="cool-modal-ui">
				<h4 v-if="title" :id="modalTitleId">{{ title }}</h4>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus dolores ea
					reprehenderit. Consequatur, dolore eligendi error, iste magni minus molestiae molestias
					numquam omnis quos soluta, voluptatum. Commodi harum quas voluptatibus.
				</p>
				<form @submit.prevent="handleFormSubmit">
					<label>
						Enter your cool story name
						<br />
						<input type="text" />
					</label>
					<br />
					<label>
						Write your cool story
						<br />
						<textarea></textarea>
					</label>
					<br />
					<small>
						(note: submission of this form will not send anything, only closes this form)
					</small>
					<br />
					<button>Send</button>
				</form>
			</div>
		</template>
	</VModal>
</template>

<script lang="ts">
	import { Component, Prop, Emit, Vue } from 'vue-property-decorator';

	// Components
	import VModal from '@/components/v-modal/VModal.vue';

	@Component({
		name: 'CoolModal',
		components: {
			VModal,
		},
	})
	export default class CoolModal extends Vue {
		@Prop({
			type: Boolean,
			default: (): boolean => false,
		})
		private readonly open!: boolean;

		@Emit('on-close')
		private emitOnClose(): void {
			return;
		}

		private handleFormSubmit() {
			this.emitOnClose();
		}
	}
</script>

<style scoped lang="scss">
	.cool-modal-ui {
		width: 500px;
		max-width: 90%;
		margin-top: 20px;
		margin-bottom: 20px;
		padding: 25px 15px;
		border-radius: 5px;
		box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
		background-color: #f15858;
		color: #fff;

		h4 {
			margin: 0;
		}
	}
</style>
