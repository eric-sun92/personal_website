// import { cache } from 'react';
const revalidate = 60;
const HOURS_12 = 60 * 60 * 12;

// User not working anymore

// TODO: Implement option to switch between info for authenticated user and other users.
export async function getUser(username) {
	const res = await fetch('https://api.github.com/users/' + username, {
		headers: { Authorization: `Bearer ${process.env.GH_TOKEN}` },
		next: { revalidate }
	});
	return res.json();
}

export async function getRepos(username) {
    const repos = [];
    let page = 1;
    let fetchMore = true;

    while(fetchMore) {
        const res = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=100`, {
            cache: 'no-store',
            headers: { Authorization: `Bearer ${process.env.GH_TOKEN}` },
        });
        const data = await res.json();
        if (data.length > 0) {
            repos.push(...data);
            page++;
        } else {
            fetchMore = false;
        }
    }

    return repos;
}
export async function getSocialAccounts(username) {
	const res = await fetch('https://api.github.com/users/' + username + '/social_accounts', {
		headers: { Authorization: `Bearer ${process.env.GH_TOKEN}` },
		next: { revalidate }
	});
	return res.json();
}

export const getPinnedRepos = async (username) => {
	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: { Authorization: `Bearer ${process.env.GH_TOKEN}` },
		body: JSON.stringify({ query: `{user(login: "${username}") {pinnedItems(first: 6, types: REPOSITORY) {nodes {... on Repository {name}}}}}` }),
	});
	const pinned = await res.json();
	const names = pinned.data.user.pinnedItems.nodes.map((node) => node.name);
	return names;
};

export const getUserOrganizations = async (username) => {
	const res = await fetch('https://api.github.com/graphql', {
		cache: 'no-store',
		method: 'POST',
		headers: { Authorization: `Bearer ${process.env.GH_TOKEN}` },
		body: JSON.stringify({
			query: `{user(login: "${username}") {organizations(first: 6) {nodes {name,websiteUrl,url,avatarUrl,description}}}}`
		}),
	});
	return res.json();
};

export const getVercelProjects = async () => {
	if (!process.env.VC_TOKEN) {
		console.log('No Vercel token found - no projects will be shown.');
		return { projects: [] };
	}
	const res = await fetch('https://api.vercel.com/v9/projects', {
		headers: { Authorization: `Bearer ${process.env.VC_TOKEN}` },
	});
	// eg. expired token.
	if (!res.ok) {
		console.error('Vercel API returned an error.', res.status, res.statusText);
		return { projects: [] };
	}
	return res.json();
};

/** Cache revalidated every 12 hours. */
export const getNextjsLatestRelease = async () => {
	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: { Authorization: `Bearer ${process.env.GH_TOKEN}` },
		body: JSON.stringify({
			query: `{
				repository(name: "next.js", owner: "vercel") {
					latestRelease {
						tagName
						updatedAt
					}
				}
			}`
		}),
	});
	if (!res.ok) {
		console.error('GitHub API returned an error.', res.status, res.statusText);
		return {};
	}
	const nextjsLatest = await res.json();

	const result = {
		tagName: nextjsLatest.data.repository.latestRelease.tagName.replace('v', ''),
		updatedAt: nextjsLatest.data.repository.latestRelease.updatedAt,
	}
	return result;
};

export const getRepositoryPackageJson = async (username, reponame) => {
	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: { Authorization: `Bearer ${process.env.GH_TOKEN}` },
		body: JSON.stringify({
			query: `{
				repository(name: "${reponame}", owner: "${username}") {
					object(expression: "HEAD:package.json") {
						... on Blob {
							text
						}
					}
				}
			}`
		}),
	});
	const response = await res.json();
	try {
		const packageJson = JSON.parse(response.data.repository.object.text);
		return packageJson;		
	} catch (error) {
		console.error('Error parsing package.json', error);
		return {};
	}
};
