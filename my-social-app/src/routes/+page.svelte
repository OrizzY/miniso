<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

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
            const response = await fetch("/api/posts");
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

<div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
                <h1 class="text-2xl font-bold text-gray-900">Social App</h1>
                <div class="flex items-center space-x-4">
                    <span class="text-gray-700">Welcome, {user?.username}</span>
                    <button
                        on:click={logout}
                        class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <!-- Post Form -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-lg font-semibold mb-4">What's on your mind?</h2>
            <textarea
                bind:value={newPost}
                placeholder="Share your thoughts..."
                class="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="3"
            ></textarea>
            <button
                on:click={handlePost}
                disabled={posting || !newPost.trim()}
                class="mt-3 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {posting ? "Posting..." : "Post"}
            </button>
        </div>

        <!-- Posts -->
        {#if loading}
            <div class="text-center py-8">Loading posts...</div>
        {:else if posts.length === 0}
            <div class="text-center py-8 text-gray-500">
                No posts yet. Be the first to post!
            </div>
        {:else}
            <div class="space-y-6">
                {#each posts as post}
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center mb-4">
                            <div
                                class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold"
                            >
                                {post.username.charAt(0).toUpperCase()}
                            </div>
                            <div class="ml-3">
                                <h3 class="font-semibold text-gray-900">
                                    {post.username}
                                </h3>
                                <p class="text-sm text-gray-500">
                                    {new Date(post.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <p class="text-gray-800 mb-4">{post.content}</p>
                        <div class="flex items-center space-x-4">
                            <button
                                class="text-gray-500 hover:text-red-500 flex items-center space-x-1"
                            >
                                <span>❤️</span>
                                <span>0</span>
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </main>
</div>
