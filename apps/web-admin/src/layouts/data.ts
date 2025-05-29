import type { INavMain } from "./components/NavMain";

type ISidebarData = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
} & INavMain;

export function getSidebarData(): ISidebarData {
  const data = [
    {
      title: "Manage",
      url: "#",
      items: [
        { title: "Business Model", url: "/business-model" },
        { title: "Company", url: "/company" },
        { title: "Course", url: "/course" },
        { title: "Education Institution", url: "/education-institution" },
        { title: "Education Level", url: "/education-level" },
        { title: "Job Position", url: "/job-position" },
        { title: "Jobber", url: "/jobber" },
        { title: "Jobber Status", url: "/jobber-status" },
        { title: "Major", url: "/major" },
        { title: "Member", url: "/member" },
        { title: "Post", url: "/post" },
        { title: "Skill", url: "/skill" },
      ].sort((a, b) => a.title.localeCompare(b.title)),
    },
    {
      title: "Report",
      url: "#",
      items: [
        { title: "Company", url: "/report-company" },
        { title: "Jobber", url: "/report-jobber" },
        { title: "Member", url: "/report-member" },
        { title: "Post", url: "/report-post" },
        { title: "Skills", url: "/report-skill" },
      ].sort((a, b) => a.title.localeCompare(b.title)),
    },
  ];

  return {
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    groups: data,
  };
}
