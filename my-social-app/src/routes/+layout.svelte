<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import favicon from "$lib/assets/favicon.svg";
	import "../app.css";
	import Navbar from "$lib/components/Navbar.svelte";

	let { children } = $props();

	let user: any = null;

	onMount(() => {
		const userData = localStorage.getItem("user");
		if (userData) {
			user = JSON.parse(userData);
		}
	});

	function logout() {
		localStorage.removeItem("user");
		user = null;
		goto("/login");
	}

	// Reactively update user if localstorage changes (optional, but good for multi-tab)
	// For now, simpler approach: pages that modify user should update localstorage and maybe reload or use store.
	// We'll rely on onMount in pages to redirect if not logged in, but layout needs to know user for Navbar.
	// A store would be better, but sticking to "minimal" requirements without complex state management for now.
	// We will listen to route changes to re-check user possibly?
	// Actually, let's just use a simple reactive statement if we were using a store.
	// Since we aren't using a store, we'll just check on mount.
	// Ideally, login should reload or we use a store.
	// Let's add an event listener for storage to sync across tabs/updates.

	function updateAuth() {
		const userData = localStorage.getItem("user");
		user = userData ? JSON.parse(userData) : null;
	}

	$effect(() => {
		// Run on every navigation to ensure state is fresh if changed elsewhere (like login page)
		// With Svelte 5 runes ($effect), we might need to be careful.
		// But since we are in .svelte file, we can use legacy reactivity or runes.
		// The original code used svelte 5 syntax? "let { children } = $props();" suggests yes.
		// Let's stick to standard Svelte 5 patterns if possible, or mixed.
		// For simplicity with this current setup, we'll trust page navigations to handle most logic.
		// We will just expose 'logout' to Navbar.
		if ($page.url.pathname) {
			// subtle dependency to trigger update
			updateAuth();
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col font-sans">
	{#if !["/login", "/signup"].includes($page.url.pathname)}
		<Navbar {user} {logout} />
	{/if}

	<main class="flex-grow">
		{@render children()}
	</main>

	<footer class="bg-white border-t border-gray-200 mt-auto">
		<div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
			<p class="text-center text-sm text-gray-500">
				&copy; {new Date().getFullYear()} Minimal Social App. All rights
				reserved.
			</p>
		</div>
	</footer>
</div>
