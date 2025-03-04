<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';

	const session = authClient.useSession();
	const logout = async () => await authClient.signOut({ fetchOptions: { onSuccess: () => goto('/') } });
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="flex-1">
		<a href="/" class="btn text-xl btn-ghost">Bar Management</a>
	</div>
	<div class="flex-none">
		{#if $session.data}
			<ul class="menu menu-horizontal px-1">
				<li><a href="/counter" class:link={page.url.pathname === '/counter'}>Counter</a></li>
				<li><button onclick={logout}>Logout</button></li>
			</ul>
		{:else}
			<ul class="menu menu-horizontal px-1">
				<li><a href="/auth/login" class:link={page.url.pathname === '/auth/login'}>Login</a></li>
				<li><a href="/auth/register" class:link={page.url.pathname === '/auth/register'}>Register</a></li>
				<li><a href="/auth/login-admin" class:link={page.url.pathname === '/auth/login-admin'}>Admin</a></li>
			</ul>
		{/if}
	</div>
</div>
