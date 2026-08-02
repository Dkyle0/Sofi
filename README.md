# Sofi frontend

Демонстрационный frontend Sofi на Vue 3, Vuetify 4.1 и Pinia. По умолчанию приложение полностью работает на моках и не требует backend.

## Требования

- Node.js `24.18.0`;
- npm `11.6.2`.

```sh
npm ci
npm run dev
```

## Demo-режим

`VITE_API_MODE=mock` — режим по умолчанию. MSW перехватывает все API-вызовы в браузере.

Учётная запись:

- логин: `demo@sofi.local`;
- пароль: `Demo123!`.

Для проверки ошибок можно добавить query-параметр, например:

```text
http://127.0.0.1:5173/auth?mockScenario=invalid-login
```

Доступные сценарии: `happy`, `invalid-login`, `session-expired`, `industries-error`, `vacancy-error`, `slow`.

## Real API

Реальный backend включается только явно: скопируйте `.env.example` в `.env.local` и укажите
`VITE_API_MODE=real`.

```sh
npm run dev
```

В этом режиме Vite включает proxy для существующих относительных API-путей. Для обычной демонстрации этот режим не нужен.

## Команды

```sh
npm run dev
npm run type-check
npm run lint
npm run lint:fix
npm run format:check
npm run format
npm run build
npm run check
```

Подробные правила сопровождения находятся в [CLAUDE.md](CLAUDE.md).
