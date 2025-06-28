# Navigation System Documentation

## Tổng quan

Hệ thống navigation đã được tập trung hóa vào file `config.ts` để dễ dàng quản lý và bảo trì. Tất cả các navigation items được định nghĩa ở một nơi duy nhất.

## Cấu trúc

### 1. File Config (`lib/config.ts`)

```typescript
export const configNav = {
  mainLink: "/",
  loginLink: "/auth/login",
  
  // Main navigation items
  mainNav: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    // ... more items
  ],
  
  // Secondary navigation items
  secondaryNav: [...],
  
  // Project navigation items
  projectNav: [...],
};
```

### 2. Interfaces

```typescript
interface NavItem {
  title: string;
  url: string;
  icon?: React.ElementType;
}

interface ProjectNavItem {
  name: string;
  url: string;
  icon: React.ElementType;
}
```

### 3. Custom Hook

```typescript
const { mainNav, secondaryNav, projectNav, isActive, isActiveStartsWith } = useNavigation();
```

## Cách sử dụng

### 1. Thêm navigation item mới

Để thêm một navigation item mới, chỉ cần chỉnh sửa file `config.ts`:

```typescript
// Thêm vào mainNav
mainNav: [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "New Page", // Thêm item mới
    url: "/new-page",
    icon: NewIcon,
  },
],
```

### 2. Sử dụng trong component

```typescript
import { useNavigation } from "@/lib/config";

export function MyComponent() {
  const { mainNav, isActive } = useNavigation();
  
  return (
    <div>
      {mainNav.map((item) => (
        <Link 
          key={item.title} 
          href={item.url}
          className={isActive(item.url) ? 'active' : ''}
        >
          {item.icon && <item.icon />}
          {item.title}
        </Link>
      ))}
    </div>
  );
}
```

### 3. Utility Functions

```typescript
import { navUtils } from "@/lib/config";

// Kiểm tra URL active
const isActive = navUtils.isActiveUrl(currentPath, targetUrl);

// Kiểm tra URL bắt đầu với
const isActiveStartsWith = navUtils.isActiveUrlStartsWith(currentPath, targetUrl);

// Lấy navigation item theo URL
const item = navUtils.getNavItemByUrl("/some-url", "main");

// Thêm navigation item động
navUtils.addNavItem({
  title: "Dynamic Page",
  url: "/dynamic",
  icon: DynamicIcon,
}, "main");
```

## Lợi ích

✅ **Tập trung hóa**: Tất cả navigation được quản lý ở một nơi

✅ **Dễ bảo trì**: Chỉ cần sửa một file để thay đổi navigation

✅ **Type Safety**: TypeScript interfaces đảm bảo type safety

✅ **Reusable**: Có thể sử dụng lại logic navigation ở nhiều nơi

✅ **Extensible**: Dễ dàng mở rộng thêm tính năng mới

## Ví dụ thực tế

### Thêm trang mới

1. Tạo trang mới trong `app/(dashboard)/new-page/page.tsx`
2. Thêm navigation item vào `config.ts`:

```typescript
mainNav: [
  // ... existing items
  {
    title: "New Page",
    url: "/new-page",
    icon: NewIcon,
  },
],
```

3. Navigation sẽ tự động hiển thị trang mới và có active state

### Thay đổi icon

Chỉ cần thay đổi icon trong `config.ts`:

```typescript
{
  title: "Home",
  url: "/",
  icon: NewHomeIcon, // Thay đổi icon
},
```

Tất cả components sử dụng navigation này sẽ tự động cập nhật. 