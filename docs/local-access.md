# Локальный доступ и секреты

Этот репозиторий обслуживает сайт `novikamps.com`.

## GitHub

- Удалённый репозиторий: `https://github.com/ebmbadm/nag-site.git`.
- Доступ выполняется через GitHub CLI под учётной записью `ebmbadm`; токен хранится в системном keyring Windows.
- Перед работой проверьте состояние без вывода токена:

  ```powershell
  gh auth status
  git remote -v
  ```

Не добавляйте токены, пароли, приватные ключи или cookie в Git, issues, commits и чат.

## Локальные переменные окружения

В репозитории находится только шаблон `.env.example`. Создайте локальный файл:

```powershell
Copy-Item .env.example .env
```

Заполните `.env` значениями из утверждённого хранилища секретов. Для текущего сайта ожидаются:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (необязательно)
- `TELEGRAM_BOT_TOKEN` (необязательно)
- `TELEGRAM_CHAT_ID` (необязательно)

`.env` исключён из Git правилом `.env*`; перед коммитом проверьте это явно:

```powershell
git check-ignore -v .env
git status --short
```

## Обычный цикл редактирования

```powershell
npm ci
npm run dev
# После изменений:
npm run lint
npm run build
git status --short
```

Не выполняйте `git add .` до проверки списка файлов. Добавляйте только нужные пути, например:

```powershell
git add app/ components/ content/ docs/
```

## Синхронизация общих задач

- Единственная общая ветка для обмена работой между компьютерами: `agent/novikamps-local-bootstrap-publish`.
- Перед началом общей задачи переключайтесь на неё и синхронизируйтесь с GitHub:

  ```powershell
  git switch agent/novikamps-local-bootstrap-publish
  git pull --ff-only origin agent/novikamps-local-bootstrap-publish
  ```

- Новые общие изменения коммитьте и отправляйте только в эту ветку. `main` не используйте для межкомпьютерной синхронизации, пока его история расходится с удалённой версией.
