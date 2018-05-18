const Store = (function(){
    //declaring states we want to have access to
    const bookmarks = [];
    const editing = false;
    const editingItem = {};
    const adding = false;
    const searchTerm = '';
    const errors = '';
    const rating = 1;

    //add to store
    const addBookmark = function(bookmark) {
        const expanded = Object.assign(bookmark, {expanded: false});
        this.bookmarks.push(expanded);
    };

    //find by id
    const findById = function(id) {
        return this.bookmarks.find(item => item.id === id);
    };

    //delete from store
    const findAndDelete = function(id) {
        this.bookmarks = this.bookmarks.filter(item => item.id !== id);
    };

    //update a bookmark
    const findAndUpdate = function(id, newData) {
        console.log(newData);
        const bookmark = this.findById(id);
        Object.assign(bookmark, newData);
    };

    const setExpanded = function(id) {
        const bookmark = this.findById(id);
        bookmark.expanded = !bookmark.expanded
    }

    //change the search term
    const setSearchTerm = function(term) {
        this.searchTerm = term;
    };

    const setEditing = function(boolean) {
        this.editing = boolean;
    };

    const toggleEditing = function() {
        this.editing = !this.editing;
    }

    const setEditItem = function(id) {
        this.editingItem = this.findById(id);
    }

    const toggleAdding = function() {
        this.adding = !this.adding;
    };

    const setError = function(e) {
        this.errors = JSON.parse(e);
    }

    const setRating = function(rating) {
        this.rating = rating;
    }

    return {
        bookmarks,
        editing,
        adding,
        searchTerm,
        editingItem,

        addBookmark,
        findById,
        findAndDelete,
        findAndUpdate,
        setSearchTerm,
        toggleAdding,
        toggleEditing,
        setEditing,
        setError,
        setRating,
        setExpanded,
        setEditItem
    }

}());