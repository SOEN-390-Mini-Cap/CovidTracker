// ** React Imports
import { lazy } from "react";
import { Redirect } from "react-router-dom";

const AppRoutes = [
    {
        path: "/apps/invoice/preview",
        exact: true,
        component: () => <Redirect to="/apps/invoice/preview/4987" />,
    },
    {
        path: "/apps/invoice/edit",
        exact: true,
        component: () => <Redirect to="/apps/invoice/edit/4987" />,
    },
    {
        path: "/apps/ecommerce/product-detail",
        exact: true,
        className: "ecommerce-application",
        component: () => <Redirect to="/apps/ecommerce/product-detail/apple-i-phone-11-64-gb-black-26" />,
    },

    {
        path: "/apps/user/list",
        component: lazy(() => import("../../views/apps/user/list")),
    },
    {
        path: "/apps/user/view",
        exact: true,
        component: () => <Redirect to="/apps/user/view/1" />,
    },
    {
        path: "/apps/user/view/:id",
        component: lazy(() => import("../../views/apps/user/view")),
        meta: {
            navLink: "/apps/user/view",
        },
    },
    {
        path: "/apps/roles",
        component: lazy(() => import("../../views/apps/roles-permissions/roles")),
    },
    {
        path: "/apps/permissions",
        component: lazy(() => import("../../views/apps/roles-permissions/permissions")),
    },
];

export default AppRoutes;
