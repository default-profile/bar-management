<script lang="ts">
	import { enhance } from '$app/forms';
	import { quantity } from '$lib/utils';
</script>

<div class="flex h-full grow items-center justify-center">
	<div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
		<form class="card-body" method="POST" action="?/addProduct" use:enhance>
			<label for="name" class="fieldset-label">Name</label>
			<input id="name" type="text" name="name" class="input" placeholder="Name" />
			<label for="price" class="fieldset-label">Price</label>
			<input id="price" type="number" name="price" class="input" placeholder="Price" />
			<label for="quantity" class="fieldset-label">Quantity</label>
			<select id="quantity" name="quantity" class="select">
				{#each quantity as q}
					<option>{q}</option>
				{/each}
			</select>
			<button type="submit" class="btn mt-4 btn-neutral">Add</button>
		</form>
	</div>
</div>
