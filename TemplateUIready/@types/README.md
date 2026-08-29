# Types Documentation

Ця папка містить централізовані TypeScript типи для всього проекту.

## Структура файлів

### `auth.ts` - Типи автентифікації

- `SignInCredential` - дані для входу
- `SignInResponse` - відповідь при вході
- `SignUpCredential` - дані для реєстрації
- `User` - тип користувача
- `Token` - тип токена
- `ProfileUpdateData` - дані для оновлення профілю

### `common.tsx` - Загальні типи

- `CommonProps` - базові пропси для компонентів
- `TableQueries` - параметри для таблиць
- `PageProps` - пропси для сторінок Next.js

### `navigation.ts` - Типи навігації

- `NavigationTree` - структура навігації
- `HorizontalMenuMeta` - метадані горизонтального меню

### `routes.tsx` - Типи маршрутів

- `Route` - конфігурація маршруту
- `Meta` - метадані сторінки
- `PageHeaderProps` - пропси заголовка сторінки

### `theme.ts` - Типи теми

- `Theme` - конфігурація теми
- `Direction` - напрямок тексту
- `Mode` - режим теми
- `LayoutType` - тип макету

### `api.ts` - Типи API

- `ApiResponse<T>` - стандартна відповідь API
- `PaginatedResponse<T>` - пагінована відповідь
- `ApiError` - тип помилки API
- `HttpMethod` - HTTP методи
- `RequestConfig` - конфігурація запиту

### `store.ts` - Типи магазину

- `Product` - тип продукту
- `Category` - тип категорії
- `Order` - тип замовлення
- `Cart` - тип кошика
- `Wishlist` - тип списку бажань
- `Review` - тип відгуку

### `forms.ts` - Типи форм

- `FormField` - конфігурація поля форми
- `FormConfig` - конфігурація форми
- `ValidationRule` - правило валідації
- `ValidationSchema` - схема валідації
- `UniversalFormProps` - пропси універсальної форми

### `ui.ts` - Типи UI компонентів

- `ButtonVariant`, `ButtonSize` - типи кнопок
- `ModalProps`, `DrawerProps` - типи модальних вікон
- `NotificationProps`, `ToastProps` - типи сповіщень
- `AvatarProps`, `BadgeProps` - типи аватара та бейджа
- `InputProps`, `SelectProps` - типи інпутів
- `TableProps` - типи таблиць

### `location.ts` - Типи локацій

- `Country`, `State`, `City` - типи країн, штатів, міст
- `Address` - тип адреси
- `LocationData` - базовий тип локації
- `AddressValidationResult` - результат валідації адреси

### `payment.ts` - Типи платежів

- `PaymentMethod`, `PaymentStatus` - типи методів та статусів платежів
- `StripePaymentIntent`, `PayPalOrder` - типи для платіжних систем
- `PaymentSession`, `PaymentConfirmation` - типи сесій платежів
- `Refund`, `PaymentError` - типи повернень та помилок

## Використання

### Імпорт типів

```typescript
// Імпорт конкретних типів
import type { User, Product, ApiResponse } from '@/@types'

// Імпорт з конкретного файлу
import type { User } from '@/@types/auth'
import type { Product } from '@/@types/store'
```

### Експорт через index.ts

Всі типи експортуються через `index.ts`, що дозволяє імпортувати їх з одного місця:

```typescript
// Зручний імпорт
import type { User, Product, ApiResponse, FormConfig, ButtonVariant } from '@/@types'
```

## Принципи організації

1. **Групування за доменом** - типи згруповані за функціональністю
2. **Унікальність** - кожен тип визначений тільки один раз
3. **Експорт через index** - зручний імпорт всіх типів
4. **Документація** - кожен тип має коментар з описом

## Додавання нових типів

1. Визначте, до якого домену належить тип
2. Додайте тип до відповідного файлу
3. Експортуйте через `index.ts`
4. Оновіть документацію

## Приклади

### Створення типу продукту

```typescript
// В @types/store.ts
export type Product = {
  _id?: string
  name: string
  price: number
  description: string
  category: string
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}
```

### Використання в компоненті

```typescript
import type { Product, ApiResponse } from '@/@types'

interface ProductListProps {
  products: Product[]
  onProductSelect: (product: Product) => void
}

const ProductList: React.FC<ProductListProps> = ({ products, onProductSelect }) => {
  // Компонент
}
```

### Використання в сервісі

```typescript
import type { Product, ApiResponse } from '@/@types'

export async function getProducts(): Promise<ApiResponse<Product[]>> {
  // Логіка отримання продуктів
}
```
