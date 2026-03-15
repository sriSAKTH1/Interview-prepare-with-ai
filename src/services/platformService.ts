
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
    // Using a CORS proxy to avoid "Failed to fetch" errors in the browser
    const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://leetcode-stats-api.herokuapp.com/${username}`)}`);
    const data = await response.json();
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
    // Fetch user info for rating/rank
    const infoResponse = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://codeforces.com/api/user.info?handles=${username}`)}`);
    const infoData = await infoResponse.json();
    
    // Fetch user status for solved count
    const statusResponse = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://codeforces.com/api/user.status?handle=${username}`)}`);
    const statusData = await statusResponse.json();

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
    // Using a common unofficial API for CodeChef with CORS proxy
    const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://codechef-api.vercel.app/${username}`)}`);
    const data = await response.json();
    if (data.success) {
      return {
        platform: 'CodeChef',
        username,
        totalSolved: 0, // Some APIs don't provide this easily
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
    const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://api.github.com/users/${username}`)}`);
    const data = await response.json();
    if (data.login) {
      return {
        platform: 'GitHub',
        username,
        totalSolved: data.public_repos,
        difficulty: { easy: 0, medium: 0, hard: 0 },
        rank: `${data.followers} followers`,
        rating: data.public_gists,
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
  const results: PlatformStats[] = [];
  
  if (usernames.leetcode) {
    const stats = await fetchLeetCodeStats(usernames.leetcode);
    if (stats) results.push(stats);
  }
  
  if (usernames.codeforces) {
    const stats = await fetchCodeforcesStats(usernames.codeforces);
    if (stats) results.push(stats);
  }

  if (usernames.codechef) {
    const stats = await fetchCodeChefStats(usernames.codechef);
    if (stats) results.push(stats);
  }

  if (usernames.github) {
    const stats = await fetchGitHubStats(usernames.github);
    if (stats) results.push(stats);
  }

  if (usernames.hackerrank) {
    const stats = await fetchHackerRankStats(usernames.hackerrank);
    if (stats) results.push(stats);
  }

  return results;
}
