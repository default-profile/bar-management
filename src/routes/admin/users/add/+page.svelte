<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div class="flex h-full grow items-center justify-center">
	<div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
		<form class="card-body" method="POST" action="?/addUser" use:enhance>
			<label for="name" class="fieldset-label">Name</label>
			<input id="name" type="text" name="name" class="input" placeholder="Name" />
			<label for="email" class="fieldset-label">Email</label>
			<input id="email" type="email" name="email" class="input" placeholder="Email" />
			<button type="submit" class="btn mt-4 btn-neutral">Add</button>
		</form>
	</div>
</div>
