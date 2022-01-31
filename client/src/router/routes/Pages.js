import { lazy } from "react";
import { Redirect } from "react-router-dom";

const PagesRoutes = [
    {
        path: "/home",
        component: lazy(() => import("../../views/pages/Home")),
    },
    {
        path: "/login",
        component: lazy(() => import("../../views/pages/authentication/Login")),
        layout: "BlankLayout",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/register",
        component: lazy(() => import("../../views/pages/authentication/Register")),
        layout: "BlankLayout",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/pages/register-basic",
        component: lazy(() => import("../../views/pages/authentication/RegisterBasic")),
        layout: "BlankLayout",
    },
    {
        path: "/pages/register-cover",
        component: lazy(() => import("../../views/pages/authentication/RegisterCover")),
        layout: "BlankLayout",
    },
    {
        path: "/forgot-password",
        component: lazy(() => import("../../views/pages/authentication/ForgotPassword")),
        layout: "BlankLayout",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/pages/forgot-password-basic",
        component: lazy(() => import("../../views/pages/authentication/ForgotPasswordBasic")),
        layout: "BlankLayout",
    },
    {
        path: "/pages/forgot-password-cover",
        component: lazy(() => import("../../views/pages/authentication/ForgotPasswordCover.js")),
        layout: "BlankLayout",
    },
    {
        path: "/pages/reset-password-basic",
        component: lazy(() => import("../../views/pages/authentication/ResetPasswordBasic")),
        layout: "BlankLayout",
    },
    {
        path: "/pages/reset-password-cover",
        component: lazy(() => import("../../views/pages/authentication/ResetPasswordCover")),
        layout: "BlankLayout",
    },
    {
        path: "/pages/verify-email-basic",
        component: lazy(() => import("../../views/pages/authentication/VerifyEmailBasic")),
        layout: "BlankLayout",
    },
    {
        path: "/pages/verify-email-cover",
        component: lazy(() => import("../../views/pages/authentication/VerifyEmailCover")),
        layout: "BlankLayout",
    },
    {
        path: "/pages/two-steps-basic",
        component: lazy(() => import("../../views/pages/authentication/TwoStepsBasic")),
        layout: "BlankLayout",
    },
    {
        path: "/pages/two-steps-cover",
        component: lazy(() => import("../../views/pages/authentication/TwoStepsCover")),
        layout: "BlankLayout",
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
