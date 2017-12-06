var app = {
  APP_ID: 6287587,
  API_VERSION: '5.69',
  API_SETTINGS_SCOPE_PHOTOS: 4,
  pages: {
    INSTALL: document.getElementById('page_install'),
    START: document.getElementById('page_start'),
    PICK_PHOTO: document.getElementById('page_pick_photo')
    /*,CONFIRM: 0*/
  },
  show: function(page) {
    app.hideAll();
    page.style.display = 'block';

    if (page == app.pages.PICK_PHOTO) {

      var requestData = {
        "owner_id": sessionStorage.getItem('viewer_id'),
        "count": 5,
        "skip_hidden": 1
      };

      var list = document.createElement('ul');
          list.classList.add('list-photo');

      VK.api("photos.getAll", requestData, function(data) {
        console.log(data);

        for(var elem in data.response.items){
          var liElem = document.createElement('li');
          var imgElem = document.createElement('img');
          imgElem.src = data.response.items[elem].photo_130;

          liElem.appendChild(imgElem);

          list.appendChild(liElem);
        }

        app.pages.PICK_PHOTO.appendChild(list);
      });

    }
  },
  hideAll: function() {
    for (var i in app.pages)
      app.pages[i].style.display = 'none';
  },
  init: function(){
    document.getElementById('btn-include-app')
            .href = 'https://vk.com/add_community_app?aid=' + app.APP_ID;

    VK.init(null, null, app.API_VERSION);

    var queryString = window.location.href;

    sessionStorage.setItem('viewer_id',
                          getQueryItemValue(queryString, 'viewer_id'));

    if (getQueryItemValue(queryString, 'group_id') == 0) {
      app.show(app.pages.INSTALL);
    } else {
      app.show(app.pages.START);
    }


    document.getElementById('btn-get-access')
            .addEventListener('click', function(e) {

      e.preventDefault();
      VK.callMethod('showSettingsBox', app.API_SETTINGS_SCOPE_PHOTOS); // Доступ к фотографиям

      VK.addCallback('onSettingsChanged', onSuccess);

      function onSuccess() {
        VK.removeCallback('onSettingsChanged', onSuccess);
        app.show(app.pages.PICK_PHOTO);
      }
    });

    function getQueryItemValue(str, item) {
      item += '=';

      var position = str.indexOf(item);

      if (position == -1) return 0;

      var id = str.substr(position + item.length);
      id = id.split('&')[0];

      return id;
    }
  }
};

window.addEventListener('load', function() {
  app.init();
});
