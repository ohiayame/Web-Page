import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import MailIcon from '@mui/icons-material/Mail';
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddCardIcon from "@mui/icons-material/AddCard";
import BackupIcon from "@mui/icons-material/Backup";
import SettingsIcon from "@mui/icons-material/Settings";

export const SidebarData = [
    {
        title: "홈",
        icon:<HomeIcon />,
        link: "/home",
    },
    {
        title: "이메일",
        icon:<MailIcon />,
        link: "/Email",
    },
    {
        title: "어낼러틱스",
        icon: <AssessmentIcon />,
        link: "/analitics",
    },
    {
        title: "친구추가",
        icon: <PersonAddIcon />,
        link: "/friends",
    },
    {
        title: "결제 설정",
        icon: <AddCardIcon />,
        link: "/payment",
    },
    {
        title: "업로드",
        icon: <BackupIcon />,
        link: "/upload",
    },
    {
        title: "상세 설정",
        icon: <SettingsIcon />,
        link: "/rocket",
    },
]