import { Suspense, lazy, Fragment } from "react";
import { isUserLoggedIn } from "@utils";
import { useLayout } from "@hooks/useLayout";
import { useRouterTransition } from "@hooks/useRouterTransition";
import LayoutWrapper from "@layouts/components/layout-wrapper";
import { BrowserRouter as AppRouter, Route, Switch, Redirect } from "react-router-dom";
import { DefaultRoute, Routes } from "./routes";
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import {useSelector} from "react-redux";

const selectRole = (state) => state.auth.userData.user.role;

const Router = () => {
    const { layout, setLayout, setLastLayout } = useLayout();
    const { transition, setTransition } = useRouterTransition();
    const role = useSelector(selectRole);

    const DefaultLayout = layout === "horizontal" ? "HorizontalLayout" : "VerticalLayout";

    const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout };

    const currentActiveItem = null;

    // ** Return Filtered Array of Routes & Paths
    const LayoutRoutesAndPaths = (layout) => {
        const LayoutRoutes = [];
        const LayoutPaths = [];

        if (Routes) {
            Routes.filter((route) => {
                // ** Checks if Route layout or Default layout matches current layout
                if (route.layout === layout || (route.layout === undefined && DefaultLayout === layout)) {
                    LayoutRoutes.push(route);
                    LayoutPaths.push(route.path);
                }
            });
        }

        return { LayoutRoutes, LayoutPaths };
    };

    const NotAuthorized = lazy(() => import("@src/views/pages/misc/NotAuthorized"));

    const Error = lazy(() => import("@src/views/pages/misc/Error"));

    const FinalRoute = (props) => {
        // Logged out user trying to access a page that is not a sign in or sign out page
        // and not a public page
        if (!isUserLoggedIn() && !props.route?.meta.authRoute && !props.route?.meta.publicRoute) {
            return <Redirect to="/sign_in" />;
        }

        // Logged in user trying to go to sign up or sign in page
        if (isUserLoggedIn() && props.route?.meta.authRoute) {
            return <Redirect to="/" />;
        }

        // Logged in user trying to go to page they do not have the correct role for
        if (isUserLoggedIn() && !props.route?.meta?.accessibleBy.includes(role)) {
            return (
                <Route
                    exact
                    path="/misc/not-authorized"
                    render={() => (
                        <Layouts.BlankLayout>
                            <NotAuthorized />
                        </Layouts.BlankLayout>
                    )}
                />
            );
        }

        return <props.route.component {...props} />;
    };

    // ** Return Route to Render
    const ResolveRoutes = () => {
        return Object.keys(Layouts).map((layout, index) => {
            // ** Convert Layout parameter to Layout Component
            // ? Note: make sure to keep layout and component name equal

            const LayoutTag = Layouts[layout];

            // ** Get Routes and Paths of the Layout
            const { LayoutRoutes, LayoutPaths } = LayoutRoutesAndPaths(layout);

            // ** We have freedom to display different layout for different route
            // ** We have made LayoutTag dynamic based on layout, we can also replace it with the only layout component,
            // ** that we want to implement like VerticalLayout or HorizontalLayout
            // ** We segregated all the routes based on the layouts and Resolved all those routes inside layouts

            // ** RouterProps to pass them to Layouts
            const routerProps = {};

            return (
                <Route path={LayoutPaths} key={index}>
                    <LayoutTag
                        layout={layout}
                        setLayout={setLayout}
                        transition={transition}
                        routerProps={routerProps}
                        setLastLayout={setLastLayout}
                        setTransition={setTransition}
                        currentActiveItem={currentActiveItem}
                    >
                        <Switch>
                            {LayoutRoutes.map((route) => {
                                return (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        exact={route.exact === true}
                                        render={(props) => {
                                            // ** Assign props to routerProps
                                            Object.assign(routerProps, {
                                                ...props,
                                                meta: route.meta,
                                            });

                                            return (
                                                <Fragment>
                                                    {/* Layout Wrapper to add classes based on route's layout, appLayout and className */}

                                                    {route.layout === "BlankLayout" ? (
                                                        <Fragment>
                                                            <FinalRoute route={route} {...props} />
                                                        </Fragment>
                                                    ) : (
                                                        <LayoutWrapper
                                                            layout={DefaultLayout}
                                                            transition={transition}
                                                            setTransition={setTransition}
                                                            /* Conditional props */
                                                            /*eslint-disable */
                              {...(route.appLayout
                                ? {
                                    appLayout: route.appLayout
                                  }
                                : {})}
                              {...(route.meta
                                ? {
                                    routeMeta: route.meta
                                  }
                                : {})}
                              {...(route.className
                                ? {
                                    wrapperClass: route.className
                                  }
                                : {})}
                              /*eslint-enable */
                                                        >
                                                            <Suspense fallback={null}>
                                                                <FinalRoute route={route} {...props} />
                                                            </Suspense>
                                                        </LayoutWrapper>
                                                    )}
                                                </Fragment>
                                            );
                                        }}
                                    />
                                );
                            })}
                        </Switch>
                    </LayoutTag>
                </Route>
            );
        });
    };

    return (
        <AppRouter basename={process.env.REACT_APP_BASENAME}>
            <Switch>
                {/* If user is logged in Redirect user to DefaultRoute else to login */}
                <Route
                    exact
                    path="/"
                    render={() => {
                        return isUserLoggedIn() ? <Redirect to={DefaultRoute} /> : <Redirect to="/sign_in" />;
                    }}
                />
                {/* Not Auth Route */}
                <Route
                    exact
                    path="/misc/not-authorized"
                    render={() => (
                        <Layouts.BlankLayout>
                            <NotAuthorized />
                        </Layouts.BlankLayout>
                    )}
                />
                {ResolveRoutes()}

                {/* NotFound Error page */}
                <Route path="*" component={Error} />
            </Switch>
        </AppRouter>
    );
};

export default Router;
