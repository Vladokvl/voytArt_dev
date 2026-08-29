# 🚀 TemplateUIready — Готовий UI Набір та Шаблони

Ця папка є **повністю автономним набором** UI компонентів, шаблонів сторінок, лейаутів, утиліт та типів, скопійованих з проекту для повторного використання в будь-яких інших ваших проектах (React / Next.js / Vite).

---

## 📁 Структура папки

```text
TemplateUIready/
├── components/
│   ├── ui/                 # 40+ базових UI примітивів (Button, Input, Dialog, Table, Tabs, Select, Form тощо)
│   ├── shared/             # 50+ складних віджетів (DataTable, Charts, RichTextEditor, PhoneInput, ConfirmDialog тощо)
│   ├── template/           # Компоненти каркасу (SideNav, Header, MobileNav, Search, ThemeConfigurator тощо)
│   ├── layouts/            # Готові лейаути (PostLoginLayout, PreLoginLayout, AuthLayout)
│   ├── auth/               # Екрани автентифікації (SignIn, SignUp, ForgotPassword, ResetPassword, OtpVerification)
│   ├── admin/              # Каркас адмін-панелі (AdminPageShell)
│   └── view/               # Допоміжні візуальні компоненти (FileIcon тощо)
│
├── page-templates/         # Реальні готові сторінки та екрани
│   ├── admin/              # Dashboard, Users list, Moderation, Scoring, Settings, Notifications, Graph
│   └── auth/               # Сторінки авторизації та входу
│
├── @types/                 # Повний набір TypeScript типів (UI, навігація, форми, маршрути)
├── utils/                  # Утиліти (класи, форматування, хуки, адаптери)
├── constants/              # Константи (теми, навігація, ролі, країни)
├── configs/                # Конфігурації (теми, маршрути, навігація, графіки)
├── assets/                 # Стилі (CSS/SCSS), SVG іконки, карти
├── tailwind.config.ts      # Готова конфігурація Tailwind CSS
├── postcss.config.mjs      # Конфігурація PostCSS
├── package-dependencies.json # Список усіх потрібних npm пакетів
└── README.md               # Ця інструкція
```

---

## ⚡ Як перенести та використовувати в іншому проекті

### 1. Скопіюйте папку
Просто скопіюйте всю папку `TemplateUIready` або її вміст у папку `src/` вашого нового проекту:
- Наприклад, скопіюйте `components`, `utils`, `@types`, `constants`, `configs`, `assets` прямо в `src/` вашого проекту.

### 2. Встановіть необхідні залежності
Виконайте команду для встановлення ключових UI бібліотек:

```bash
npm install @floating-ui/react @headlessui/react @hookform/resolvers @tanstack/react-table @tiptap/react @tiptap/starter-kit apexcharts react-apexcharts classnames clsx dayjs framer-motion lodash rc-slider react-hook-form react-hot-toast react-icons react-modal react-number-format react-phone-input-2 react-select react-tooltip react-use simplebar-react tailwind-merge zod
```

*(Повний список версій дивіться у `package-dependencies.json`)*

### 3. Налаштування аліасу `@/` у `tsconfig.json`
Переконайтеся, що у вашому новому проекті у `tsconfig.json` налаштовано аліас на папку `src`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 4. Налаштування Tailwind CSS
Скопіюйте налаштування кольорів, плагінів та розширень із `TemplateUIready/tailwind.config.ts` у ваш `tailwind.config.js` / `tailwind.config.ts`.

---

## 🧩 Огляд основних компонентів

### 1. Базові UI компоненти (`components/ui/`)
- **Кнопки**: `Button`, `CloseButton`
- **Форми**: `Input`, `InputGroup`, `Checkbox`, `Radio`, `Select`, `DatePicker`, `TimeInput`, `Slider`, `Switcher`, `Segment`, `Upload`, `Form`, `UniversalForm`
- **Таблиці та списки**: `Table`, `Pagination`, `Tabs`, `Accordion`, `Menu`, `MenuItem`, `Timeline`, `Steps`
- **Модальні вікна та попапи**: `Dialog`, `Drawer`, `Dropdown`, `Tooltip`, `Notification`, `toast`
- **Візуальні елементи**: `Avatar`, `Badge`, `Card`, `Tag`, `Progress`, `Spinner`, `Skeleton`, `ScrollBar`

### 2. Складні віджети (`components/shared/`)
- **DataTable**: Повнофункціональна таблиця на базі TanStack Table з сортуванням, пагінацією та пошуком.
- **Chart**: Готові інтерактивні графіки на ApexCharts.
- **RichTextEditor**: WYSIWYG редактор тексту на базі TipTap.
- **PhoneInput / OtpInput / PasswordInput / AutoComplete**: Спеціалізовані поля вводу.
- **ConfirmDialog**: Модальне вікно підтвердження видалення або зміни стану.
- **GrowShrinkValue**: Індикатор зростання/падіння відсотків для аналітики.

### 3. Шаблони сторінок (`page-templates/`)
- **Admin Dashboard**: Готові картки метрик, графіки активності, списки останніх дій.
- **Users Management**: Таблиця користувачів, картки деталей, форми редагування.
- **Auth**: Екрани входу, реєстрації, відновлення паролю.
