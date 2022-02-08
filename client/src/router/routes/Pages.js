import { lazy } from "react";

const PagesRoutes = [
    {
        path: "/home",
        component: lazy(() => import("../../views/pages/Home")),
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
        path: "/pages/profile",
        component: lazy(() => import("../../views/pages/profile")),
    },
    {
        path: "/pages/account-settings",
        component: lazy(() => import("../../views/pages/account-settings")),
    },
    {
        path: "/pages/license",
        component: lazy(() => import("../../views/pages/license")),
    },
    {
        path: "/pages/api-key",
        component: lazy(() => import("../../views/pages/api-key")),
    },
    {
        path: "/misc/coming-soon",
        component: lazy(() => import("../../views/pages/misc/ComingSoon")),
        layout: "BlankLayout",
        meta: {
            publicRoute: true,
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
        path: "/misc/maintenance",
        component: lazy(() => import("../../views/pages/misc/Maintenance")),
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
