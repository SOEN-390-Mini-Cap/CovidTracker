import AppRoutes from "./Apps";
import FormRoutes from "./Forms";
import PagesRoutes from "./Pages";
import TablesRoutes from "./Tables";
import DashboardRoutes from "./Dashboards";
import UiElementRoutes from "./UiElements";
import ExtensionsRoutes from "./Extensions";
import PageLayoutsRoutes from "./PageLayouts";

// ** Default Route
const DefaultRoute = "/home";

// ** Merge Routes
const Routes = [
    ...DashboardRoutes,
    ...AppRoutes,
    ...PagesRoutes,
    ...UiElementRoutes,
    ...ExtensionsRoutes,
    ...PageLayoutsRoutes,
    ...FormRoutes,
    ...TablesRoutes,
];

export { DefaultRoute, Routes };
