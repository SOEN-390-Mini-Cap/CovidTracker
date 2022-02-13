import { Activity, Circle } from "react-feather";

export default [
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
