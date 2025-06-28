# Timeline Page

Trang Timeline cung cấp 3 view khác nhau để quản lý và hiển thị dữ liệu dự án:

## Các View

### 1. Calendar View
- Hiển thị lịch với các sự kiện và nhiệm vụ
- Có sidebar bên phải để quản lý chi tiết
- Sử dụng component `BigCalendar`

### 2. Gantt View
- Hiển thị biểu đồ Gantt với timeline và dependencies
- Có sidebar bên trái để hiển thị danh sách tasks
- Sử dụng component `GanttExample`
- Không hiển thị sidebar bên phải

### 3. Kanban View
- Hiển thị bảng Kanban với các cột trạng thái
- Hỗ trợ drag & drop để di chuyển tasks
- Sử dụng component `KanbanExample`
- Không hiển thị sidebar bên phải

## Tính năng

- **Tabs Navigation**: Chuyển đổi giữa các view bằng tabs
- **Responsive Layout**: Tự động ẩn/hiện sidebar tùy theo view
- **Context Management**: Sử dụng React Context để quản lý trạng thái sidebar
- **Flexible Styling**: Mỗi view có styling phù hợp với layout

## Cấu trúc Files

```
timeline/
├── layout.tsx          # Layout với sidebar và context
├── page.tsx           # Trang chính với tabs
└── README.md          # Tài liệu này
```

## Components được sử dụng

- `@/components/calendar/big-calendar` - Calendar view
- `@/components/gantt/example` - Gantt view
- `@/components/kanban/example` - Kanban view
- `@workspace/ui/components/tabs` - Tabs navigation
- `@workspace/ui/components/resizable` - Resizable panels

## Cách sử dụng

1. Truy cập vào trang Timeline
2. Chọn tab tương ứng với view mong muốn
3. Sidebar sẽ tự động ẩn/hiện tùy theo view
4. Mỗi view có các tính năng riêng biệt

## Lưu ý

- Calendar view là view mặc định và hiển thị sidebar
- Gantt và Kanban view không hiển thị sidebar để tối ưu không gian
- Tất cả các components đều sử dụng dữ liệu mẫu từ Faker.js 