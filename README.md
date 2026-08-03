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

Доступные сценарии: `happy`, `invalid-login`, `session-expired`, `industries-error`,
`vacancy-error`, `slow`, `dashboard-empty`, `dashboard-error`, `dashboard-action-error` и
`dashboard-attention`.

## Dashboard

Мок-профиль демонстрации — «София Орлова». Виджет «Битва резюме» — это нарочно игровая
мок-симуляция: её результаты не являются реальным прогнозом.

Страница `/dashboard` показывает мок-данные об автооткликах, воронке поиска, подходящих
вакансиях, готовности и адаптациях резюме, задачах и последних событиях. Демо-действия меняют
данные до перезагрузки страницы; в режиме `real` запрос не выполняется, пока backend-контракт
dashboard не будет согласован.

На экранах от `1280 px` карточки можно перемещать за заголовок и менять по размеру. На меньшей
ширине используется стабильная адаптивная сетка. Кнопка «Настроить виджеты» позволяет скрывать
карточки, возвращать их, менять порядок и выбирать готовую ширину с клавиатуры.

Раскладка хранится отдельно для пользователя в `localStorage` под ключом
`sofi:dashboard-layout:v2:<userId>`. Раскладка v1 удаляется без миграции при первом запуске v2. Для сетки
используется `grid-layout-plus`, а графики построены
на tree-shakeable ECharts с SVG renderer и загружаются только при приближении к viewport.

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
