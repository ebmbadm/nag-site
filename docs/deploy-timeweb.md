# Деплой на Timeweb (Docker) — сервер PoliteShark

> **Статус: РАЗВЁРНУТО (2026-06-30).** Сайт живёт на https://novikamps.com — контейнер
> `nag-site` на сервере PoliteShark (`147.45.108.78`), за общим `supabase-caddy`
> (Let's Encrypt, авто-TLS). Репозиторий на сервере: `/opt/nag-site`. Контейнер на
> `127.0.0.1:8090`, в сети `supabase_default` (caddy ходит на `nag-site:3000`).
> **На сервере есть второй проект `nightbc.ru` (Supabase+VPN) — не трогать.**
>
> **Обновление (обязательно сохранять `--env-file` И `--add-host`, иначе форма отвалится):**
> ```
> cd /opt/nag-site && git pull && docker build -t nag-site:latest . && docker rm -f nag-site && \
> docker run -d --name nag-site --restart unless-stopped -p 127.0.0.1:8090:3000 \
>   --env-file /opt/nag-site/.env \
>   --add-host fcqhwpfoiojhuedbezum.supabase.co:104.18.38.10 \
>   --add-host fcqhwpfoiojhuedbezum.supabase.co:172.64.149.246 \
>   --add-host api.telegram.org:149.154.167.220 \
>   nag-site:latest && docker network connect supabase_default nag-site
> ```
>
> **Telegram-уведомления:** в `.env` есть `TELEGRAM_BOT_TOKEN` (@naghubbot) + `TELEGRAM_CHAT_ID`.
> api.telegram.org тоже под FakeDNS + у Telegram в РФ заблокированы почти все DC-IP; рабочий —
> `149.154.167.220` (пин через `--add-host`). Проверено: getMe + sendMessage из контейнера = ok.
>
> **Env Supabase:** `/opt/nag-site/.env` (из Vercel, `vercel env pull`). Форма работает
> (Supabase REST auth = 200 из контейнера). **Сервер блокирует `*.supabase.co` через Xray
> FakeDNS** (фейк-IP) — обойдено пином реальных Cloudflare-IP через `--add-host`. Если IP
> Cloudflare сменятся и форма отвалится — перерезолвить домен с чистого DNS и обновить пины
> (или настроить xray FakeDNS исключить *.supabase.co — это правка VPN, на усмотрение владельца).
>
> **Безопасность:** сменить root-пароль и Timeweb-токен (светились в чате), убрать временный
> deploy-ключ из root `~/.ssh/authorized_keys`.

Образ собирается из `Dockerfile` (Next.js `output: "standalone"` → `node server.js`).
Локально проверено: standalone-сервер поднимается и отдаёт страницы, редиректы (301),
robots/sitemap/OG. Слушает `0.0.0.0:3000`.

## Runtime-переменные (НЕ нужны при сборке, нужны при запуске)

См. `.env.example`. Обязательные для формы обратной связи:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Опционально (уведомления о заявке): `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
Секреты в образ не пекутся (`.dockerignore` исключает `.env*`) — передаём через `--env-file`.

## Путь A — SSH на PoliteShark (VPS с Docker) — самый надёжный

```bash
ssh <user>@<politeshark-ip>
# на сервере:
git clone https://github.com/ebmbadm/nag-site.git && cd nag-site
# создать .env по .env.example, заполнить ключи Supabase
docker build -t nag-site .
docker run -d --name nag-site --restart unless-stopped \
  -p 127.0.0.1:3000:3000 --env-file .env nag-site
```

Reverse-proxy (nginx/Caddy/Timeweb) → `127.0.0.1:3000`, TLS для `novikamps.com`.
Пример nginx: `proxy_pass http://127.0.0.1:3000;` на 443 с сертификатом домена.

Обновление: `git pull && docker build -t nag-site . && docker rm -f nag-site && docker run -d ...`.

## Путь B — Timeweb Cloud CLI (`twc`)

```bash
pipx install twc-cli         # или: pip install --user twc-cli
twc config                   # вставить API-токен из панели Timeweb (Настройки → API)
twc account status           # проверить доступ
```
Дальше — через сервисы Timeweb (Apps из Git/реестра контейнеров или нужный сервер).
Точные команды зависят от типа PoliteShark (VPS vs Apps) — нужен токен/доступ.

## После выката (SEO-cutover)

Переключить DNS `novikamps.com` на сервер, затем — чеклист в `docs/seo-migration.md`
(sitemap в Яндекс.Вебмастер + Google SC, переобход, мониторинг 404). Редиректы Tilda→Next
оживут автоматически — они в `routes-manifest` собранного образа.

## Что нужно от владельца, чтобы выкат сделал агент

Одно из:
1. **API-токен Timeweb** (панель → Настройки → API) — поставлю `twc`, задеплою через API; либо
2. **SSH-доступ к PoliteShark** (host/user/ключ) — соберу и запущу контейнер на сервере по Пути A.

Локально в текущей песочнице `docker build` недоступен (демон не запущен) и `twc` не установлен.
