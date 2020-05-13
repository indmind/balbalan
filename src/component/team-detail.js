class TeamDetail extends HTMLElement {
  constructor() {
    super();

    this.styles = /* css*/`
      .sort-name {
        margin-top: 0;
      }

      .detail-item {
        margin: 5px 0;
      }

      .detail-item .material-icons {
        font-size: 18px;
        color: #212121;
      }

      #squad-table {
        table-layout:fixed;
      }

      #squad-table thead tr th:nth-child(1){
        width: 40px;
      }
    `;

    this.loaderStyle = /* css*/`
      .loader,
      .loader:before,
      .loader:after {
        border-radius: 50%;
        width: 2.5em;
        height: 2.5em;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        -webkit-animation: load7 1.8s infinite ease-in-out;
        animation: load7 1.8s infinite ease-in-out;
      }
      .loader {
        color: #00bfa5;
        font-size: 5px;
        margin: 100px auto;
        position: relative;
        text-indent: -9999em;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-animation-delay: -0.16s;
        animation-delay: -0.16s;
      }
      .loader:before,
      .loader:after {
        content: '';
        position: absolute;
        top: 0;
      }
      .loader:before {
        left: -3.5em;
        -webkit-animation-delay: -0.32s;
        animation-delay: -0.32s;
      }
      .loader:after {
        left: 3.5em;
      }
      @-webkit-keyframes load7 {
        0%,
        80%,
        100% {
          box-shadow: 0 2.5em 0 -1.3em;
        }
        40% {
          box-shadow: 0 2.5em 0 0;
        }
      }
      @keyframes load7 {
        0%,
        80%,
        100% {
          box-shadow: 0 2.5em 0 -1.3em;
        }
        40% {
          box-shadow: 0 2.5em 0 0;
        }
      }
    `;
  }

  set team(value) {
    this._team = value;
    this.render();
  }

  connectedCallback() {
    this.render();

    M.Tabs.init(
        document.querySelector('.tabs'),
    );
  }

  render() {
    if (!this._team) {
      return this.innerHTML = `
        <style>
          ${this.loaderStyle}
        </style>
        <div class="loader">Loading...</div>
      `;
    }

    console.log(this._team);

    this.innerHTML = /* html*/`
      <style>
        ${this.styles}
      </style>
      <div class="row">
        <div class="col s4"> 
          <img 
            class="materialboxed" width="100%"
            src="${this._team.crestUrl.replace(/^http:\/\//i, 'https://')}"
            alt="${this._team.shortName} Logo"
            onerror="this.src = '/assets/images/icon.svg'"
          >
        </div>
        <div class="col s8">
            <h5 class="sort-name">
              ${this._team.shortName}/<b>${this._team.tla}</b>
            </h5>
            <div class="detail-item">
              <small>Founded</small>
              <span class="badge teal white-text">
                ${this._team.founded || '-'}
              </span>
            </div>
            <div class="detail-item">
              <small><i class="material-icons">public</i></small>
              <span class="badge">
                <a href="${this._team.website}">
                  ${this._team.website.replace(/(^\w+:|^)\/\//, '') || '-'}
                </a>
              </span>
            </div>
            <div class="detail-item">
              <small><i class="material-icons">color_lens</i></small>
              <span class="badge truncate">
                ${this._team.clubColors || '-'}
              </span>
            </div>
            <div class="detail-item">
              <small><i class="material-icons">event_seat</i></small>
              <span class="badge">${this._team.venue || '-'}</span>
            </div>
        </div>
        <br/>
        <div class="col 12">
          <h4>Squads</h4>
          <table id="squad-table">
            <thead>
              <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Pos</th>
                  <th>Nat</th>
              </tr>
            </thead>

            <tbody>
            ${this._team.squad.map((player) => /* html*/`
              <tr>
                <td>${player.shirtNumber || '-'}</td>
                <td>${player.name || '-'}</td>
                <td>${player.position || '-'}</td>
                <td>${player.nationality || '-'}</td>
              </tr>
            `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

customElements.define('team-detail', TeamDetail);
