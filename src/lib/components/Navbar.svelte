<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { quantity } from '$lib/utils';
	import { SvelteDate } from 'svelte/reactivity';

	let { height = $bindable() } = $props();

	const date = new SvelteDate();
	const dateString = $derived(date.toISOString().split('T')[0]);
	const session = authClient.useSession();
	const logout = async () => await authClient.signOut({ fetchOptions: { onSuccess: () => goto('/') } });
</script>

<div class="drawer">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div bind:clientHeight={height} class="navbar w-full bg-base-100 shadow-sm">
			<a href="/" class="mx-2 flex-1 px-2">Bar Management</a>
			<div class="flex-none md:hidden">
				<label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block h-6 w-6 stroke-current"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
					</svg>
				</label>
			</div>
			<div class="hidden flex-none md:block">
				<ul class="menu menu-horizontal px-1">
					{@render desktopMenu($session.data)}
				</ul>
			</div>
		</div>
		<!-- Page content here -->
		<!-- Content -->
	</div>
	<div class="drawer-side z-10">
		<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu min-h-full w-80 space-y-2 bg-base-200 p-4 text-lg">
			{@render mobileMenu($session.data)}
		</ul>
	</div>
</div>

{#snippet mobileMenu(session: typeof authClient.$Infer.Session | null)}
	{#if session}
		{#if session.user.role === 'admin'}
			{@render adminMenu(session.user.name)}
		{:else}
			{@render userMenu(session.user.name)}
		{/if}
	{:else}
		<li><a href="/auth/login" class:link={page.url.pathname === '/auth/login'}>Login</a></li>
		<li><a href="/auth/login-admin" class:link={page.url.pathname === '/auth/login-admin'}>Admin</a></li>
	{/if}
{/snippet}

{#snippet desktopMenu(session: typeof authClient.$Infer.Session | null)}
	{#if session}
		{#if session.user.role === 'admin'}
			{@render adminMenu(session.user.name)}
		{:else}
			{@render userMenu(session.user.name)}
		{/if}
	{:else}
		<li><a href="/auth/login" class:link={page.url.pathname === '/auth/login'}>Login</a></li>
		<li><a href="/auth/login-admin" class:link={page.url.pathname === '/auth/login-admin'}>Admin</a></li>
	{/if}
{/snippet}

{#snippet adminMenu(userName: string)}
	<li>
		<a href="/admin/data" class:link={page.url.pathname === `/admin/data`}>Data</a>
	</li>
	<li>
		<details>
			<summary>Users</summary>
			<ul class="z-10 rounded-t-none bg-base-100 p-2">
				<li><a href="/admin/users/list" class:link={page.url.pathname === '/admin/users/list'}>List</a></li>
				<li><a href="/admin/users/add" class:link={page.url.pathname === '/admin/users/add'}>Add</a></li>
			</ul>
		</details>
	</li>
	<li>
		<details>
			<summary>Products</summary>
			<ul class="z-10 rounded-t-none bg-base-100 p-2">
				{#each quantity as q}
					<li>
						<a href="/admin/products/{q}" class:link={page.url.pathname === `/admin/products/${q}`}>{q}ML</a>
					</li>
				{/each}
				<li><a href="/admin/products/add" class:link={page.url.pathname === '/admin/products/add'}>Add</a></li>
			</ul>
		</details>
	</li>
	<li>
		<details>
			<summary>Counter</summary>
			<ul class="z-10 rounded-t-none bg-base-100 p-2">
				{#each quantity as q}
					<li>
						<a
							href="/admin/counter/{dateString}/{q}"
							class:link={page.url.pathname === `/admin/counter/${dateString}/${q}`}>{q}ML</a
						>
					</li>
				{/each}
			</ul>
		</details>
	</li>
	<li>
		<details>
			<summary class="bg-primary-content">{userName}</summary>
			<ul class="rounded-t-none bg-base-100 p-2">
				<li><button onclick={logout}>LogOut</button></li>
			</ul>
		</details>
	</li>
{/snippet}

{#snippet userMenu(userName: string)}
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
			<summary class="bg-primary-content">{userName}</summary>
			<ul class="rounded-t-none bg-base-100 p-2">
				<li><button onclick={logout}>LogOut</button></li>
			</ul>
		</details>
	</li>
{/snippet}
