import { Activity, Circle, Compass, Heart, Home, MessageCircle, User } from "react-feather";

export default (userId) => [
    {
        id: "dashboard",
        title: "Dashboard",
        icon: <Home />,
        navLink: "/home",
        accessibleBy: ["USER", "PATIENT", "DOCTOR", "HEALTH_OFFICIAL", "IMMIGRATION_OFFICER", "ADMIN"],
    },
    {
        id: "chat",
        title: "Chat",
        icon: <MessageCircle />,
        navLink: "/chat",
        accessibleBy: ["PATIENT", "DOCTOR"],
    },
    {
        id: "addLocation",
        title: "Add Location",
        icon: <Compass />,
        navLink: "/location_report",
        accessibleBy: ["USER", "PATIENT"],
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
        accessibleBy: ["ADMIN", "DOCTOR", "PATIENT", "HEALTH_OFFICIAL", "IMMIGRATION_OFFICER"],
        children: [
            {
                id: "assignDoctor",
                title: "Assign Doctor",
                icon: <Circle />,
                navLink: "/assign_doctor",
                accessibleBy: ["ADMIN"],
            },
            {
                id: "patientList",
                title: "Patient List",
                icon: <Circle />,
                navLink: "/patients",
                accessibleBy: ["DOCTOR", "HEALTH_OFFICIAL", "IMMIGRATION_OFFICER"],
            },
            {
                id: "statusReportInbox",
                title: "Status Report Inbox",
                icon: <Circle />,
                navLink: "/statuses/inbox",
                accessibleBy: ["DOCTOR"],
            },
            {
                id: "statusReport",
                title: "Status Report",
                icon: <Circle />,
                navLink: "/statuses/submit",
                accessibleBy: ["PATIENT"],
            },
            {
                id: "statusReports",
                title: "Status Reports",
                icon: <Circle />,
                navLink: `/statuses/patients/${userId}`,
                accessibleBy: ["PATIENT"],
            },
            {
                id: "testResults",
                title: "Test Results",
                icon: <Circle />,
                navLink: `/tests/patients/${userId}`,
                accessibleBy: ["PATIENT"],
            },
        ],
    },
];
