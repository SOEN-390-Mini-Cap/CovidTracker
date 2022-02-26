import { Activity, Circle, Heart, Home, User } from "react-feather";

export default [
    {
        id: "dashboard",
        title: "Dashboard",
        icon: <Home />,
        navLink: "/home",
        accessibleBy: ["USER", "PATIENT", "DOCTOR", "HEALTH_OFFICIAL", "IMMIGRATION_OFFICER", "ADMIN"],
    },
    {
        id: "user",
        title: "User",
        icon: <User />,
        accessibleBy: ["ADMIN"],
        children: [
            {
                id: "roles",
                title: "Roles",
                icon: <Circle />,
                navLink: "/assign_role",
                accessibleBy: ["ADMIN"],
            },
        ],
    },
    {
        id: "doctor",
        title: "Doctor",
        icon: <Activity />,
        accessibleBy: ["ADMIN"],
        children: [
            {
                id: "patientsAssigned",
                title: "Patients Assigned",
                icon: <Circle />,
                navLink: "/patients_assigned",
                accessibleBy: ["ADMIN"],
            },
        ],
    },
    {
        id: "patient",
        title: "Patient",
        icon: <Heart />,
        accessibleBy: ["ADMIN", "DOCTOR", "PATIENT"],
        children: [
            {
                id: "assignDoctor",
                title: "Assign Doctor",
                icon: <Circle />,
                navLink: "/assign_doctor",
                accessibleBy: ["ADMIN"],
            },
            {
                id: "defineStatusReport",
                title: "Define Status Report",
                icon: <Circle />,
                navLink: "/define_status_report",
                accessibleBy: ["DOCTOR"],
            },
            {
                id: "statusReport",
                title: "Submit Status Report",
                icon: <Circle />,
                navLink: "/status_report",
                accessibleBy: ["PATIENT"],
            },
        ],
    },
];
