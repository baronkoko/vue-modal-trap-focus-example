<template>
	<div class="home-ui">
		<button type="button" @click="handleOpenModalCLick">Open modal with focus trap</button>
		<CoolModal :open="coolModalIsOpen" @on-close="setCoolModalIsOpen(false)" />
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';

	// Components
	import CoolModal from '@/components/cool-modal/CoolModal.vue';

	@Component({
		name: 'Home',
		components: { CoolModal },
	})
	export default class Home extends Vue {
		private coolModalIsOpen = false;

		private handleOpenModalCLick(): void {
			this.setCoolModalIsOpen(true);
		}

		private setCoolModalIsOpen(state: boolean): void {
			this.coolModalIsOpen = state;
		}
	}
</script>
