class Navbar extends HTMLElement {
  constructor() {
    super();

    this.sidenavInstance = null;
    this._selectedLeague = '2001';
    this._changeEvent = null;
    this._stared = false;
    this._favoriteActive = false;

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

        nav ul a:hover {
          background-color: transparent;
        }

        #stared-btn {
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 10px;
        }

        #stared-btn.active {
          background-color: white;
          border-radius: 50%;
        }

        #stared-btn i {
          line-height: normal;
          height: auto;
        }
      }

      @media only screen and (min-width: 600px) {
        .nav-menu.teal {
          margin-top: 1rem;
          background-color: transparent !important;
        }

        .brand-logo, .sidenav-trigger i, .sidenav-btn i, .star-icon {
          color: #424242 !important;
        }
      }

      #stared-btn {
        background-color: transparent;
        border: none;
      }

      .nav-menu ul li a {
        color: #424242;
      }

      .star-icon {
        font-size: 2.5rem !important;
      }

      .star-icon.stared {
        color: #ffca28 !important;
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

    this.setupStarTogglerListener();
  }

  setupClickListeners() {
    this.querySelectorAll('.sidenav a, .topnav a').forEach((element) => {
      element.addEventListener('click', ({target}) => {
        this.sidenavInstance.close();

        this._selectedLeague = target.dataset.value;

        window.setPage(`league/${this._selectedLeague}`, true);

        if (this._changeEvent) {
          this._changeEvent(this._selectedLeague);
        }
      });
    });

    this.querySelector('#stared-btn')
        .addEventListener('click',
            () => this._onstarredclick(!this._favoriteActive),
        );
  }

  setupStarTogglerListener() {
    this.querySelector('#star-btn').addEventListener('click', () => {
      this.toggleStar();
      this._ontogglestar(this._stared);
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

          <ul class="right">
            <a
              href="javascript:void(0)"
              class="${this._backAction ? '' : 'hide'}"
              id="star-btn">
              <i class="star-icon teal-text material-icons
                ${this._stared ? 'stared' : ''}">
                ${this._stared ? 'star' : 'star_border'}
              </i>
            </a>
            
            <button
              class="waves-effect ${this._backAction ? 'hide' : ''}" 
              id="stared-btn">
              <i class="teal-text material-icons">
                featured_play_list
              </i>
            </button>
          </ul>

          <ul class="topnav right hide-on-med-and-down 
                    ${this._backAction ? 'hide' : ''}">
              ${this.nav}
          </ul>

          <aside>
            <ul class="sidenav" id="nav-mobile">${this.nav}</ul>
          </aside>
        </div>
      </nav>
    `;

    this.setupClickListeners();
  }

  toggleStar() {
    this._stared = !this._stared;

    this.updateStar();
  }

  setStarVisible(state) {
    const starIcon = document.querySelector('.star-icon');

    if (state) {
      starIcon.classList.remove('hide');
    } else {
      starIcon.classList.add('hide');
    }
  }

  updateStar() {
    const starIcon = document.querySelector('.star-icon');

    if (this._stared) {
      starIcon.innerHTML = 'star';
      starIcon.classList.add('stared');
    } else {
      starIcon.innerHTML = 'star_border';
      starIcon.classList.remove('stared');
    }
  }

  set backAction(action) {
    this._backAction = action;
    this.render();

    if (!action) {
      this.sidenavInstance = M.Sidenav.init(
          this.querySelector('.sidenav'),
      );
      return;
    }

    this.setStarVisible(false);
    this.querySelector('.sidenav-btn').addEventListener('click', action);
  }

  set onchange(event) {
    this._changeEvent = event;
  }

  set onstarredclick(event) {
    this._onstarredclick = event;
  }

  set ontogglestar(event) {
    this._ontogglestar = event;
    this.setupStarTogglerListener();
  }

  set stared(value) {
    this._stared = value;
    this.updateStar();
  }

  get stared() {
    return this._stared;
  }

  set favoriteActive(value) {
    const staredButton = document.getElementById('stared-btn');

    this._favoriteActive = value;

    if (this._favoriteActive) {
      staredButton.classList.add('active');
    } else {
      staredButton.classList.remove('active');
    }
  }
}

customElements.define('app-navbar', Navbar);
