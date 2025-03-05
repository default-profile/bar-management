<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { quantity } from '$lib/utils';

	const session = authClient.useSession();
	const logout = async () => await authClient.signOut({ fetchOptions: { onSuccess: () => goto('/') } });
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="flex-1">
		<a href="/" class="btn text-xl btn-ghost">Bar Management</a>
	</div>
	<div class="flex-none">
		{#if $session.data}
			{#if $session.data.user.role === 'admin'}
				<!-- Admin menu items -->
				<ul class="menu menu-horizontal px-1">
					<li><a href="/admin/products" class:link={page.url.pathname === '/admin/products'}>Products</a></li>
					<li>
						<details>
							<summary>Counter</summary>
							<ul class="rounded-t-none bg-base-100 p-2">
								{#each quantity as q}
									<li>
										<a href="/admin/counter/{q}" class:link={page.url.pathname === `/admin/counter/${q}`}>{q}ML</a>
									</li>
								{/each}
							</ul>
						</details>
					</li>
					<li>
						<details>
							<summary>{$session.data.user.name}</summary>
							<ul class="rounded-t-none bg-base-100 p-2">
								<li><button onclick={logout}>LogOut</button></li>
							</ul>
						</details>
					</li>
				</ul>
			{:else}
				<!-- User menu items -->
				<ul class="menu menu-horizontal px-1">
					<li>
						<details>
							<summary>Counter</summary>
							<ul class="rounded-t-none bg-base-100 p-2">
								{#each quantity as q}
									<li>
										<a href="/counter/{q}" class:link={page.url.pathname === `/counter/${q}`}>{q}ML</a>
									</li>
								{/each}
							</ul>
						</details>
					</li>
					<li>
						<details>
							<summary>{$session.data.user.name}</summary>
							<ul class="rounded-t-none bg-base-100 p-2">
								<li><button onclick={logout}>LogOut</button></li>
							</ul>
						</details>
					</li>
				</ul>
			{/if}
		{:else}
			<ul class="menu menu-horizontal px-1">
				<li><a href="/auth/login" class:link={page.url.pathname === '/auth/login'}>Login</a></li>
				<li><a href="/auth/login-admin" class:link={page.url.pathname === '/auth/login-admin'}>Admin</a></li>
			</ul>
		{/if}
	</div>
</div>
