"use client";

import { AllPosts } from "@/components/dashboard/all-posts";
import { Favorites } from "@/components/dashboard/favorites";
import { ClientSidebar } from "@/components/sidebar";
import { useState } from "react";
import { ClientSection } from "@/types/client-section";

export default function Home() {
  const [activeSection, setActiveSection] = useState<ClientSection>("All");
  return (
    <div className="flex">
      <ClientSidebar
        onSectionChange={setActiveSection}
        activeSection={activeSection}
      />
      <div className="flex flex-col gap-4 w-full pl-16">
        {activeSection === "All" && <AllPosts />}
        {activeSection === "Favorites" && <Favorites />}
      </div>
    </div>
  );
}
