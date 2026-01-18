<script lang="ts">
    import { goto } from "$app/navigation";

    export let post: any;
    export let user: any;

    async function toggleLike() {
        if (!user) return goto("/login");

        // Optimistic update
        const originalLiked = post.user_liked;
        const originalCount = post.likes_count;

        post.user_liked = !post.user_liked;
        post.likes_count += post.user_liked ? 1 : -1;
        // Svelte self-assignment to trigger reactivity might be needed depending on context,
        // but mutating object prop usually works if referenced in template.
        // To be safe we create a new reference if needed, but for now simple mutation.

        try {
            const response = await fetch("/api/likes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "user-data": JSON.stringify(user),
                },
                body: JSON.stringify({ postId: post.id }),
            });

            if (response.ok) {
                const data = await response.json();
                post.likes_count = data.count;
                post.user_liked = data.liked;
            } else {
                // Revert
                post.user_liked = originalLiked;
                post.likes_count = originalCount;
            }
        } catch (error) {
            post.user_liked = originalLiked;
            post.likes_count = originalCount;
        }
    }
</script>

<div
    class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
>
    <div class="flex items-center mb-4">
        <a href="/profile/{post.user_id}" class="flex-shrink-0 group">
            <div
                class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm group-hover:ring-2 group-hover:ring-indigo-300 transition-all"
            >
                {post.username.charAt(0).toUpperCase()}
            </div>
        </a>
        <div class="ml-3">
            <h3 class="font-semibold text-gray-900 leading-tight">
                <a
                    href="/profile/{post.user_id}"
                    class="hover:text-indigo-600 transition-colors"
                    >{post.username}</a
                >
            </h3>
            <p class="text-xs text-gray-500 mt-0.5">
                {new Date(post.created_at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                })}
            </p>
        </div>
    </div>
    <div
        class="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed text-[15px] break-words"
    >
        {post.content}
    </div>
    <div class="flex items-center pt-2 border-t border-gray-50">
        <button
            on:click={toggleLike}
            class="flex items-center space-x-2 px-2 py-1 -ml-2 rounded-lg transition-all active:scale-95 group {post.user_liked
                ? 'text-red-500'
                : 'text-gray-500 hover:text-red-500 hover:bg-red-50'}"
        >
            <div class="relative w-6 h-6">
                {#if post.user_liked}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-6 h-6 animate-heartbeat"
                    >
                        <path
                            d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                        />
                    </svg>
                {:else}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                    </svg>
                {/if}
            </div>

            <span
                class="text-sm font-medium tracking-wide"
                class:font-semibold={post.user_liked}
                >{post.likes_count || 0}</span
            >
        </button>
    </div>
</div>

<style>
    @keyframes heartbeat {
        0% {
            transform: scale(1);
        }
        25% {
            transform: scale(1.2);
        }
        50% {
            transform: scale(1);
        }
        75% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
    .animate-heartbeat {
        animation: heartbeat 0.4s ease-in-out;
    }
</style>
