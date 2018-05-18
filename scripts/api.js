const Api = (function() {
    //create the URL
    const BASE_URL = 'https://thinkful-list-api.herokuapp.com/angelo/bookmarks/'
    
    //get all items
    const getAllBookmarks = function(callback) {
        $.getJSON(BASE_URL, callback);
    };
    //create
    const storeBookmark = function(data, success, error) {
        const newBookmark = JSON.stringify(data);
        $.ajax({
            url: BASE_URL,
            method: 'POST',
            contentType: 'application/json',
            data: newBookmark,
            success: success,
            error: error
        });
    };

    //update
    const updateBookmark = function(id, newData, callback, ) {
        $.ajax({
            url: BASE_URL + id,
            method: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify(newData),
            success: callback,
            error: (error) => {
                console.log(error.responseText)
                Store.setError(error.responseText);
            }
        });
    };

    //delete
    const deleteBookmark = function(id, callback) {
        $.ajax({
            url: BASE_URL + id,
            method: 'DELETE',
            success: callback
        });
    };

    return {
        getAllBookmarks,
        storeBookmark,
        updateBookmark,
        deleteBookmark
    };
}());