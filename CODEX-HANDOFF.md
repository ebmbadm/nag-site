# Codex handoff

## Последнее обновление

- Дата: 2026-08-03
- Компьютер: второй рабочий компьютер
- Репозиторий: `nag-site`
- Рабочая ветка: `main`

## Активная задача

Настроить общий безопасный способ передачи контекста Codex между двумя рабочими компьютерами.

## Сделано

- Локальная копия репозитория создана в `C:\Users\Дмитрий\Documents\nag-site`.
- Удалённая ветка `agent/novikamps-local-bootstrap-publish` доступна как `origin/agent/novikamps-local-bootstrap-publish`.
- Спецификация правила сохранена в `docs/superpowers/specs/2026-08-03-codex-cross-computer-handoff-design.md` на `main`.

## Следующий шаг

Работать в нужной обычной ветке проекта. В конце сессии обновить только этот файл, закоммитить его в `agent/codex-handoff` и отправить ветку в `origin`.

## Git-состояние для проверки

- Перед началом: `git status --short --branch`
- Получить handoff: `git fetch origin agent/codex-handoff`
- Прочитать файл: `git show origin/agent/codex-handoff:CODEX-HANDOFF.md`

## Ограничения

Не добавлять `.env`, секреты, ключи, токены, cookie, архивы, медиа, сборки или `node_modules`.
