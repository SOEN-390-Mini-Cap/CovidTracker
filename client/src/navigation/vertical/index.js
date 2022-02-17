import { Activity, Circle, Home, User } from "react-feather";

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
];
