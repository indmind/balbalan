// eslint-disable-next-line no-unused-vars
class ApiService {
  constructor() {
    this.API_ENDPOINT = 'https://api.football-data.org/v2/';
    // this.API_ENDPOINT = "http://192.168.100.3:3000/"
  }

  async fetch(path, opts = {}) {
    try {
      const response = await fetch(new URL(path, this.API_ENDPOINT), {
        method: 'GET',
        headers: {
          'X-Auth-Token': 'efa6791aba0e4c4da2623d9916946944',
          'Connection': 'keep-alive',
        },
        ...opts,
      });

      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();

        return {error};
      }
    } catch (error) {
      throw error;
    }
  }

  async getStandings(leagueId) {
    return await this.fetch(`competitions/${leagueId}/standings`);
  }

  async getTeam(teamId) {
    return await this.fetch(`teams/${teamId}`);
  }
}
