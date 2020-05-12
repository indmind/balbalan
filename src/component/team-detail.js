class TeamDetail extends HTMLElement {
  constructor() {
    super();

    this.styles = /*css*/`
      /* some styling here */
    `
  }

  set team(value) {
    this._team = value;
    this.render();
  }

  connectedCallback() {
    this.render()

    M.Tabs.init(
      document.querySelector('.tabs')
    );
  }

  render() {
    if (!this._team) {
      return this.innerHTML = `<h3>Loading</h3>`
    }

    this.innerHTML = /*html*/`
      <style>
        ${this.styles}
      </style>
      <div class="row">
        <div class="col s4"> 
          <img 
            class="materialboxed" width="100%"
            src="${this._team.crestUrl}"
            alt="${this._team.shortName} Logo"
          >
        </div>
        <div class="col s8">
          <span>${this._team.shortName}/<b>${this._team.tla}</b></span><br/>
          <small>${this._team.address}</small><br/>
          <a href="${this._team.website}">${this._team.website.replace(/(^\w+:|^)\/\//, '') || '-'}</a><br/>
          <span>${this._team.venue || '-'}</span>
        </div>
        <div class="col s12">
          <h4>Squads</h4>
          <table>
            <thead>
              <tr>
                  <th>Shirt</th>
                  <th>Name</th>
                  <th>Pos</th>
                  <th>Nat</th>
              </tr>
            </thead>

            <tbody>
            ${this._team.squad.map((player) => /*html*/`
              <tr>
                <td>${player.shirtNumber || "-"}</td>
                <td>${player.name || "-"}</td>
                <td>${player.position || "-"}</td>
                <td>${player.nationality || "-"}</td>
              </tr>
            `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `
  }
}

customElements.define("team-detail", TeamDetail)
