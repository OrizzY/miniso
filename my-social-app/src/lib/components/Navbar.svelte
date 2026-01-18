<script lang="ts">
    import { page } from "$app/stores";

    export let user: any;
    export let logout: () => void;

    let isOpen = false;
</script>

<nav
    class="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100 backdrop-blur-lg bg-opacity-90"
>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex">
                <div class="flex-shrink-0 flex items-center">
                    <a
                        href="/"
                        class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
                    >
                        SocialApp
                    </a>
                </div>
                <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a
                        href="/"
                        class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium {$page
                            .url.pathname === '/'
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
                    >
                        Home
                    </a>
                    {#if user}
                        <a
                            href="/profile/{user.id}"
                            class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium {$page.url.pathname.startsWith(
                                '/profile',
                            ) && $page.params.userId == user.id
                                ? 'border-indigo-500 text-gray-900'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
                        >
                            Profile
                        </a>
                    {/if}
                </div>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:items-center">
                {#if user}
                    <div class="flex items-center space-x-4">
                        <span class="text-sm font-medium text-gray-700"
                            >{user.username}</span
                        >
                        <button
                            on:click={logout}
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
                        >
                            Logout
                        </button>
                    </div>
                {:else}
                    <div class="flex items-center space-x-4">
                        <a
                            href="/login"
                            class="text-sm font-medium text-gray-700 hover:text-gray-900"
                            >Sign in</a
                        >
                        <a
                            href="/signup"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-105"
                            >Sign up</a
                        >
                    </div>
                {/if}
            </div>

            <!-- Mobile menu button -->
            <div class="-mr-2 flex items-center sm:hidden">
                <button
                    on:click={() => (isOpen = !isOpen)}
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                    <span class="sr-only">Open main menu</span>
                    <!-- Icon when menu is closed -->
                    <svg
                        class="{isOpen ? 'hidden' : 'block'} h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                    <!-- Icon when menu is open -->
                    <svg
                        class="{isOpen ? 'block' : 'hidden'} h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile menu -->
    <div
        class="{isOpen
            ? 'block'
            : 'hidden'} sm:hidden bg-white border-b border-gray-200"
    >
        <div class="pt-2 pb-3 space-y-1">
            <a
                href="/"
                class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {$page
                    .url.pathname === '/'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}"
                >Home</a
            >
            {#if user}
                <a
                    href="/profile/{user.id}"
                    class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {$page.url.pathname.startsWith(
                        '/profile',
                    ) && $page.params.userId == user.id
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}"
                    >Profile</a
                >
            {/if}
        </div>
        <div class="pt-4 pb-4 border-t border-gray-200">
            {#if user}
                <div class="flex items-center px-4">
                    <div class="flex-shrink-0">
                        <div
                            class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold"
                        >
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div class="ml-3">
                        <div class="text-base font-medium text-gray-800">
                            {user.username}
                        </div>
                        <div class="text-sm font-medium text-gray-500">
                            {user.email}
                        </div>
                    </div>
                </div>
                <div class="mt-3 space-y-1">
                    <button
                        on:click={logout}
                        class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    >
                        Sign out
                    </button>
                </div>
            {:else}
                <div class="px-4 space-y-2">
                    <a
                        href="/login"
                        class="block text-center w-full px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                        >Sign in</a
                    >
                    <a
                        href="/signup"
                        class="block text-center w-full px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >Sign up</a
                    >
                </div>
            {/if}
        </div>
    </div>
</nav>
