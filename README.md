# ORGMAP

## Общее описание
Проект ORGMAP предоставляет удобное и эффективное решение для поиска нужных сотрудников и управления командами. С помощью нашего веб-приложения пользователи могут легко находить и взаимодействовать с коллегами, что значительно упрощает процесс работы над проектами.

## Структура страниц
- **Главная страница (index)**: информация о проекте, о нас и т.д.
- **Авторизация**: страницы для входа и регистрации пользователей.
- **Профиль**: отображение аватара, имени, ролей, департаментов, команд, контактной информации и уведомлений.
- **Графическое представление**: визуализация департаментов, команд, пользователей и их связей.

## Иерархия пользователей

               Алексей Смирнов
              /               \
             /                 \
            /     (департамент)  \
        x====================| SayHex LLC |====================x
        |                                                      |
        |          Руслан - - - - - - - - -  Игорь Кузнецов    |
        |             |                               |        |
        |             |                               |        |
        |             v                               |        |
        |           hnpse (команда)                   |        |
        |  +----------------------+                   |        |
        |  |                      |                   v        |
        |  |    Денис --- Вова    |        (команда) mrp team  |
        |  |    фронтенд  бэкенд  |            +------------+  |
        |  |      |               |            |            |  |
        |  |      |               | <--------> | Мария      |  |
        |  |      v               |            |            |  |
        |  |    Дима     DevOps   |            +------------+  |
        |  |  дизайнер  (вакансия)|                            |
        |  |                      |                            |
        |  +----------------------+                            |
        |                                                      |
        x======================================================x

## Фронтенд
- **Технологии**: html/css, cytoscape.js
- **Аутентификация**: JWT
- **Запросы**: fetch (POST/GET/UPDATE/PUT/DELETE), Long Polling

## Бэкенд
- **Технологии**: Node.js, возможно bun
- **Аутентификация**: JWT
- **Long Polling**: для уведомлений
- **База данных**: PostgreSQL

## DevOps
- **Домен**: orgmap.einsof.ru
- **Web-сервер**: nginx (open appsec)
- **SSL**: certbot
- **Инфраструктура**: Terraform, GitLab, Helm, Kubernetes, Docker, Docker-

## Логика работы
1. **Перемещение Димы в команду mrp**:
   - Руслан нажимает кнопку (фронтенд[Руслан] -> fetch).
   - Игорь получает уведомление (бэкэнд -> фронтенд[Игорь] long poll).
   - Игорь подтверждает (фронтенд[Игорь] нажимает кнопку -> бэкэнд).
   - Дима теперь в команде mrp (изменение иерархии).

2. **Перемещение Марии в команду hnpse**:
   - Руслан нажимает кнопку (фронтенд[Руслан] -> fetch).
   - Игорь получает уведомление (бэкэнд -> фронтенд[Игорь] long poll).
   - Игорь подтверждает (фронтенд[Игорь] нажимает кнопку -> бэкэнд).
   - Мария теперь в команде hnpse (изменение иерархии).

3. **Назначение Вовы тимлидом команды hnpse**:
   - Руслан нажимает кнопку (фронтенд[Руслан] -> fetch).
   - Вова получает уведомление (фронтенд[Вова] long poll).
   - Иерархия команды hnpse изменяется.

4. **Увольнение Димы**:
   - Игорь нажимает кнопку (фронтенд[Игорь] -> fetch).
   - Руслан получает уведомление (фронтенд[Руслан] long poll).
   - Руслан подтверждает (фронтенд[Руслан] -> fetch -> бэкэнд).
   - Дима уволен (изменение иерархии).

## Управление данными
- **Роли**:
  - **Project Manager+**: может делать всё (с одобрением).
  - **Project Manager**: может создавать и управлять командами, отправлять запросы другим Project Manager, создавать вакансии и увольнять сотрудников.
  - **Teamlead**: управляет своей командой, может запрашивать создание вакансий и увольнять сотрудников.
  - **Обычные пользователи**: могут просматривать информацию о членах своей команды, но не могут видеть информацию о членах других команд.

## Аутентификация
- **Регистрация и вход**:
  - Логин: имя пользователя
  - Пароль: хэш (argon2)

## Подключения
- **Сервер**: [HTTPS веб-страницы, бэкэнд проксированный]
- **База данных** --- Бэкэнд
- **Бэкэнд** --- [Аутентификация, Профиль, Команда, Департамент, Граф, Long Polling]

## Эндпоинты
- `/index`
- `/profile?id=123`
- `/graph?start=node-id`
- `/image/`
- `/api/`
- `/api/auth/signup` ? POST
- `/api/auth/login` POST -> `{"refresh": "booba", "access": "biiba"}`
- `/api/auth/logout` GET
- `/api/auth/refresh` GET
- `/api/profile`
- `/api/profile GET /?id=123`
- `/api/profile UPDATE` `{"phone": "88005553535"}`
- `/api/profile DELETE`
- `/team`
- `/team GET -> body: {...}`
- `/team GET /?id=123 -> body: {...}`
- `/team POST -> id`
- `/team UPDATE /?id=123 body: {...}`
- `/team DELETE /?id=123`
- `/team/teamlead GET -> body: {...}`

# Документация по развертыванию сервиса

## Описание

Данная документация описывает процесс развертывания сервиса, состоящего из фронтенда и бэкенда, с использованием Docker, Docker Compose, Nginx, Helm и SSL-сертификатов. Сервис включает в себя технологии html/css для фронтенда и Node.js для бэкенда, а также использует PostgreSQL в качестве базы данных.

## Структура проекта

- **frontend/**: Исходный код фронтенда на html/css.
- **backend/**: Исходный код бэкенда на Node.js.
- **docker-compose.yml**: Конфигурация для Docker Compose.
- **nginx.balance.conf**: Конфигурация Nginx для балансировки нагрузки.
- **ssl/**: Директория для SSL-сертификатов.
- **README.md**: Документация по проекту.
- **helm/**: Конфигурация для развертывания с использованием Helm.

## Шаги по развертыванию

### 1. Установка необходимых инструментов

Убедитесь, что у вас установлены следующие инструменты:

- Docker
- Docker Compose
- Certbot (для получения SSL-сертификатов)
- **ОПЦИОНАЛЬНО** Helm (для управления Kubernetes)
- **ОПЦИОНАЛЬНО** Terraform (для управления инфраструктурой)

### 2. Настройка SSL-сертификатов

Для обеспечения безопасного соединения с вашим доменом `domain`, получите SSL-сертификаты с помощью Certbot:


```bash
sudo certbot certonly --standalone -d domain
```

### 3. Запуск приложения
Перейдите в корневую директорию вашего проекта, где находится файл docker-compose.yml

Запустите команду:
```bash
docker-compose up 
```
Эта команда соберет образы и запустит все сервисы, указанные в `docker-compose.yml`.

### Проверка работы сервиса
После успешного запуска сервисов, вы сможете получить доступ к вашему приложению по адресу `https://mvp.example.ru`. Убедитесь, что все компоненты работают корректно:
- Фронтенд доступен по корневому URL.
- Бэкенд доступен по /api/.

### Развертывание с использованием Helm (опционально)
Если вы хотите развернуть приложение в `Kubernetes` с использованием `Helm`, создайте необходимые манифесты и используйте команду:
```bash
helm install your-release-name ./helm/orgmap
```