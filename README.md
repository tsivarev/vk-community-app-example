# Пример приложения сообщества ВКонтакте

Подробнее про приложения сообщества можно узнать из [официальной документации](https://vk.com/dev/community_apps).

## "Моя стена"

Приложение позволяет опубликовать на стену пользователя [сниппет](https://vk.com/page-19542789_50818664) с одной из последних загруженных фотографий. Сниппет будет содержать ссылку на приложениие сообщества, из которого был сделан.

### Установка

Если вы являетесь администратором сообщества и хотите установить данное приложение к себе в сообщество, перейдите по [ссылке](https://vk.com/add_community_app?aid=6284574).

Разработчики могут скачать приложение, посмотреть код и работу основных функций [Javascript SDK](https://vk.com/dev/Javascript_SDK).
А также модифицировать и подключить аналогичное приложение.

#### Скачайте приложение

```
git clone https://github.com/tsivarev/vk-community-app-example.git
```
Или zip архив https://github.com/tsivarev/vk-community-app-example/archive/master.zip

Загрузите приложение на свой хостинг. Данное приложение использует только клиентскую часть, поэтому также можно использовать github pages.

#### Регистрация приложения ВКонтакте

Чтобы зарегистрировать приложение следует прочитать соответствую [документацию](https://vk.com/dev/community_apps_docs?f=1.%20%D0%A0%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F).

#### Настройка приложения

Настройка приложения интуитивно понятна и не требует дополнительных комментариев.

Приложение использует метод API [wall.post](https://vk.com/dev/wall.post), у приложений сообщества есть одна особенность описанная [здесь](https://vk.com/dev/community_apps_docs?f=2.6.%20%D0%9F%D1%83%D0%B1%D0%BB%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D0%B8%20%D0%BD%D0%B0%20%D1%81%D1%82%D0%B5%D0%BD%D0%B5). В связи с этим нам необходимо различать мобильную и десктопную версию. Для этого в настройках приложения в адресе мобильной версии приложения мы явно указываем параметр **viewer_device=mobile**, например:
```
https://mydomain.com/vk-community-app/?viewer_device=mobile
```

### Скриншоты

<img src="https://github.com/tsivarev/vk-community-app-example/blob/master/screenshots/install.png" width="350px">
<img src="https://github.com/tsivarev/vk-community-app-example/blob/master/screenshots/step1.png" width="350px">
<img src="https://github.com/tsivarev/vk-community-app-example/blob/master/screenshots/step2.png" width="350px">
<img src="https://github.com/tsivarev/vk-community-app-example/blob/master/screenshots/step3.png" width="350px">
<img src="https://github.com/tsivarev/vk-community-app-example/blob/master/screenshots/final.png" width="350px">
