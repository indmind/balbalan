import template from './home.html';

import {setPage} from '../../utils/route';
import ApiService from '../../services/api';

export default {
  template,
  created: run,
};

function run() {
  const api = new ApiService();

  const appNavbar = document.querySelector('app-navbar');
  const teamInfoContainer = document.querySelector('.container.team-info');
  const standingsContainer = document.querySelector('.row.standings');
  const cardBanner = document.querySelector('#banner-card');

  updatePage();

  window.onhashchange = updatePage;

  appNavbar.onchange = (leagueId) => {
    loadStandings(leagueId);
  };

  function updatePage(event) {
    const hrefPaths = window.location.href.split('/');

    //  default page and value
    let page = 'league';
    let value = '2001';

    if (hrefPaths.length < 5) {
      setPage(`${page}/${value}`, true);
    } else {
      page = hrefPaths[hrefPaths.length - 2];
      value = hrefPaths[hrefPaths.length - 1];
    }

    switch (page) {
      case 'league':
        loadStandings(value);
        hideTeamInfo();
        break;
      case 'team':
        setTeamDetailData(value);
        showTeamDetail(true);
        break;
      default:
        M.toast({html: `Page ${page} not found`});
    }
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

      document.getElementById('league').innerText = competition.name;
      document.getElementById('area').innerText = competition.area.name;
      document.getElementById('subname').innerText = 'Ends';
      document.getElementById('subvalue').innerText = new Date(
          season.endDate,
      ).toDateString();

      standingsContainer.innerHTML = '';

      standings[0].table.forEach((team) => {
        const teamElement = document.createElement('team-item');

        teamElement.addEventListener('click',
            () => onTeamClick(team),
        );

        teamElement.team = team;

        standingsContainer.appendChild(teamElement);
      });
    } catch (error) {
      handleError(error);
    }
  }

  function onTeamClick(team) {
    const teamId = team.team.id;

    setPage(`team/${teamId}`);

    setTeamDetailData(teamId);
    showTeamDetail();

    document.getElementById('league').innerText = team.team.name;
  }

  async function setTeamDetailData(teamId) {
    try {
      const teamDetailElement = document.createElement('team-detail');

      teamInfoContainer.innerHTML = '';
      teamInfoContainer.appendChild(teamDetailElement);

      const team = await api.getTeam(teamId);

      if (team.error) {
        handleError(team.error);
      }

      document.getElementById('league').innerText = team.name;
      document.getElementById('area').innerText = team.area.name;
      document.getElementById('subname').innerText = 'Updated';
      document.getElementById('subvalue').innerText = new Date(
          team.lastUpdated,
      ).toDateString();

      teamDetailElement.team = team;
    } catch (error) {
      handleError(error);
    }
  }

  function showTeamDetail(wait = false) {
    const appNavbar = document.querySelector('app-navbar');

    setTimeout(() => {
      appNavbar.backAction = () => window.history.back();
    }, wait ? 1 : 0);

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
      console.log('with transition');
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
}
