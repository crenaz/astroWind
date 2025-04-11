const getNormalizedPost = async (post, filepath) => {
	// Add error checking and default values
	if (!post || typeof post !== 'object') {
		console.warn(`Invalid post data for file: ${filepath}`);
		return null;
	}

	try {
		// Handle both possible post data structures
		const frontmatter = post.frontmatter || post;
		const Content = post.Content || post.default;
		const ID = filepath.split('/').pop().split('.').shift();

		// Validate required fields
		if (!frontmatter.title || !frontmatter.publishDate) {
			console.warn(`Missing required fields in post: ${filepath}`);
			return null;
		}

		return {
			id: ID,
			publishDate: frontmatter.publishDate,
			draft: frontmatter.draft || false,
			canonical: frontmatter.canonical || '',
			slug: frontmatter.slug || ID,
			title: frontmatter.title,
			description: frontmatter.description || '',
			image: frontmatter.image || '',
			Content: Content || null,
			excerpt: frontmatter.excerpt || frontmatter.description || '',
			authors: frontmatter.authors || [],
			category: frontmatter.category || '',
			tags: frontmatter.tags || [],
			readingTime: frontmatter.readingTime || 0,
		};
	} catch (e) {
		console.error(`Error processing post ${filepath}:`, e);
		return null;
	}
};

const load = async function () {
	const posts = import.meta.glob(['~/../data/blog/**/*.md', '~/../data/blog/**/*.mdx'], {
		query: '?raw',
		import: 'default',
		eager: true,
	});

	const normalizedPosts = Object.keys(posts).map(async (key) => {
		const post = await posts[key];
		return await getNormalizedPost(post, key);
	});

	const results = (await Promise.all(normalizedPosts))
		.filter((post) => post !== null) // Filter out invalid posts
		.sort((a, b) => new Date(b.publishDate).valueOf() - new Date(a.publishDate).valueOf())
		.filter((post) => !post.draft);

	return results;
};

let _posts;

/** */
export const fetchPosts = async () => {
	_posts = _posts || load();

	return await _posts;
};

/** */
export const findPostsByIds = async (ids) => {
	if (!Array.isArray(ids)) return [];

	const posts = await fetchPosts();

	return ids.reduce(function (r, id) {
		posts.some(function (post) {
			return id === post.id && r.push(post);
		});
		return r;
	}, []);
};

/** */
export const findLatestPosts = async ({ count }) => {
	const _count = count || 4;
	const posts = await fetchPosts();

	return posts ? posts.slice(_count * -1) : [];
};
