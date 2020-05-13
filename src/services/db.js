// eslint-disable-next-line no-unused-vars
class DatabaseService {
  async init() {
    this.instance = await idb.open('balbalan', 1, (upgradeDb) => {
      upgradeDb.createObjectStore('team', {keyPath: 'id'});
    });
  }

  async upsertTeam(team) {
    const tx = this.instance.transaction('team', 'readwrite');
    const store = tx.objectStore('team');
    await store.put(team);
    return tx.complete;
  }

  deleteTeam(teamId) {
    const tx = this.instance.transaction('team', 'readwrite');
    const store = tx.objectStore('team');
    return store.delete(teamId);
  }

  getTeam(teamId) {
    const tx = this.instance.transaction('team', 'readonly');
    const store = tx.objectStore('team');
    return store.get(teamId);
  }

  getAllTeams() {
    const tx = this.instance.transaction('team', 'readonly');
    const store = tx.objectStore('team');
    return store.getAll();
  }
}
