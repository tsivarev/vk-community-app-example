var app = {
  API_VERSION: '5.69',
  API_SETTINGS_SCOPE_PHOTOS: 4,
  VIEWER_DEVICE_MOBILE: 1,
  PAGES: {
    INSTALL: document.getElementById('page-install'),
    START: document.getElementById('page-start'),
    PICK_PHOTO: document.getElementById('page-pick-photo'),
    ENTER_DESCRIPTION: document.getElementById('page-enter-text')
  },

  appId: 0,
  groupId: 0,

  show: function(page) {
    app.hideAll();
    page.style.display = 'block';

    switch (page) {

      case app.PAGES.START:
        var requestData = {
          'user_id': sessionStorage.getItem('viewer_id')
        };

        VK.api('account.getAppPermissions', requestData, function(data) {

          var btnGetAccessElem = document.getElementById('btn-get-access');

          if (data.response & app.API_SETTINGS_SCOPE_PHOTOS) {

            btnGetAccessElem.innerHTML = 'Доступ предоставлен. Продолжить';
            btnGetAccessElem.addEventListener('click', function(event) {
                event.preventDefault();
                app.show(app.PAGES.PICK_PHOTO);
            });
          } else {
            btnGetAccessElem.addEventListener('click', getAccess);
          }

          function getAccess(e) {
            e.preventDefault();

            VK.callMethod('showSettingsBox', app.API_SETTINGS_SCOPE_PHOTOS); // Доступ к фотографиям
            VK.addCallback('onSettingsChanged', onSuccess);

            function onSuccess(event) {
              VK.removeCallback('onSettingsChanged', onSuccess);
              app.show(app.PAGES.PICK_PHOTO);
            }
          }
        });
        break;

      case app.PAGES.PICK_PHOTO:
        document.getElementById('container-photos').innerHTML = '';

        var requestData = {
          'owner_id': sessionStorage.getItem('viewer_id'),
          'count': 5,
          'skip_hidden': 1
        };

        var listElem = document.createElement('ul');
        listElem.classList.add('list-photo');

        VK.api('photos.getAll', requestData, function(data) {

          data.response.items.forEach(function(photo) {
            var liElem = document.createElement('li');
            var imgElem = document.createElement('img');

            imgElem.src = photo.photo_130;
            imgElem.onclick = app.onPhotoPicked;
            imgElem.photo604 = photo.photo_604;
            imgElem.photoId = photo.id;

            liElem.appendChild(imgElem);
            listElem.appendChild(liElem);
          });

          document.getElementById('container-photos').appendChild(listElem);
        });
        break;

      case app.PAGES.ENTER_DESCRIPTION:
        document.getElementById('textarea-post-description').value = '';
        break;
    }
  },

  onPhotoPicked: function(event) {
    event.preventDefault();

    sessionStorage.setItem('photo604', event.target.photo604);
    sessionStorage.setItem('photo_id', event.target.photoId);

    app.show(app.PAGES.ENTER_DESCRIPTION);
  },

  hideAll: function() {
    for (var i in app.PAGES) {
      app.PAGES[i].style.display = 'none';
    }
  },

  getUrlParameter: function(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');

    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);

    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  },

  init: function() {
    app.appId = app.getUrlParameter('api_id');
    app.groupId = app.getUrlParameter('group_id');

    document.getElementById('btn-include-app')
            .href = 'https://vk.com/add_community_app?aid=' + app.appId;

    VK.init(null, null, app.API_VERSION);

    sessionStorage.setItem('viewer_id',
                          app.getUrlParameter('viewer_id'));

    if (app.groupId == 0) {
      app.show(app.PAGES.INSTALL);
    } else {
      app.show(app.PAGES.START);
    }

    document.getElementById('btn-back-to-photos')
            .addEventListener('click', function() {

      app.show(app.PAGES.PICK_PHOTO);
    });
    document.getElementById('btn-submit')
            .addEventListener('click', function (e) {

      e.preventDefault();

      if (app.getUrlParameter('viewer_device') == app.VIEWER_DEVICE_MOBILE) {

        VK.callMethod('shareBox',
                      'https://vk.com/app' + app.appId,
                      sessionStorage.getItem('photo604'),
                      document.getElementById('textarea-post-description').value);
      } else {
        var requestData = {
          'owner_id': sessionStorage.getItem('viewer_id'),
          'message': document.getElementById('textarea-post-description').value,
          'attachments': 'photo' + sessionStorage.getItem('viewer_id') +
                          '_' + sessionStorage.getItem('photo_id') + ',' +
                          'https://vk.com/app' + app.appId + '_-' + app.groupId
        };

        VK.api('wall.post', requestData);
      }
    });
  }
};

window.addEventListener('load', function() {
  app.init();
});
