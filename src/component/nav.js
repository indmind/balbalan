import {setPage} from '../utils/route';

class Navbar extends HTMLElement {
  constructor() {
    super();

    this.sidenavInstance = null;
    this._selectedLeague = '2001';
    this._changeEvent = null;

    this.styles = /* css*/`
      .sidenav {
        z-index: 1001; 
        border-radius: 0 20px 0 0;
      }

      .sidenav-overlay {
        opacity: 0 !important;
      }

      .sidenav-btn {
        float: left;
        position: relative;
        z-index: 1;
        height: 56px;
        margin: 0 18px;
      }

      .sidenav-title {
        font-size: 2rem;
        margin: 1rem 1rem 0;
      }

      .nav-menu {
        z-index: 999; 
      }

      @media only screen and (max-width: 600px) {
        .nav-menu {
          height: 80px;
          padding: 1em 0px;
          position: fixed;
        }
      }

      @media only screen and (min-width: 600px) {
        .nav-menu.teal {
          margin-top: 1rem;
          background-color: transparent !important;
        }

        .brand-logo, .sidenav-trigger i, .sidenav-btn i {
          color: #424242 !important;
        }
      }

      .nav-menu ul li a {
        color: #424242;
      }

    `;

    this.nav = /* html*/`
      <li class="hide-on-large-only">
        <div class="user-view">
          <div class="background"></div>
          <p class="sidenav-title grey-text text-darken-4"><b>League</b></p>
        </div>
      </li>
      
      <li><a class="waves-effect" data-value="2001">Champions League</a></li>
      <li><a class="waves-effect" data-value="2002">Bundesliga</a></li>
      <li><a class="waves-effect" data-value="2021">Premier League</a></li>
      <li><a class="waves-effect" data-value="2014">Primera Division</a></li>
    `;
  }

  connectedCallback() {
    this.render();

    this.sidenavInstance = M.Sidenav.init(
        document.querySelector('.sidenav'),
    );

    this.setupClickListeners();
  }

  setupClickListeners() {
    this.querySelectorAll('.sidenav a, .topnav a').forEach((element) => {
      element.addEventListener('click', ({target}) => {
        this.sidenavInstance.close();

        this._selectedLeague = target.dataset.value;

        setPage(`league/${this._selectedLeague}`, true);

        if (this._changeEvent) {
          this._changeEvent(this._selectedLeague);
        }
      });
    });
  }

  render() {
    this.innerHTML = /* html*/`
      <style>
        ${this.styles}
      </style>
      <nav class="nav-menu teal accent-4 p3 no-shadows" role="navigation">
        <div class="nav-wrapper container">
          
          ${this._backAction ?
            `
              <a href="javascript:void(0)" class="sidenav-btn"">
                <i class="material-icons teal-text">close</i>
              </a>
              ` :
            `
              <a href="javascript:void(0)"
                class="sidenav-trigger"
                data-target="nav-mobile">
                <i class="material-icons teal-text">menu</i>
              </a>
              `}

          <a href="#" class="brand-logo text-bold" id="logo-container">
            <b>Balbalan!</b>
          </a>

          <ul class="topnav right hide-on-med-and-down">${this.nav}</ul>

          <aside>
            <ul class="sidenav" id="nav-mobile">${this.nav}</ul>
          </aside>
        </div>
      </nav>
    `;
  }

  set backAction(action) {
    this._backAction = action;
    this.render();

    if (!action) {
      this.sidenavInstance = M.Sidenav.init(
          this.querySelector('.sidenav'),
      );

      this.setupClickListeners();
      return;
    }


    this.querySelector('.sidenav-btn').addEventListener('click', action);
  }

  set onchange(event) {
    this._changeEvent = event;
  }
}

customElements.define('app-navbar', Navbar);
