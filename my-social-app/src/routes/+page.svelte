<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import Post from "$lib/components/Post.svelte";

    let user: any = null;
    let posts: any[] = [];
    let newPost = "";
    let loading = false;
    let posting = false;

    onMount(() => {
        // Check if user is logged in
        const userData = localStorage.getItem("user");
        if (userData) {
            user = JSON.parse(userData);
        } else {
            goto("/login");
        }
        loadPosts();
    });

    async function loadPosts() {
        loading = true;
        try {
            const headers: HeadersInit = {};
            if (user) {
                headers["user-data"] = JSON.stringify(user);
            }
            const response = await fetch("/api/posts", { headers });
            if (response.ok) {
                posts = await response.json();
            }
        } catch (error) {
            console.error("Failed to load posts:", error);
        } finally {
            loading = false;
        }
    }

    async function handlePost() {
        if (!newPost.trim()) return;

        posting = true;
        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "user-data": JSON.stringify(user),
                },
                body: JSON.stringify({ content: newPost }),
            });

            if (response.ok) {
                newPost = "";
                loadPosts(); // Reload posts
            }
        } catch (error) {
            console.error("Failed to create post:", error);
        } finally {
            posting = false;
        }
    }

    function logout() {
        localStorage.removeItem("user");
        user = null;
        goto("/login");
    }
</script>

<div class="max-w-xl mx-auto py-8 px-4 sm:px-0">
    <!-- Post Form -->
    <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 transition-shadow hover:shadow-md duration-300"
    >
        <h2 class="text-xl font-bold mb-4 text-gray-800">Create Post</h2>
        <div class="relative">
            <textarea
                bind:value={newPost}
                placeholder="What's happening?"
                class="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                rows="3"
            ></textarea>
        </div>
        <div class="mt-4 flex justify-end">
            <button
                on:click={handlePost}
                disabled={posting || !newPost.trim()}
                class="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center"
            >
                {#if posting}
                    <svg
                        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        ></circle>
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Posting...
                {:else}
                    Post
                {/if}
            </button>
        </div>
    </div>

    <!-- Posts -->
    {#if loading}
        <div class="space-y-4">
            {#each Array(3) as _}
                <div
                    class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse"
                >
                    <div class="flex items-center mb-4">
                        <div class="rounded-full bg-gray-200 h-10 w-10"></div>
                        <div class="ml-3 space-y-2">
                            <div class="h-4 bg-gray-200 rounded w-24"></div>
                            <div class="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            {/each}
        </div>
    {:else if posts.length === 0}
        <div
            class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100"
        >
            <div class="text-6xl mb-4">📝</div>
            <h3 class="text-lg font-medium text-gray-900">No posts yet</h3>
            <p class="text-gray-500 mt-1">Be the first to share something!</p>
        </div>
    {:else}
        <div class="space-y-6">
            {#each posts as post (post.id)}
                <Post {post} {user} />
            {/each}
        </div>
    {/if}
</div>
