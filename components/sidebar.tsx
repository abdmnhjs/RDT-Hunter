import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { GalleryHorizontalEnd, Heart } from "lucide-react";
import { ClientSection } from "@/types/client-section";

interface ClientSidebarProps {
  onSectionChange: (section: ClientSection) => void;
  activeSection: ClientSection;
}

// Menu items.
const items = [
  {
    title: "All posts",
    section: "All" as ClientSection,
    icon: GalleryHorizontalEnd,
  },
  {
    title: "Favorites posts",
    section: "Favorites" as ClientSection,
    icon: Heart,
  },
];

export function ClientSidebar({
  onSectionChange,
  activeSection,
}: ClientSidebarProps) {
  return (
    <div className="relative">
      <div className="absolute right-[-40px] top-4">
        <SidebarTrigger />
      </div>
      <Sidebar>
        <SidebarContent className="bg-[#290D04] text-white border-none">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="cursor-pointer"
                      onClick={() => onSectionChange(item.section)}
                      data-state={
                        activeSection === item.section ? "active" : ""
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
