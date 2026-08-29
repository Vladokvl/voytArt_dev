# UniversalForm Component

Універсальний компонент форми з підтримкою різних типів інпутів, валідації та кастомізації.

## Особливості

- ✅ Підтримка всіх типів інпутів (text, email, password, number, textarea, select, multiselect, checkbox, radio, date, file, switch)
- ✅ Валідація через Zod схеми
- ✅ Умовне відображення полів
- ✅ Різні layout'и (vertical, horizontal, grid)
- ✅ Кастомна стилізація
- ✅ Дефолтні значення
- ✅ Інтеграція з react-hook-form
- ✅ Підтримка disabled стану
- ✅ Responsive дизайн

## Встановлення

```bash
npm install @hookform/resolvers zod
```

## Базове використання

```tsx
import UniversalForm, { FormConfig } from '@/components/ui/UniversalForm/UniversalForm'

const config: FormConfig = {
  inputs: [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'example@email.com',
      required: true,
    },
    {
      name: 'password',
      type: 'password',
      label: 'Пароль',
      required: true,
      minLength: 8,
    },
  ],
  layout: 'vertical',
}

const MyForm = () => {
  const handleSubmit = (values: Record<string, any>) => {
    console.log('Form values:', values)
  }

  return <UniversalForm config={config} onSubmit={handleSubmit} submitText="Відправити" />
}
```

## Типи інпутів

### Text Inputs (text, email, password, tel, url)

```tsx
{
  name: 'firstName',
  type: 'text',
  label: 'Ім\'я',
  placeholder: 'Введіть ваше ім\'я',
  required: true,
  minLength: 2,
  maxLength: 50,
  pattern: '^[a-zA-Z]+$',
}
```

### Number Input

```tsx
{
  name: 'age',
  type: 'number',
  label: 'Вік',
  min: 18,
  max: 120,
  step: 1,
  prefix: '$',
  suffix: 'років',
}
```

### Textarea

```tsx
{
  name: 'bio',
  type: 'textarea',
  label: 'Про себе',
  rows: 4,
  maxLength: 500,
}
```

### Select

```tsx
{
  name: 'country',
  type: 'select',
  label: 'Країна',
  options: [
    { value: 'ua', label: 'Україна' },
    { value: 'us', label: 'США' },
  ],
  isSearchable: true,
  isClearable: true,
}
```

### Multiselect

```tsx
{
  name: 'interests',
  type: 'multiselect',
  label: 'Інтереси',
  options: [
    { value: 'sports', label: 'Спорт' },
    { value: 'music', label: 'Музика' },
  ],
  isSearchable: true,
  isClearable: true,
}
```

### Checkbox

#### Одиночний чекбокс

```tsx
{
  name: 'newsletter',
  type: 'checkbox',
  label: 'Підписатися на розсилку',
  defaultValue: false,
}
```

#### Група чекбоксів

```tsx
{
  name: 'permissions',
  type: 'checkbox',
  label: 'Дозволи',
  options: [
    { value: 'read', label: 'Читання' },
    { value: 'write', label: 'Запис' },
    { value: 'delete', label: 'Видалення' },
  ],
  defaultValue: ['read'],
}
```

### Radio

```tsx
{
  name: 'gender',
  type: 'radio',
  label: 'Стать',
  options: [
    { value: 'male', label: 'Чоловіча' },
    { value: 'female', label: 'Жіноча' },
    { value: 'other', label: 'Інша' },
  ],
  defaultValue: 'male',
}
```

### Date

```tsx
{
  name: 'birthDate',
  type: 'date',
  label: 'Дата народження',
  minDate: new Date('1900-01-01'),
  maxDate: new Date(),
}
```

### File

```tsx
{
  name: 'avatar',
  type: 'file',
  label: 'Фото профілю',
  accept: 'image/*',
  multiple: false,
  maxSize: 5 * 1024 * 1024, // 5MB
}
```

### Switch

```tsx
{
  name: 'notifications',
  type: 'switch',
  label: 'Увімкнути сповіщення',
  checkedValue: true,
  uncheckedValue: false,
  defaultValue: false,
}
```

## Умовне відображення

```tsx
{
  name: 'city',
  type: 'text',
  label: 'Місто',
  conditional: {
    field: 'country',
    value: 'ua',
    operator: 'equals', // equals, not_equals, contains, greater_than, less_than
  },
}
```

## Layout та стилізація

```tsx
const config: FormConfig = {
  inputs: [...],
  layout: 'grid', // vertical, horizontal, grid
  columns: 2, // для grid layout
  spacing: 'md', // sm, md, lg
  size: 'md', // sm, md, lg
  className: 'custom-form-class',
}
```

## Дефолтні значення

