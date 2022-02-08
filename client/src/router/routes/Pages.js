import { lazy } from "react";

const PagesRoutes = [
    {
        path: "/home",
        component: lazy(() => import("../../views/pages/Home")),
        meta: {
            accessibleBy: ["USER", "PATIENT", "DOCTOR", "HEALTH_OFFICIAL", "IMMIGRATION_OFFICER", "ADMIN"],
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

export default PagesRoutes;
