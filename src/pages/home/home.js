!(async () => {
  const DEFAULT_PAGE = 'league';
  const DEFAULT_VALUE = '2001';

  const api = new ApiService();
  const db = new DatabaseService();

  await db.init();

  const appNavbar = document.querySelector('app-navbar');
  const teamInfoContainer = document.querySelector('.container.team-info');
  const standingsContainer = document.querySelector('.row.standings');
  const cardBanner = document.querySelector('#banner-card');

  updatePage();
  window.onhashchange = updatePage;

  appNavbar.onchange = (leagueId) => {
    loadStandings(leagueId);
  };

  appNavbar.onstarredclick = (state) => {
    if (state) {
      window.setPage(`favorites`, true);
      loadFavorite();
    } else {
      window.setPage(`${DEFAULT_PAGE}/${DEFAULT_VALUE}`, true);
      loadStandings(DEFAULT_VALUE);
    }

    appNavbar.favoriteActive = state;
  };

  function updatePage(event) {
    const hrefPaths = window.location.href.split('/');

    //  default page and value
    let page = DEFAULT_PAGE;
    let value = DEFAULT_VALUE;

    if (hrefPaths.length < 5) {
      window.setPage(`${page}/${value}`, true);
    } else {
      page = hrefPaths[4];
      value = hrefPaths[5];
    }

    switch (page) {
      case 'league':
        loadStandings(value);

        if (event) {
          const lastUrlSegments = event.oldURL.split('/');

          if (lastUrlSegments[lastUrlSegments.length - 2] === 'team') {
            hideTeamInfo();
          }
        }
        break;
      case 'team':
        setTeamDetailData(value);
        showTeamDetail();
      case 'favorites':
        loadFavorite();
        if (event) {
          const lastUrlSegments = event.oldURL.split('/');

          if (lastUrlSegments[lastUrlSegments.length - 2] === 'team') {
            hideTeamInfo();
          }
        }
    }
  }

  function onBackFromTeam() {
    window.history.back();
  }

  function handleError(error) {
    if (error.message === 'Failed to fetch') {
      return M.toast({
        html: 'Can\'t connect to the internet or API request limit reached',
      });
    } else if (error.errorCode == 403) {
      return M.toast({html: '403 Cannot access the resource'});
    }

    return M.toast({html: error.message});
  }

  async function loadFavorite() {
    try {
      const teams = await db.getAllTeams();

      setBannerData({
        title: 'Favorite Teams',
        badge: null,
        subname: 'You have favored',
        subvalue: `${teams.length} team${teams.length > 1 ? 's' : ''}`,
      });

      standingsContainer.innerHTML = '';

      teams.forEach((team) => {
        const teamElement = document.createElement('team-item');

        const data = {team};

        teamElement.addEventListener('click',
            () => onTeamClick(data, true),
        );

        teamElement.team = data;

        standingsContainer.appendChild(teamElement);
      });

      appNavbar.favoriteActive = true;
    } catch (error) {
      handleError(error);
    }
  }

  async function loadStandings(leagueId) {
    try {
      const {
        competition,
        season,
        standings,
        error,
      } = await api.getStandings(leagueId);

      if (error) {
        handleError(error);
      }

      setBannerData({
        title: competition.name,
        badge: competition.area.name,
        subname: 'Ends',
        subvalue: new Date(
            season.endDate,
        ).toDateString(),
      });

      standingsContainer.innerHTML = '';

      standings[0].table.forEach((team) => {
        const teamElement = document.createElement('team-item');

        teamElement.addEventListener('click',
            () => onTeamClick(team),
        );

        teamElement.team = team;

        standingsContainer.appendChild(teamElement);
      });

      appNavbar.favoriteActive = false;
    } catch (error) {
      handleError(error);
    }
  }

  function onTeamClick(team, useSave = false) {
    const teamId = team.team.id;

    window.setPage(`team/${teamId}`);

    setTeamDetailData(teamId, useSave);
    showTeamDetail();
  }

  async function setTeamDetailData(teamId, useSave = false) {
    try {
      const teamDetailElement = document.createElement('team-detail');

      teamInfoContainer.innerHTML = '';
      teamInfoContainer.appendChild(teamDetailElement);

      let team;

      if (useSave) {
        team = await db.getTeam(teamId);
      } else {
        team = await api.getTeam(teamId);

        if (team.error) {
          handleError(team.error);
        }
      }

      setBannerData({
        title: team.name,
        badge: team.area.name,
        subname: 'Updated',
        subvalue: new Date(
            team.lastUpdated,
        ).toDateString(),
      });

      const savedTeam = await db.getTeam(team.id);

      if (savedTeam) {
        appNavbar.stared = true;
      } else {
        appNavbar.stared = false;
      }

      appNavbar.setStarVisible(true);

      appNavbar.ontogglestar = async (state) => {
        if (state) {
          await db.upsertTeam(team);
          M.toast({html: `${team.shortName} added to favorite`});
        } else {
          await db.deleteTeam(team.id);
          M.toast({html: `${team.shortName} removed from favorite`});
        }
      };

      teamDetailElement.team = team;
    } catch (error) {
      handleError(error);
    }
  }

  function showTeamDetail() {
    appNavbar.backAction = onBackFromTeam;

    if (window.scrollY < 160) {
      cardBanner.classList.add('pre-info-only');

      setTimeout(() => {
        cardBanner.classList.add('info-only');
      }, 1);
    } else {
      cardBanner.classList.add('pre-info-only');
      cardBanner.classList.add('info-only');
    }

    teamInfoContainer.classList.remove('hide');

    standingsContainer.classList.add('hide');
    standingsContainer.classList.add('transparent');

    setTimeout(() => teamInfoContainer.classList.remove('transparent'), 100);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
      });
    }, 100);
  }

  function hideTeamInfo() {
    appNavbar.backAction = null;

    let delay = 300;

    if (window.scrollY > 160) {
      cardBanner.classList.remove('pre-info-only');
      delay = 0;
    } else {
      cardBanner.classList.add('with-transition');
    }

    cardBanner.classList.remove('info-only');

    setTimeout(() => {
      cardBanner.classList.remove('pre-info-only');
      cardBanner.classList.remove('with-transition');

      standingsContainer.classList.remove('hide');
      teamInfoContainer.classList.add('transparent');

      setTimeout(() => {
        teamInfoContainer.classList.add('hide');
        standingsContainer.classList.remove('transparent');
      }, 100);
    }, delay);
  }

  function setBannerData(data) {
    if (data.badge) {
      document.getElementById('badge').classList.remove('hide');
    } else {
      document.getElementById('badge').classList.add('hide');
    }

    document.getElementById('title').innerText = data.title;
    document.getElementById('badge').innerText = data.badge;
    document.getElementById('subname').innerText = data.subname;
    document.getElementById('subvalue').innerText = data.subvalue;
  }
})();
