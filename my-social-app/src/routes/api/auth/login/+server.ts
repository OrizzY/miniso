import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserByEmail } from '$lib/db';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, password } = await request.json();

        // Validation
        if (!email || !password) {
            return json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Find user
        const user = await getUserByEmail(email);
        if (!user) {
            return json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Return user data (exclude password)
        const { password: _, ...userWithoutPassword } = user;
        return json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};