```tsx
<UniversalForm
  config={config}
  defaultValues={{
    email: 'user@example.com',
    age: 25,
  }}
  fieldDefaultValues={{
    newsletter: true,
    country: 'ua',
  }}
  onSubmit={handleSubmit}
/>
```

## Кастомна валідація

```tsx
{
  name: 'password',
  type: 'password',
  label: 'Пароль',
  required: true,
  customValidation: (value) => {
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return 'Пароль повинен містити великі, малі літери та цифри'
    }
    return undefined
  },
}
```

## Обробка подій

```tsx
const handleSubmit = async (values: Record<string, any>) => {
  try {
    // Відправка даних на сервер
    await api.submitForm(values)
    console.log('Form submitted successfully')
  } catch (error) {
    console.error('Form submission failed:', error)
  }
}

const handleCancel = () => {
  console.log('Form cancelled')
}
```

## Повний приклад

```tsx
import React from 'react'
import UniversalForm, { FormConfig } from '@/components/ui/UniversalForm/UniversalForm'

const userRegistrationConfig: FormConfig = {
  inputs: [
    {
      name: 'firstName',
      type: 'text',
      label: "Ім'я",
      placeholder: "Введіть ваше ім'я",
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Прізвище',
      placeholder: 'Введіть ваше прізвище',
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'example@email.com',
      required: true,
      helpText: 'Ми ніколи не поділимося вашим email з кимось іншим',
    },
    {
      name: 'password',
      type: 'password',
      label: 'Пароль',
      placeholder: 'Введіть пароль',
      required: true,
      minLength: 8,
      helpText: 'Мінімум 8 символів',
    },
    {
      name: 'country',
      type: 'select',
      label: 'Країна',
      placeholder: 'Оберіть країну',
      required: true,
      options: [
        { value: 'ua', label: 'Україна' },
        { value: 'us', label: 'США' },
        { value: 'gb', label: 'Великобританія' },
      ],
      isSearchable: true,
      isClearable: true,
    },
    {
      name: 'city',
      type: 'text',
      label: 'Місто',
      placeholder: 'Введіть ваше місто',
      conditional: {
        field: 'country',
        value: 'ua',
        operator: 'equals',
      },
    },
    {
      name: 'newsletter',
      type: 'checkbox',
      label: 'Підписатися на розсилку',
      defaultValue: false,
    },
    {
      name: 'notifications',
      type: 'switch',
      label: 'Увімкнути сповіщення',
      checkedValue: true,
      uncheckedValue: false,
      defaultValue: true,
    },
  ],
  layout: 'grid',
  columns: 2,
  spacing: 'md',
  size: 'md',
}

const UserRegistrationForm: React.FC = () => {
  const handleSubmit = async (values: Record<string, any>) => {
    try {
      console.log('Registration data:', values)
      // Тут буде логіка відправки даних
      alert('Форму успішно відправлено!')
    } catch (error) {
      console.error('Registration failed:', error)
      alert('Помилка при реєстрації')
    }
  }

  const handleCancel = () => {
    console.log('Registration cancelled')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Реєстрація користувача</h1>
      <UniversalForm
        config={userRegistrationConfig}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Зареєструватися"
        cancelText="Скасувати"
        loading={false}
      />
    </div>
  )
}

export default UserRegistrationForm
```

## Тестування

Для тестування компонента використовуйте:

```tsx
// Тестова сторінка: /test-form
import TestForm from '@/components/ui/UniversalForm/test-form'
import DebugForm from '@/components/ui/UniversalForm/debug-form'
```

## Відомі проблеми та рішення

1. **Checkbox/Radio не працюють**: Переконайтеся, що використовуєте `Controller` з react-hook-form
2. **Switch не змінює стан**: Перевірте `checkedValue` та `uncheckedValue` в конфігурації
3. **Валідація не працює**: Перевірте, чи правильно налаштовані Zod схеми
4. **Умовні поля не показуються**: Перевірте логіку умовного відображення

## CSS Класи

UniversalForm використовує власні CSS класи замість Tailwind CSS для кращої сумісності:

### Spacing класи:

- `universal-form-spacing-sm` - малий відступ (0.5rem)
- `universal-form-spacing-md` - середній відступ (1rem)
- `universal-form-spacing-lg` - великий відступ (1.5rem)

### Layout класи:

- `universal-form-vertical` - вертикальне розташування
- `universal-form-horizontal` - горизонтальне розташування
- `universal-form-grid` - сіткове розташування
- `universal-form-grid-1`, `universal-form-grid-2`, `universal-form-grid-3`, `universal-form-grid-4` - кількість колонок

### Інші класи:

- `universal-form-error` - стилі для помилок
- `universal-form-help` - стилі для допоміжного тексту
- `universal-form-disabled` - стилі для відключеного стану
- `universal-form-buttons` - стилі для кнопок

## Підтримувані браузери

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
