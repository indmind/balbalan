class TeamItem extends HTMLElement {
  constructor() {
    super();

    this._team = {}

    this.styles = /*css*/`
      span.stat:not(.badge) {
        margin-right: 0.5em;
      }

      span.stat span {
        font-size: .8em;
        vertical-align: sub;
        margin-left: 0.2em;
      }

      .standings {
        max-width: 720px;
      }

      .team-item {
        display: grid;
        grid-template-columns: 1fr 8fr;
        padding: 1rem 1rem 1rem 0.8rem;
        border-radius: 20px;
        background-color: #fafafa;
        margin: .5rem .1em 0;
        box-shadow: none;
      }

      .team-item hr {
        border: 0.5px solid #4242421a;
      }

      .team-item img {
        width: 4rem;
        height: 4rem;
        margin: auto;
      }

      .team-item .team-item-content {
        padding-left: 1em;
      }
    `
  }

  set team(value) {
    this._team = value;
    this.render();
  }

  connectedCallback() {
    this.render()
  }

  render() {
    let stand_color = "grey darken-2"

    switch(this._team.position) {
      case 1: stand_color = "orange darken-1"; break;
      case 2: stand_color = "blue-grey lighten-1"; break;
      case 3: stand_color = "brown lighten-1"; break;
    }

    this.innerHTML = /*html*/`
      <style>
        ${this.styles}
      </style>
      <div class="col s12">
        <div class="team-item waves-effect">
          <img 
            src="${this._team.team.crestUrl}"
            alt="${this._team.team.name} Logo"
          >
          <div class="team-item-content">
            <span class="badge ${stand_color} white-text">${this._team.position}</span>
            <span>${this._team.team.name}d</span>
            <hr>
            <div>
              <span class="stat teal-text">
                ${this._team.won}<span>won</span>
              </span>
              <span class="stat orange-text">
                ${this._team.draw}<span>draw</span>
              </span>
              <span class="stat red-text">
                ${this._team.lost}<span>lost</span>
              </span>
              <span class="badge stat">
                ${this._team.points}<span>pts</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

customElements.define("team-item", TeamItem)
