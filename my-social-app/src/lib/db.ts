import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export async function getDb(): Promise<Database> {
    if (!db) {
        db = await open({
            filename: './social.db',
            driver: sqlite3.Database,
        });
        await initDb(db);
    }
    return db;
}

async function initDb(database: Database) {
    // Create users table
    await database.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT UNIQUE NOT NULL,
			email TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

    // Create posts table
    await database.exec(`
		CREATE TABLE IF NOT EXISTS posts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			content TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users (id)
		)
	`);

    // Create likes table
    await database.exec(`
		CREATE TABLE IF NOT EXISTS likes (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			post_id INTEGER NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			UNIQUE(user_id, post_id),
			FOREIGN KEY (user_id) REFERENCES users (id),
			FOREIGN KEY (post_id) REFERENCES posts (id)
		)
	`);
}

// Helper functions
export async function createUser(username: string, email: string, hashedPassword: string) {
    const database = await getDb();
    const result = await database.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
    );
    return result.lastID;
}

export async function getUserByEmail(email: string) {
    const database = await getDb();
    return await database.get('SELECT * FROM users WHERE email = ?', [email]);
}

export async function getUserById(id: number) {
    const database = await getDb();
    return await database.get('SELECT id, username, email, created_at FROM users WHERE id = ?', [id]);
}

export async function createPost(userId: number, content: string) {
    const database = await getDb();
    const result = await database.run(
        'INSERT INTO posts (user_id, content) VALUES (?, ?)',
        [userId, content]
    );
    return result.lastID;
}

export async function getPosts(limit = 50, offset = 0, currentUserId?: number, authorId?: number) {
    const database = await getDb();
    const query = `
		SELECT 
            posts.*, 
            users.username,
            (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) as likes_count
            ${currentUserId ? ', (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) as user_liked' : ''}
		FROM posts
		JOIN users ON posts.user_id = users.id
        ${authorId ? 'WHERE posts.user_id = ?' : ''}
		ORDER BY posts.created_at DESC
		LIMIT ? OFFSET ?
	`;

    const params: any[] = [];
    if (currentUserId) params.push(currentUserId);
    if (authorId) params.push(authorId);
    params.push(limit, offset);

    return await database.all(query, params);
}

export async function getPostsByUser(userId: number) {
    const database = await getDb();
    return await database.all(`
		SELECT posts.*, users.username
		FROM posts
		JOIN users ON posts.user_id = users.id
		WHERE posts.user_id = ?
		ORDER BY posts.created_at DESC
	`, [userId]);
}

export async function likePost(userId: number, postId: number) {
    const database = await getDb();
    try {
        await database.run(
            'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
            [userId, postId]
        );
        return true;
    } catch (error) {
        // Unique constraint violation means already liked
        return false;
    }
}

export async function unlikePost(userId: number, postId: number) {
    const database = await getDb();
    await database.run(
        'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
        [userId, postId]
    );
}

export async function getLikesCount(postId: number) {
    const database = await getDb();
    const result = await database.get(
        'SELECT COUNT(*) as count FROM likes WHERE post_id = ?',
        [postId]
    );
    return result.count;
}

export async function hasUserLiked(userId: number, postId: number) {
    const database = await getDb();
    const result = await database.get(
        'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
        [userId, postId]
    );
    return !!result;
}