import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createUser, getUserByEmail } from '$lib/db';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { username, email, password } = await request.json();

        // Validation
        if (!username || !email || !password) {
            return json({ error: 'All fields are required' }, { status: 400 });
        }

        if (password.length < 6) {
            return json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return json({ error: 'Email already registered' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const userId = await createUser(username, email, hashedPassword);

        return json({ message: 'User created successfully', userId }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};