import { Activity, Circle, Home } from "react-feather";

export default [
    {
        id: "dashboard",
        title: "Dashboard",
        icon: <Home />,
        navLink: "/home",
    },
    {
        id: "doctor",
        title: "Doctor",
        icon: <Activity />,
        children: [
            {
                id: "patientsAssigned",
                title: "Patients Assigned",
                icon: <Circle />,
                navLink: "/patients_assigned",
            },
        ],
    },
];
