import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserById } from '$lib/db';

export const GET: RequestHandler = async ({ params }) => {
    try {
        const userId = parseInt(params.id);
        if (isNaN(userId)) {
            return json({ error: 'Invalid user ID' }, { status: 400 });
        }

        const user = await getUserById(userId);
        if (!user) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        return json(user);
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return json({ error: 'Failed to fetch user' }, { status: 500 });
    }
};
