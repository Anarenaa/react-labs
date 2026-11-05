# ЛР-2. Компоненти, дерево компонентів і пропси

Стартовий проєкт лабораторної роботи № 2 курсу «Розробка вебзастосунків на
React»: сторінка «Команда проєкту». Інструкція:
https://denysmatsevych.github.io/web-development-2026/react/labs/lab-2/

У проєкті вже є налаштування ESLint і Prettier з ЛР-1, стилі сторінки
(`src/index.css`), дані команди (`src/data.js`) і аватари
(`public/avatars/`). Компоненти ви пишете самі, у теці `src/components/`.

## Команди

`npm install` виконуйте в корені репозиторію `react-labs`, решту — у теці
`lab-2/`:

- `npm run dev`: dev-сервер на http://localhost:5173
- `npm run lint`: ESLint
- `npm run format:check`: перевірка форматування Prettier
- `npm run build`: production-збірка в `dist/`

## Дерево рендерингу

Заповніть за вкладкою **Components ⚛** у React DevTools (§4.6).

```mermaid
graph TD;
    App --> Header;
    App --> Card1[Card];
    App --> Card2[Card];

    Card1 --> Profile1["Profile (key: 1)"];
    Card1 --> Profile2["Profile (key: 2)"];

    Card2 --> Profile3["Profile (key: 3)"];
    Card2 --> Profile4["Profile (key: 4)"];

    Profile1 --> Avatar1[Avatar];
    Profile2 --> Avatar2[Avatar];
    Profile3 --> Avatar3[Avatar];
    Profile4 --> Avatar4[Avatar];
```

```text
App
├── Header
├── Card (Тімлід)
│   └── Profile (key="1")
│       └── Avatar
└── Card (Учасники)
    ├── Profile (key="2")
    │   └── Avatar
    ├── Profile (key="3")
    │   └── Avatar
    └── Profile (key="4")
        └── Avatar
```

## Дерево залежностей модулів

Заповніть за рядками `import` у файлах `src/` (§4.6).

```mermaid
graph LR;
    main.jsx --> App.jsx;
    App.jsx --> Header.jsx;
    App.jsx --> Card.jsx;
    Card.jsx --> Profile.jsx;
    Profile.jsx --> Avatar.jsx;

    App.jsx --> data.js;
```

```text
main.jsx
├── index.css
└── App.jsx
    ├── Header.jsx
    ├── data.js
    └── Card.jsx
        └── Profile.jsx
            └── Avatar.jsx
```
