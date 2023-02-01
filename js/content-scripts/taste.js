let overseerrContainer, allocineId, tmdbId, mediaType, mediaInfo;

containerOptions.anchorElement = 'div.styles_container__2u8xM';
containerOptions.textClass = 'text-sm';
containerOptions.containerClass = 'oa-mt-0 oa-mb-6 oa-py-2';
containerOptions.plexButtonClass = 'oa-bg-gray-800';
containerOptions.badgeBackground = '#032541';

mediaType = document.location.pathname.startsWith('/movies') ? 'movie' : 'tv';

let title = $('h1:first').text();
if (title) {
    initializeContainer();
    insertSpinner();

    pullStoredData(function () {
        if (!userId) {
            removeSpinner();
            insertNotLoggedInButton();
            return;
        }

        chrome.runtime.sendMessage({contentScriptQuery: 'search', title: title}, json => {
            json.results = json.results.filter((result) => result.mediaType === mediaType);
            if (json.results.length === 0) {
                removeSpinner();
                insertStatusButton('Media not found', 0);
                return;
            }
            const firstResult = json.results[0];
            chrome.runtime.sendMessage({contentScriptQuery: 'queryMedia', tmdbId: firstResult.id, mediaType: mediaType}, json => {
                mediaInfo = json;
                tmdbId = json.id;
                console.log(`TMDB id: ${tmdbId}`);
                removeSpinner();
                fillContainer(json.mediaInfo);
            });
        });
    });
}

