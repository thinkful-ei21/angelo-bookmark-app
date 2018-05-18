const Bookmarks = (function(){

    function render() {
        console.log('rerender')
        if (Store.errors) {
            generateErrorHtml(Store.errors.message);
        }
        let bookmarks = Store.bookmarks;

        if (Store.searchTerm) {
            bookmarks = Store.bookmarks.filter(item => item.title.includes(Store.searchTerm));
        }

        if (Store.rating > 1) {
            bookmarks = Store.bookmarks.filter(item => item.rating >= Store.rating);
        }

        handleEditForm();

        const bookmarksString = generateBookmarksString(bookmarks);
        
        $('.js-bookmark-list').html(bookmarksString);
    };

    function handleError(error) {
        Store.setError(error);
        generateErrorHtml(error);
    };

    function handleAddingBookmark(bookmark) {
        $('#add-bookmark-form').submit(function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            const data = {};
            formData.forEach(function(value, key) {
                data[key] = value;
            });
            Api.storeBookmark(data, (data) => {
                Store.addBookmark(data);
                $(this).trigger("reset");
                render();
            },
            (err) => {
                handleError(err.responseText);
                $(this).trigger("reset");
                render();
            }    
        );
        });
    };

    function generateBookmarkHtml(bookmark) {
        const visibility = bookmark.expanded ? 'visible' : 'is-invisible'; 
        return `
            <li class="js-bookmark-element" data-item-id="${bookmark.id}"><p class="bookmark-title">${bookmark.title} - ${bookmark.rating} stars</p> <button id="toggle-desc" aria-label="More info">ℹ</button>
            <p class="${visibility}">${bookmark.desc} - Visit at <a href="${bookmark.url}">${bookmark.title}</a></p>
                <div class="bookmark-controls">
                    <button class="js-bookmark-delete">delete</button>
                    <button class="js-bookmark-edit">edit</button>
                </div>
            </li>
            
        `
    };

    function handleRatingSort() {
        $('#sort-by').change(function(event) {
            const rating = $(this).val();
            Store.setRating(rating);
            render();
        })
    }

    function generateBookmarksString(bookmarks) {
        const bookmark = bookmarks.map((item) => generateBookmarkHtml(item));
        return bookmark.join('');
    };

    function generateErrorHtml(error) {
        $('#error-handling').html(`
            <span class="error">${Store.errors.message}</span>
        `);
    }

    function getItemIdFromElement(item) {
        return $(item)
            .closest('.js-bookmark-element')
            .data('item-id')
    };

    function handleDeleteBookmark() {
        $('.js-bookmark-list').on('click', '.js-bookmark-delete', event => {
            const id = getItemIdFromElement(event.currentTarget);
            Api.deleteBookmark(id, () => {
                Store.findAndDelete(id);
                render();
            });
        })
    };

    function handleBookmarkSearch() {
        $('.js-bookmark-search').on('keyup', function(event) {
            const search = $(event.currentTarget).val();
            Store.setSearchTerm(search);
            render();
            
        })
    };

    function handleEditClick() {
        $('.js-bookmark-list').on('click', '.js-bookmark-edit', event => {
            const id = getItemIdFromElement(event.currentTarget);
            Store.setEditing(true);
            Store.setEditItem(id);
            render();
        });
    };
    
    function handleEditForm() {
        $('#edit-bookmark').html(generateEditFormHtml(Store.editingItem));
    }

    // if true return something, if not return other

    function handleCloseEditForm() {
        $('aside#edit-bookmark').on('click', '#edit-form-close', function() {
            console.log('clicked');
            Store.toggleEditing();
            render();
        });
        
    };

    function generateEditFormHtml(data) {
        return !Store.editing ? '' :
            `
            <form id="js-edit-form" data-item-id="${data.id}">
                <legend>Editing ${data.title}</legend>
                <p><label for="edit-title">Edit title</label><input type="text" id="edit-title" name="title" value="${data.title}" required></p>
                <p><label for="edit-url">Edit url</label><input type="text" id="edit-url" name="url" value="${data.url}" required></p>
                <p><label for="edit-desc">Edit description</label><textarea type="text" id="edit-desc" name="desc" required>${data.desc}</textarea></p>
                <p>
                <label for="edit-rating">Choose Rating</label>
                <select name="rating" id="edit-rating" value="${data.rating}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select></p>
                <p>
                <button id="js-edit-submit" type="submit">Make changes</button></p>
            </form>
            <button id="edit-form-close">Close</button>
        `;
    }

    function handleEditSubmit() {
        $('#js-edit-form').submit(function(event) {
            event.preventDefault();
            const id = $(event.currentTarget).data('item-id');
            const formData = new FormData(this);
            const newData = {};
            formData.forEach(function(value, key) {
                newData[key] = value;
            });
            Api.updateBookmark(id, newData, () => {
                Store.findAndUpdate(id, newData);
                // $('#js-edit-form').removeClass('visible').addClass('is-invisible');
                render();
            });
            render();
        });
    };

    function handleToggleDescription() {
        $('.js-bookmark-list').on('click', '#toggle-desc', function(event) {
            const id = getItemIdFromElement(event.currentTarget);
            Store.setExpanded(id);
            render();
        });
    };

    //handleExpandedChange
        //calls store method, find Id, then change, rerender

    //bind all these event listeners
    function bindEventListeners() {
        handleAddingBookmark();
        handleDeleteBookmark();
        handleBookmarkSearch();
        handleRatingSort();
        handleEditClick();
        handleEditSubmit();
        handleToggleDescription();
        handleCloseEditForm();
    };

    return {
        render: render,
        bindEventListeners: bindEventListeners
    }
}() );