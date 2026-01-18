<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import Post from "$lib/components/Post.svelte";

    let profileUser: any = null;
    let posts: any[] = [];
    let currentUser: any = null;
    let loading = true;
    let error: string | null = null;

    $: userId = $page.params.userId;

    // React to userId changes
    $: if (userId) {
        loadProfile();
    }

    onMount(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            currentUser = JSON.parse(userData);
        }
    });

    async function loadProfile() {
        loading = true;
        error = null;
        try {
            // Fetch user info
            const userRes = await fetch(`/api/users/${userId}`);
            if (!userRes.ok) throw new Error("User not found");
            profileUser = await userRes.json();

            // Fetch user posts
            const headers: HeadersInit = {};
            if (currentUser) {
                headers["user-data"] = JSON.stringify(currentUser);
            }

            const postsRes = await fetch(`/api/posts?userId=${userId}`, {
                headers,
            });
            if (postsRes.ok) {
                posts = await postsRes.json();
            }
        } catch (e: any) {
            error = e.message;
        } finally {
            loading = false;
        }
    }
</script>

<div class="pb-12">
    <!-- Profile Background/Header -->
    <div class="bg-white border-b border-gray-200">
        <div
            class="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 w-full"
        ></div>
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="relative -mt-16 sm:-mt-20 pb-6 flex items-end">
                <div class="relative group">
                    <div
                        class="h-32 w-32 sm:h-40 sm:w-40 rounded-full ring-4 ring-white bg-white flex items-center justify-center text-indigo-600 font-bold text-5xl sm:text-6xl shadow-md overflow-hidden"
                    >
                        {#if profileUser}
                            {profileUser.username.charAt(0).toUpperCase()}
                        {:else}
                            ?
                        {/if}
                    </div>
                </div>
                <div class="ml-6 pb-2">
                    {#if loading}
                        <div
                            class="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"
                        ></div>
                        <div
                            class="h-4 bg-gray-200 rounded w-32 animate-pulse"
                        ></div>
                    {:else if profileUser}
                        <h1 class="text-3xl font-bold text-gray-900">
                            {profileUser.username}
                        </h1>
                        <p class="text-gray-500 font-medium">
                            Joined {new Date(
                                profileUser.created_at,
                            ).toLocaleDateString(undefined, {
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <main class="max-w-xl mx-auto px-4 sm:px-0 mt-8">
        {#if loading && !profileUser}
            <div
                class="text-center py-12 rounded-xl bg-white text-gray-500 font-medium border border-gray-100"
            >
                Loading profile...
            </div>
        {:else if error}
            <div
                class="text-center py-12 rounded-xl bg-red-50 text-red-600 font-medium border border-red-100"
            >
                {error}
            </div>
        {:else if !loading}
            <div class="flex items-center justify-between mb-6">
                <h3
                    class="text-xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-1 inline-block"
                >
                    Posts
                </h3>
                <span
                    class="text-gray-500 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full"
                    >{posts.length} entries</span
                >
            </div>

            {#if posts.length === 0}
                <div
                    class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                    <div class="text-5xl mb-4">📭</div>
                    <h3 class="text-lg font-medium text-gray-900">
                        No posts yet
                    </h3>
                    <p class="text-gray-500 mt-1">
                        This user hasn't posted anything.
                    </p>
                </div>
            {:else}
                <div class="space-y-6">
                    {#each posts as post (post.id)}
                        <Post {post} user={currentUser} />
                    {/each}
                </div>
            {/if}
        {/if}
    </main>
</div>
