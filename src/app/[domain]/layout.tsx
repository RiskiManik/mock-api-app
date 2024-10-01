import { SidebarApp } from "@/components/SidebarDemo";

const SubdomainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <SidebarApp>{children}</SidebarApp>
    </section>
  );
};

export default SubdomainLayout;
