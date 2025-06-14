import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import NotificationMenu from "./navbar/notification-menu";
import SearchItem from "./search-item";
import { UserOnline } from "./user-online";

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />

				<div className="-translate-x-1/2 absolute left-1/2 hidden lg:block">
					<SearchItem />
				</div>
				<div className="ml-auto flex items-center gap-2">
					<div className="flex items-center gap-2">
						{/* <InfoMenu /> */}
						<UserOnline />
						<NotificationMenu />
					</div>
				</div>
			</div>
		</header>
	);
}
