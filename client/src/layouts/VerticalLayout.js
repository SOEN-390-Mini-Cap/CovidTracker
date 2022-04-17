import Layout from "@layouts/VerticalLayout";
import navigation from "@src/navigation/vertical";
import { Link } from "react-router-dom";
import { Fragment, useEffect } from "react";
import { NavItem, NavLink } from "reactstrap";
import { handleLogout } from "@store/authentication";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { handleProfile } from "@store/authentication";
import { User } from "react-feather";
import * as Icon from "react-feather";
import { getProfile } from "../services/api";

const selectUser = (state) => state.auth.userData.user;
const selectToken = (state) => state.auth.userData.token;

export const CustomNavbar = (props) => {
    const { setMenuVisibility } = props;

    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const token = useSelector(selectToken);

    useEffect(() => {
        async function f() {
            const userData = await getProfile(token);
            dispatch(handleProfile({ user: userData }));
        }
        f();
    }, [dispatch, token]);

    const getRole = () => {
        switch (user?.role) {
            case 'ADMIN':
                return 'Administrator';
            case 'PATIENT':
                return 'Patient';
            case 'HEALTH_OFFICIAL':
                return 'Health Official';
            case 'DOCTOR':
                return 'Doctor'
            case 'IMMIGRATION_OFFICER':
                return 'Immigration Officer'
        }
    };

    return (
        <Fragment>
            <ul className="navbar-nav d-xl-none align-items-center">
                <NavItem className="mobile-menu me-auto">
                    <NavLink
                        className="nav-menu-main menu-toggle hidden-xs is-active"
                        onClick={() => setMenuVisibility(true)}
                    >
                        <Icon.Menu className="ficon" />
                    </NavLink>
                </NavItem>
            </ul>
            <ul className="nav navbar-nav align-items-center ms-auto">
                <NavItem className="nav navbar-nav align-items-center">
                    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
                        <DropdownToggle
                            href="/"
                            tag="a"
                            className="nav-link dropdown-user-link"
                            onClick={(e) => e.preventDefault()}
                        >
                            <div className="user-nav d-sm-flex d-none">
                                <span className="user-name fw-bold">{`${user?.firstName} ${user?.lastName}`}</span>
                                <span className="user-status">{getRole()}</span>
                                
                            </div>
                            <div className="user-nav d-sm-flex d-sm-none">
                                <User color="#5E5873" size={20} />
                            </div>
                        </DropdownToggle>
                        <DropdownMenu end>
                            <DropdownItem tag={Link} onClick={() => dispatch(handleLogout())} to="/sign_in">
                                <span className="align-middle">Logout</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </NavItem>
            </ul>
        </Fragment>
    );
};

const VerticalLayout = (props) => {
    const user = useSelector(selectUser);

    return (
        <Layout menuData={navigation(user.account.userId)} navbar={CustomNavbar} footer={<div />} {...props}>
            {props.children}
        </Layout>
    );
};

export default VerticalLayout;
