import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPosts, createPost } from '$lib/db';

export const GET: RequestHandler = async ({ request, url }) => {
    try {
        const userData = request.headers.get('user-data');
        let userId: number | undefined;

        if (userData) {
            try {
                const user = JSON.parse(userData);
                userId = user.id;
            } catch (e) {
                // Invalid user data, treat as guest
            }
        }

        const authorParam = url.searchParams.get('userId');
        const authorId = authorParam ? parseInt(authorParam) : undefined;

        const posts = await getPosts(50, 0, userId, authorId);
        return json(posts);
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        return json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Simplified auth check - in real app use proper session validation
        const userData = request.headers.get('user-data');
        if (!userData) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = JSON.parse(userData);
        const { content } = await request.json();

        if (!content || content.trim().length === 0) {
            return json({ error: 'Content is required' }, { status: 400 });
        }

        if (content.length > 500) {
            return json({ error: 'Post content too long (max 500 characters)' }, { status: 400 });
        }

        const postId = await createPost(user.id, content.trim());
        return json({ id: postId, message: 'Post created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Failed to create post:', error);
        return json({ error: 'Failed to create post' }, { status: 500 });
    }
};