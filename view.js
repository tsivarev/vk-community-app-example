let view = {
    fillPhotoContainer(photoContainer, photos) {
        let photoListHtml = `<ul class="list-photo">`;

        photos.forEach(photo => {
            photoListHtml +=
                `<li>
                    <img src="${photo.photo_130}" onclick="app.onPhotoPicked(this)" photoUrl="${photo.photo_604}" photoId="${photo.id}">
                </li>`
        });
        photoListHtml += `</ul>`;
        photoContainer.innerHTML = photoListHtml;
    },

    resetElementValue(element) {
        element.value = ``;
    },

    initInstallButton(button, appId) {
        button.href = `https://vk.com/add_community_app?aid=` + appId;
    },

    renameButton(button, name) {
        button.innerHTML = name;
    },

    show(element) {
        element.classList.remove(`hidden`);
    },

    hide(element) {
        element.classList.add(`hidden`);
    }
};