var app = {
    pages: {
        INSTALL: document.getElementById('page1'),
        START: document.getElementById('page2'),
        PICK_PHOTO: document.getElementById('page3')/*,
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
    VK.init(null, null, '5.69');

    var queryString = window.location.href;

    if (getGroupId(queryString) == 0)
        app.show(app.pages.INSTALL);
    else
        app.show(app.pages.START);


    document.getElementById('btn-getAccess')
            .addEventListener('click', function(e){

        e.preventDefault();
        VK.callMethod("showSettingsBox", 4); // Доступ к фотографиям

        VK.addCallback('onSettingsChanged', onSuccess);

        function onSuccess(){
            VK.removeCallback('onSettingsChanged', onSuccess);
            app.show(app.pages.PICK_PHOTO);
        }
    });

    function getGroupId(str){
        var pos = str.indexOf('group_id=');

        if(pos == -1) return 0;

        var id = str.substr( pos + 9 );
            id = id.split('&')[0];

        return id;
    }

});
