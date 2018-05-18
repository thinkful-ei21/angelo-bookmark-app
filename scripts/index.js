$(document).ready(function() {

    Bookmarks.bindEventListeners();

    Api.getAllBookmarks((items) => {
        items.forEach((bookmark) => Store.addBookmark(bookmark));
        Bookmarks.render();
    })
});
