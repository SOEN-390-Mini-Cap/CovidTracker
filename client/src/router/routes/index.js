import { lazy } from "react";

const DefaultRoute = "/dashboard";

const Routes = [
    {
        path: "/dashboard",
        component: lazy(() => import("../../views/pages/dashboard/Dashboard")),
        meta: {
            accessibleBy: ["USER", "PATIENT", "DOCTOR", "HEALTH_OFFICIAL", "IMMIGRATION_OFFICER", "ADMIN"],
        },
    },
    {
        path: "/chat",
        appLayout: true,
        className: "chat-application",
        component: lazy(() => import("../../views/pages/chat")),
    },
    {
        path: "/location_report",
        component: lazy(() => import("../../views/pages/location_report/AddLocationReport")),
        meta: {
            accessibleBy: ["USER", "PATIENT"],
        },
    },
    {
        path: "/assigned_patients",
        component: lazy(() => import("../../views/pages/doctor/PatientsAssigned")),
        meta: {
            accessibleBy: ["ADMIN"],
        },
    },
    {
        path: "/assign_doctor",
        component: lazy(() => import("../../views/pages/patient/AssignDoctor")),
        meta: {
            accessibleBy: ["ADMIN"],
        },
    },
    {
        path: "/statuses/define/:patientId",
        component: lazy(() => import("../../views/pages/patient/DefineStatusReport")),
        meta: {
            accessibleBy: ["DOCTOR"],
        },
    },
    {
        path: "/statuses/inbox",
        component: lazy(() => import("../../views/pages/patient/StatusReportInbox")),
        meta: {
            accessibleBy: ["DOCTOR"],
        },
    },
    {
        path: "/appointments",
        component: lazy(() => import("../../views/pages/patient/Appointments")),
        meta: {
            accessibleBy: ["DOCTOR", "PATIENT"],
        },
    },
    {
        path: "/statuses/submit",
        component: lazy(() => import("../../views/pages/patient/StatusReport")),
        meta: {
            accessibleBy: ["PATIENT"],
        },
    },
    {
        path: "/patients",
        component: lazy(() => import("../../views/pages/patient/PatientList")),
        meta: {
            accessibleBy: ["DOCTOR", "HEALTH_OFFICIAL", "IMMIGRATION_OFFICER"],
        },
    },
    {
        path: "/statuses/patients/:patientId",
        component: lazy(() => import("../../views/pages/patient/StatusReports")),
        meta: {
            accessibleBy: ["PATIENT", "DOCTOR", "HEALTH_OFFICIAL"],
        },
    },
    {
        path: "/statuses/:statusId",
        component: lazy(() => import("../../views/pages/patient/Status")),
        meta: {
            accessibleBy: ["PATIENT", "DOCTOR", "HEALTH_OFFICIAL"],
        },
    },
    {
        path: "/add_test/patients/:patientId",
        component: lazy(() => import("../../views/pages/test/ReportTestResult")),
        meta: {
            accessibleBy: ["DOCTOR", "HEALTH_OFFICIAL"],
        },
    },
    {
        path: "/tests/patients/:patientId",
        component: lazy(() => import("../../views/pages/test/TestResults")),
        meta: {
            accessibleBy: ["PATIENT", "DOCTOR", "HEALTH_OFFICIAL", "IMMIGRATION_OFFICER"],
        },
    },
    {
        path: "/tests/:testId",
        component: lazy(() => import("../../views/pages/test/TestResult")),
        meta: {
            accessibleBy: ["PATIENT", "DOCTOR", "HEALTH_OFFICIAL", "IMMIGRATION_OFFICER"],
        },
    },
    {
        path: "/create_appointment/:patientId",
        component: lazy(() => import("../../views/pages/patient/CreateAppointment")),
        meta: {
            accessibleBy: ["DOCTOR"],
        },
    },
    {
        path: "/contact_tracing/contacts/:patientId",
        component: lazy(() => import("../../views/pages/contact_tracing/TracedContactsList")),
        meta: {
            accessibleBy: ["HEALTH_OFFICIAL"],
        },
    },
    {
        path: "/contact_tracing",
        component: lazy(() => import("../../views/pages/contact_tracing/ContactTracing")),
        meta: {
            accessibleBy: ["HEALTH_OFFICIAL"],
        },
    },
    {
        path: "/sign_in",
        component: lazy(() => import("../../views/pages/authentication/SignIn")),
        layout: "BlankLayout",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/sign_up",
        component: lazy(() => import("../../views/pages/authentication/SignUp")),
        layout: "BlankLayout",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/assign_role",
        component: lazy(() => import("../../views/pages/user/RoleChange")),
        meta: {
            accessibleBy: ["ADMIN"],
        },
    },
    {
        path: "/misc/not-authorized",
        component: lazy(() => import("../../views/pages/misc/NotAuthorized")),
        layout: "BlankLayout",
        meta: {
            publicRoute: true,
        },
    },
    {
        path: "/misc/error",
        component: lazy(() => import("../../views/pages/misc/Error")),
        layout: "BlankLayout",
        meta: {
            publicRoute: true,
        },
    },
];

export { DefaultRoute, Routes };
