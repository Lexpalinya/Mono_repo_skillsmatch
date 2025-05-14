import {
} from "lucide-react";
import type { INavMain } from "./components/nav-main";




type ISidebarData = {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
} & INavMain;

export function getSidebarData(): ISidebarData {
    const data =  [
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

                    }, {
                        title: "course",
                        url: "/course",

                    }, {
                        title: "course",
                        url: "/course",

                    }, {
                        title: "Job Position",
                        url: "/job-position",

                    }, {
                        title: "Skills",
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

        ]
    return {
        user: {
            name: "string",
            email: "string",
            avatar: "string"
        },
        groups: data,
    };
}