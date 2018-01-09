let app = {
    API_VERSION: '5.69',
    API_SETTINGS_SCOPE_PHOTOS: 4,
    VIEWER_DEVICE_MOBILE: 'mobile',
    COUNT_PHOTOS_TO_SHOW: 5,

    pages: {
        install: document.getElementById('page-install'),
        start: document.getElementById('page-start'),
        pickPhoto: document.getElementById('page-pick-photo'),
        enterDescription: document.getElementById('page-enter-text')
    },
    elements: {
        btnGetAccess: document.getElementById('btn-get-access'),
        btnIncludeApp: document.getElementById('btn-include-app'),
        btnBackToPhotos: document.getElementById('btn-back-to-photos'),
        btnPostSubmit: document.getElementById('btn-submit'),
        containerPhotos: document.getElementById('container-photos'),
        fieldPostDescription: document.getElementById('textarea-post-description')
    },
    appId: 0,
    groupId: 0,

    show(page) {
        app.hideAll();
        view.show(page);

        switch (page) {
            case app.pages.start:
                let requestStartPageData = {
                    'user_id': sessionStorage.getItem('viewerId')
                };

                VK.api('account.getAppPermissions', requestStartPageData, data => {

                    if (data.response & app.API_SETTINGS_SCOPE_PHOTOS) {
                        view.renameButton(app.elements.btnGetAccess, 'Продолжить');
                        app.elements.btnGetAccess.addEventListener('click', event => {
                            event.preventDefault();
                            app.show(app.pages.pickPhoto);
                        });
                    } else {
                        app.elements.btnGetAccess.addEventListener('click', app.getAccessPhotoEventListener);
                    }
                    view.show(app.elements.btnGetAccess);
                });
                break;

            case app.pages.pickPhoto:
                let requestPickPhotoData = {
                    'owner_id': sessionStorage.getItem('viewerId'),
                    'count': app.COUNT_PHOTOS_TO_SHOW,
                    'skip_hidden': 1
                };

                VK.api('photos.getAll', requestPickPhotoData, data => {
                    view.fillPhotoContainer(app.elements.containerPhotos, data.response.items);
                });
                break;

            case app.pages.enterDescription:
                view.resetElementValue(app.elements.fieldPostDescription);
                break;
        }
    },

    hideAll() {
        for (let i in app.pages) {
            view.hide(app.pages[i]);
        }
    },

    getAccessPhotoEventListener(event) {
        event.preventDefault();
        VK.callMethod('showSettingsBox', app.API_SETTINGS_SCOPE_PHOTOS);
        VK.addCallback('onSettingsChanged', onSuccess);

        let onSuccess = () => {
            VK.removeCallback('onSettingsChanged', onSuccess);
            app.show(app.pages.pickPhoto);
        }
    },

    onPhotoPicked(item) {
        sessionStorage.setItem('photoUrl', item.getAttribute('photoUrl'));
        sessionStorage.setItem('photoId', item.getAttribute('photoId'));

        app.show(app.pages.enterDescription);
    },

    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');

        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        let results = regex.exec(location.search);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    init() {
        app.appId = app.getUrlParameter('api_id');
        app.groupId = app.getUrlParameter('group_id');
        view.initInstallButton(app.elements.btnIncludeApp, app.appId);

        VK.init(null, null, app.API_VERSION);

        sessionStorage.setItem('viewerId',
            app.getUrlParameter('viewer_id'));

        if (app.groupId == 0) {
            app.show(app.pages.install);
        } else {
            app.show(app.pages.start);
        }

        app.elements.btnBackToPhotos.addEventListener('click', event => {
            event.preventDefault();
            app.show(app.pages.pickPhoto);
        });

        app.elements.btnPostSubmit.addEventListener('click', event => {
            event.preventDefault();
            let appLink = 'https://vk.com/app' + app.appId + '_-' + app.groupId;
            let viewerDevice = app.getUrlParameter('viewer_device');

            if (viewerDevice && viewerDevice === app.VIEWER_DEVICE_MOBILE) {
                VK.callMethod('shareBox',
                    appLink,
                    sessionStorage.getItem('photoUrl'),
                    app.elements.fieldPostDescription.value);
            } else {
                let photoRawId = 'photo' + sessionStorage.getItem('viewerId') +
                    '_' + sessionStorage.getItem('photoId');

                let requestData = {
                    'owner_id': sessionStorage.getItem('viewerId'),
                    'message': app.elements.fieldPostDescription.value,
                    'attachments': photoRawId + ',' + appLink
                };
                VK.api('wall.post', requestData);
            }
        });
    }
};

window.addEventListener('load', () => {
    app.init();
});
