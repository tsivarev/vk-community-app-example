var app = {
    pages: {
        INSTALL: document.getElementById('page1'),
        START: document.getElementById('page2')/*,
        GET_ACCESS: 0,
        PICK_PHOTO: 0,
        CONFIRM: 0*/
    },
    show: function(page){
        app.hideAll();
        page.style.display = 'block';
    },
    hideAll: function(){
        for (var i = 0; i < app.pages.length; i++) {
            app.pages[i].style.display = 'none';
        }
    }
};

window.addEventListener('load', function(){
    VK.init( null, null, '5.69');

    var queryString = window.location.href;

    if (getGroupId(queryString) == 0)
        app.show(app.pages.INSTALL);
    else
        app.show(app.pages.START);


    function getGroupId(str){
        var pos = str.indexOf('group_id=');

        if(pos == -1) return 0;

        var id = str.substr( pos + 9 );
            id = id.split('&')[0];

        return id;
    }

});
