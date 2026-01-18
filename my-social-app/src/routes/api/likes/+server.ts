import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { likePost, unlikePost, hasUserLiked, getLikesCount } from '$lib/db';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const userData = request.headers.get('user-data');
        if (!userData) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = JSON.parse(userData);
        const { postId } = await request.json();

        if (!postId) {
            return json({ error: 'Post ID is required' }, { status: 400 });
        }

        const liked = await hasUserLiked(user.id, postId);

        if (liked) {
            await unlikePost(user.id, postId);
        } else {
            const success = await likePost(user.id, postId);
            if (!success) {
                // Should generally not happen given hasUserLiked check, strictly speaking race condition possible
                // If insert fails (unique constraint), it means it's already liked. 
                // So we can assume it's fine.
            }
        }

        // Get updated count
        const count = await getLikesCount(postId);

        return json({
            success: true,
            liked: !liked,
            count: count
        });

    } catch (error) {
        console.error('Failed to toggle like:', error);
        return json({ error: 'Failed to toggle like' }, { status: 500 });
    }
};
