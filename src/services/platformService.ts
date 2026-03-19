
export interface PlatformStats {
  platform: string;
  username: string;
  totalSolved: number;
  difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  streak?: number;
  rating?: number;
  badges?: string[];
  rank?: string;
}

export async function fetchLeetCodeStats(username: string): Promise<PlatformStats | null> {
  try {
    console.log(`Fetching LeetCode stats for ${username}...`);
    // Using a CORS proxy to avoid "Failed to fetch" errors in the browser
    const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://leetcode-stats-api.herokuapp.com/${username}`)}`);
    const data = await response.json();
    console.log('LeetCode response:', data);
    if (data.status === 'success') {
      return {
        platform: 'LeetCode',
        username,
        totalSolved: data.totalSolved,
        difficulty: {
          easy: data.easySolved,
          medium: data.mediumSolved,
          hard: data.hardSolved
        },
        streak: 0,
        rating: 0,
        rank: data.ranking.toString(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    return null;
  }
}

export async function fetchCodeforcesStats(username: string): Promise<PlatformStats | null> {
  try {
    console.log(`Fetching Codeforces stats for ${username}...`);
    // Fetch user info for rating/rank
    const infoResponse = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://codeforces.com/api/user.info?handles=${username}`)}`);
    const infoData = await infoResponse.json();
    console.log('Codeforces info response:', infoData);
    
    // Fetch user status for solved count
    const statusResponse = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://codeforces.com/api/user.status?handle=${username}`)}`);
    const statusData = await statusResponse.json();
    console.log('Codeforces status response:', statusData);

    if (infoData.status === 'OK' && statusData.status === 'OK') {
      const user = infoData.result[0];
      const submissions = statusData.result;
      
      // Filter unique solved problems
      const solvedProblems = new Set();
      submissions.forEach((sub: any) => {
        if (sub.verdict === 'OK') {
          solvedProblems.add(`${sub.problem.contestId}-${sub.problem.index}`);
        }
      });

      return {
        platform: 'Codeforces',
        username,
        totalSolved: solvedProblems.size,
        difficulty: { easy: 0, medium: 0, hard: 0 },
        rating: user.rating || 0,
        rank: user.rank || 'unrated',
        badges: [user.maxRank]
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching Codeforces stats:', error);
    return null;
  }
}

export async function fetchCodeChefStats(username: string): Promise<PlatformStats | null> {
  try {
    console.log(`Fetching CodeChef stats for ${username}...`);
    // Using a common unofficial API for CodeChef with CORS proxy
    const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://codechef-api.vercel.app/${username}`)}`);
    const data = await response.json();
    console.log('CodeChef response:', data);
    if (data.success) {
      return {
        platform: 'CodeChef',
        username,
        totalSolved: data.problemsSolved || 0,
        difficulty: { easy: 0, medium: 0, hard: 0 },
        rating: parseInt(data.currentRating) || 0,
        rank: data.stars || '',
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching CodeChef stats:', error);
    return null;
  }
}

export async function fetchGitHubStats(username: string): Promise<PlatformStats | null> {
  try {
    console.log(`Fetching GitHub stats for ${username}...`);
    
    // GitHub API supports CORS, so we can try direct fetch first
    let data;
    try {
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (response.ok) {
        data = await response.json();
      } else if (response.status === 403 || response.status === 429) {
        console.warn('GitHub API rate limited or forbidden. Trying proxy...');
        // Try a different proxy if direct fails
        const proxyResponse = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.github.com/users/${username}`)}`);
        const proxyData = await proxyResponse.json();
        data = JSON.parse(proxyData.contents);
      } else {
        console.warn(`GitHub fetch failed with status ${response.status}`);
        return null;
      }
    } catch (fetchError) {
      console.warn('GitHub direct fetch error, trying proxy...', fetchError);
      try {
        const proxyResponse = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.github.com/users/${username}`)}`);
        const proxyData = await proxyResponse.json();
        data = JSON.parse(proxyData.contents);
      } catch (proxyError) {
        console.error('GitHub proxy fetch error:', proxyError);
        return null;
      }
    }

    console.log('GitHub response:', data);
    if (data && (data.login || data.id)) {
      return {
        platform: 'GitHub',
        username,
        totalSolved: data.public_repos || 0,
        difficulty: { easy: 0, medium: 0, hard: 0 },
        rank: `${data.followers || 0} followers`,
        rating: data.public_gists || 0,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return null;
  }
}

export async function fetchHackerRankStats(username: string): Promise<PlatformStats | null> {
  try {
    // HackerRank doesn't have a public API that works easily with CORS
    // We'll use a placeholder or a known unofficial proxy if available
    // For now, we'll return a mock-like structure if the username exists
    if (username) {
      return {
        platform: 'HackerRank',
        username,
        totalSolved: 0,
        difficulty: { easy: 0, medium: 0, hard: 0 },
        rank: 'Active',
        rating: 0
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching HackerRank stats:', error);
    return null;
  }
}

export async function fetchAllPlatformStats(usernames: { leetcode?: string, codeforces?: string, codechef?: string, github?: string, hackerrank?: string }) {
  const promises: Promise<PlatformStats | null>[] = [];
  
  if (usernames.leetcode) {
    promises.push(fetchLeetCodeStats(usernames.leetcode));
  }
  
  if (usernames.codeforces) {
    promises.push(fetchCodeforcesStats(usernames.codeforces));
  }

  if (usernames.codechef) {
    promises.push(fetchCodeChefStats(usernames.codechef));
  }

  if (usernames.github) {
    promises.push(fetchGitHubStats(usernames.github));
  }

  if (usernames.hackerrank) {
    promises.push(fetchHackerRankStats(usernames.hackerrank));
  }

  const results = await Promise.allSettled(promises);
  const stats: PlatformStats[] = [];
  
  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      stats.push(result.value);
    }
  });

  return stats;
}
