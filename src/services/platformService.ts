
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
    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
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
        streak: 0, // Not provided by this API directly
        rating: 0, // Not provided by this API directly
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
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    const data = await response.json();
    if (data.status === 'OK') {
      const user = data.result[0];
      return {
        platform: 'Codeforces',
        username,
        totalSolved: 0, // Codeforces API doesn't give total solved in user.info
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
    // Using a common unofficial API for CodeChef
    const response = await fetch(`https://codechef-api.vercel.app/${username}`);
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

export async function fetchAllPlatformStats(usernames: { leetcode?: string, codeforces?: string, codechef?: string }) {
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

  return results;
}
