# Supabase Authentication Setup

## Tổng quan

Dự án này sử dụng Supabase để quản lý authentication thay vì better-auth. Dưới đây là hướng dẫn sử dụng các components và hooks đã được tạo.

## Các file chính

### 1. Client Setup (`client.ts`)

```typescript
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
```

### 2. Server Setup (`server.ts`)

```typescript
import { createClient } from '@/lib/supabase/server';
const supabase = await createClient();
```

### 3. Authentication Hook (`auth-hook.ts`)

Hook tùy chỉnh để quản lý authentication state:

```typescript
import { useSupabaseAuth } from '@/lib/supabase/auth-hook';

function MyComponent() {
  const { user, loading, supabase } = useSupabaseAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;
  
  return <div>Hello {user.name}!</div>;
}
```

### 4. Auth Provider (`auth-provider.tsx`)

Provider để quản lý authentication state trong Redux:

```typescript
import { useAuth } from '@/lib/supabase/auth-provider';

function MyComponent() {
  const { user, loading, supabase } = useAuth();
  // ...
}
```

### 5. Server-side Authentication (`server-auth.ts`)

Utility functions cho server-side:

```typescript
import { getServerUser, requireAuth } from '@/lib/supabase/server-auth';

// Lấy user (có thể null)
const user = await getServerUser();

// Yêu cầu authentication (throw error nếu không có user)
const user = await requireAuth();
```

## Cách sử dụng

### Client-side Components

```typescript
"use client";
import { useAuth } from '@/lib/supabase/auth-provider';

export function UserProfile() {
  const { user, supabase } = useAuth();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

### Server-side Components

```typescript
import { getServerUser } from '@/lib/supabase/server-auth';

export default async function ServerComponent() {
  const user = await getServerUser();
  
  if (!user) {
    redirect('/auth/login');
  }
  
  return <div>Hello {user.name} from server!</div>;
}
```

### Protected Routes

Middleware đã được cấu hình để tự động redirect về `/auth/login` nếu user chưa đăng nhập.

## Components có sẵn

### UserInfo Component

```typescript
import { UserInfo } from '@/components/auth/user-info';

// Hiển thị thông tin user với avatar và metadata
<UserInfo />
```

### LogoutButton Component

```typescript
import { LogoutButton } from '@/components/auth/logout-button';

// Button logout tự động
<LogoutButton />
```

## Cấu hình

Đảm bảo các environment variables sau đã được cấu hình:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Lưu ý

1. Supabase tự động quản lý session và token
2. Middleware đã được cấu hình để bảo vệ routes
3. AuthProvider đã được wrap trong Providers để quản lý state toàn cục
4. User data được chuyển đổi từ Supabase format sang App format tự động
