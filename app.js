var app = {
  APP_ID: 6287587,
  API_VERSION: '5.69',
  API_SETTINGS_SCOPE_PHOTOS: 4,
  PAGES: {
    INSTALL: document.getElementById('page-install'),
    START: document.getElementById('page-start'),
    PICK_PHOTO: document.getElementById('page-pick-photo'),
    ENTER_DESCRIPTION: document.getElementById('page-enter-text')
  },

  show: function(page) {
    app.hideAll();
    page.style.display = 'block';

    if (page == app.PAGES.PICK_PHOTO) {

      var requestData = {
        'owner_id': sessionStorage.getItem('viewer_id'),
        'count': 5,
        'skip_hidden': 1
      };

      var list = document.createElement('ul');
      list.classList.add('list-photo');

      VK.api('photos.getAll', requestData, function(data) {
        console.log(data);

        data.response.items.forEach(function(elem) {
          var liElem = document.createElement('li');
          var imgElem = document.createElement('img');

          imgElem.src = elem.photo_130;
          imgElem.photo_604 = elem.photo_604;
          imgElem.photoid = elem.id;
          imgElem.onclick = app.onPhotoPicked;

          liElem.appendChild(imgElem);

          list.appendChild(liElem);
        });

        app.PAGES.PICK_PHOTO.appendChild(list);

      });

    }
  },

  onPhotoPicked: function(event) {
    event.preventDefault();

    app.show(app.PAGES.ENTER_DESCRIPTION);

    document.getElementById('btn-submit')
            .addEventListener('click', function(e) {

        e.preventDefault();

        if (app.getQueryItemValue(location.href, 'viewer_device') == 1) {

          var requestData = {
            'owner_id': sessionStorage.getItem('viewer_id'),
            'message': document.getElementById('textarea-post-description').value,
            'attachments': 'photo' + sessionStorage.getItem('viewer_id') +
                            '_' + event.target.photoid + ',' + 'https://vk.com/app' + app.APP_ID
          };

          VK.api('wall.post', requestData);

        } else {

          VK.callMethod('shareBox',
                        'https://vk.com/app' + app.APP_ID,
                        event.target.photo_604,
                        document.getElementById('textarea-post-description').value);
        }

        var linkTryAgain = document.createElement('a');
        linkTryAgain.href = '#';
        linkTryAgain.innerHTML = 'Попробовать еще';

        linkTryAgain.addEventListener('click', function() {
          location.reload();
        });

        app.PAGES.ENTER_DESCRIPTION.appendChild(linkTryAgain);

      });
  },

  hideAll: function() {
    for (var i in app.PAGES) {
      app.PAGES[i].style.display = 'none';
    }
  },

  getQueryItemValue: function(str, item) {
    item += '=';

    var position = str.indexOf(item);
    if (position == -1) return 0;

    var id = str.substr(position + item.length);
    id = id.split('&')[0];

    return id;
  },

  init: function() {
    document.getElementById('btn-include-app')
            .href = 'https://vk.com/add_community_app?aid=' + app.APP_ID;

    VK.init(null, null, app.API_VERSION);

    var queryString = window.location.href;

    sessionStorage.setItem('viewer_id',
                          app.getQueryItemValue(queryString, 'viewer_id'));


    if (app.getQueryItemValue(queryString, 'group_id') == 0) {
      app.show(app.PAGES.INSTALL);
    } else {
      app.show(app.PAGES.START);
    }


    document.getElementById('btn-get-access')
            .addEventListener('click', function(e) {

      e.preventDefault();

      VK.callMethod('showSettingsBox', app.API_SETTINGS_SCOPE_PHOTOS); // Доступ к фотографиям
      VK.addCallback('onSettingsChanged', onSuccess);

      function onSuccess() {
        VK.removeCallback('onSettingsChanged', onSuccess);
        app.show(app.PAGES.PICK_PHOTO);
      }
    });
  }
};

window.addEventListener('load', function() {
  app.init();
});
