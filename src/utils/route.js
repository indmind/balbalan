export function setPage(page, replace = false) {
  if (history.pushState) {
    if (replace) {
      window.history.replaceState(
          {urlPath: `/#/${page}`},
          '',
          `/#/${page}`,
      );
    }

    location.hash = `/#/${page}`;

    // window.history.replaceState({page: 3}, "title 3", "?page=3")
    // window.history.pushState(
    //     {urlPath: `/#/${page}`},
    //     '',
    //     `/#/${page}`,
    // );
  }
}
