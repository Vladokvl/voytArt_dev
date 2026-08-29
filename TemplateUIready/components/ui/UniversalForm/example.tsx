'use client'

import React, { useState } from 'react'
import UniversalForm from './UniversalForm'
import type { FormConfig } from './types'

// Приклад конфігурації форми для реєстрації користувача
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
      name: 'confirmPassword',
      type: 'password',
      label: 'Підтвердження пароля',
      placeholder: 'Повторіть пароль',
      required: true,
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Телефон',
      placeholder: '+380 XX XXX XX XX',
      pattern: '^\\+380\\s?\\d{2}\\s?\\d{3}\\s?\\d{2}\\s?\\d{2}$',
    },
    {
      name: 'age',
      type: 'number',
      label: 'Вік',
      placeholder: 'Введіть ваш вік',
      min: 18,
      max: 120,
      suffix: 'років',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Про себе',
      placeholder: 'Розкажіть трохи про себе...',
      rows: 4,
      maxLength: 500,
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
        { value: 'de', label: 'Німеччина' },
        { value: 'fr', label: 'Франція' },
      ],
      isSearchable: true,
      isClearable: true,
    },
    {
      name: 'interests',
      type: 'multiselect',
      label: 'Інтереси',
      placeholder: 'Оберіть ваші інтереси',
      options: [
        { value: 'sports', label: 'Спорт' },
        { value: 'music', label: 'Музика' },
        { value: 'reading', label: 'Читання' },
        { value: 'travel', label: 'Подорожі' },
        { value: 'cooking', label: 'Кулінарія' },
        { value: 'gaming', label: 'Ігри' },
      ],
      isSearchable: true,
      isClearable: true,
      isMulti: true,
    },
    {
      name: 'newsletter',
      type: 'checkbox',
      label: 'Підписатися на розсилку',
      defaultValue: false,
    },
    {
      name: 'gender',
      type: 'radio',
      label: 'Стать',
      required: true,
      options: [
        { value: 'male', label: 'Чоловіча' },
        { value: 'female', label: 'Жіноча' },
        { value: 'other', label: 'Інша' },
      ],
    },
    {
      name: 'birthDate',
      type: 'date',
      label: 'Дата народження',
      maxDate: new Date(),
    },
    {
      name: 'avatar',
      type: 'file',
      label: 'Фото профілю',
      accept: 'image/*',
      maxSize: 5 * 1024 * 1024, // 5MB
      helpText: 'Максимальний розмір файлу: 5MB',
    },
    {
      name: 'notifications',
      type: 'switch',
      label: 'Увімкнути сповіщення',
      checkedValue: true,
      uncheckedValue: false,
      defaultValue: true,
    },
    // Умовне поле - показується тільки якщо обрана Україна
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
  ],
  layout: 'grid',
  columns: 3,
  spacing: 'md',
  size: 'md',
}

const UniversalFormExample: React.FC = () => {
  const [loading, setLoading] = useState(false)

  // Приклад дефолтних значень для полів
  const fieldDefaults = {
    firstName: 'Іван',
    lastName: 'Петренко',
    email: 'ivan@example.com',
    country: 'ua',
    newsletter: true,
    notifications: true,
  }

  const handleRegistrationSubmit = async (values: Record<string, any>) => {
    setLoading(true)

    // Симуляція API запиту
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Додаткова валідація
    if (values.password !== values.confirmPassword) {
      alert('Паролі не співпадають!')
      setLoading(false)
      return
    }

    console.log('Registration form submitted:', values)
    alert('Форму успішно відправлено!')
    setLoading(false)
  }

  const handleCancel = () => {
    console.log('Form cancelled')
    alert('Форму скасовано')
  }

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <UniversalForm
          config={userRegistrationConfig}
          fieldDefaultValues={fieldDefaults}
          onSubmit={handleRegistrationSubmit}
          onCancel={handleCancel}
          submitText="Зареєструватися"
          cancelText="Скасувати"
          loading={loading}
          showSubmitButton={true}
          showCancelButton={true}
        />
      </div>
    </div>
  )
}

export default UniversalFormExample
