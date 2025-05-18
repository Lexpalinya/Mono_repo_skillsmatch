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
        {
          title: "Member",
          url: "/member",
        },
        {
          title: "Jobber",
          url: "/jobber",
        },
        {
          title: "Company",
          url: "/company",
        },
        {
          title: "Post",
          url: "/post",
        },
        {
          title: "Education Level",
          url: "/education-level",
        },
        {
          title: "Education Institution",
          url: "/education-institution",
        },
        {
          title: "Major",
          url: "/major",
        },
        {
          title: "Course",
          url: "/course",
        },
        {
          title: "Job Position",
          url: "/job-position",
        },
        {
          title: "Business Model",
          url: "/business-model",
        },
        {
          title: "Skill",
          url: "/skill",
        },
      ],
    },
    {
      title: "Report",
      url: "#",
      items: [
        {
          title: "Member",
          url: "/report-member",
        },
        {
          title: "Jobber",
          url: "/report-jobber",
        },
        {
          title: "Company",
          url: "/report-company",
        },
        {
          title: "Post",
          url: "/report-post",
        },
        {
          title: "Skills",
          url: "/report-skill",
        },
      ],
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
