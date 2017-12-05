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

        if(page == app.pages.PICK_PHOTO){

            var requestData = {
                "owner_id": sessionStorage.getItem('viewer_id'),
                "count": 5,
                "skip_hidden": 1
            };

            try {
                var list = document.createElement('ul');

                VK.api("photos.getAll", requestData, function (data) {

                    for (var i = 0; i < data.response.items.length; i++) {
                        
                        var elem = data.response.items[i];

                        var liElem = document.createElement('li');
                            liElem.appendChild(document.createElement('img').src = elem.photo_75 );

                            list.appendChild(liElem);
                    }

                    document.getElementById('page3').appendChild(list);
                });
            } catch (e) {
                console.log(e.message);
            }

        }
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

    sessionStorage.setItem('viewer_id',
                            getQueryItemValue(queryString, 'viewer_id'));

    if (getQueryItemValue(queryString, 'group_id') == 0)
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

    function getQueryItemValue(str, item){
        item += '=';

        var pos = str.indexOf(item);

        if(pos == -1) return 0;

        var id = str.substr( pos + item.length);
            id = id.split('&')[0];

        return id;
    }

});
