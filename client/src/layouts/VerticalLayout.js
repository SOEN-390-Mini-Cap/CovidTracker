import Layout from "@layouts/VerticalLayout";
import navigation from "@src/navigation/vertical";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import { NavItem, NavLink } from "reactstrap";
import { handleLogout } from "@store/authentication";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

const selectUser = (state) => state.auth.userData.user;

const CustomNavbar = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const logoIcon = (
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="path-2-inside-1_198_1276" fill="white">
                <path d="M24.4871 9.79848L21.6119 9.77727C20.8353 9.77727 20.2037 9.11563 20.2037 8.30194L20.2016 5.51255C20.2016 3.57575 18.5958 2 16.6223 2H11.3774C9.40382 2 7.79768 3.57575 7.79768 5.51255L7.81642 13.5699C7.81642 15.3532 9.17892 16.83 10.9354 17.0524H16.8182C17.4657 17.1249 17.9855 17.5987 18.0972 18.2063V26.4878C18.0972 27.264 17.4352 27.8956 16.6219 27.8956H11.3774C10.564 27.8956 9.90207 27.264 9.90207 26.4878V23.197C9.70793 21.5353 8.3274 20.2226 6.61447 20.0974H3.51251C2.73596 20.0974 2.10439 19.4358 2.10439 18.6221V13.3779C2.10439 12.5642 2.73596 11.9026 3.51251 11.9026H5.69364V9.79813H3.51251C1.57538 9.79813 0 11.4039 0 13.3779V18.6221C0 20.5961 1.57538 22.2019 3.51251 22.2019H6.52182C7.16717 22.2751 7.68523 22.7472 7.79768 23.3519V26.4874C7.79768 28.4242 9.40382 30 11.3774 30H16.6219C18.5955 30 20.2013 28.4242 20.2013 26.4874V20.6314H20.225L20.2013 18.0521C20.0089 16.3869 18.6252 15.071 16.908 14.9483H11.0938C10.4247 14.815 9.92117 14.2481 9.92117 13.5706L9.90243 5.51326C9.90243 4.73705 10.5644 4.10548 11.3777 4.10548H16.6223C17.4356 4.10548 18.0976 4.73705 18.0976 5.51326L18.0993 8.30265C18.0993 10.2762 19.6754 11.8824 21.6122 11.8824L24.4875 11.9036C25.2637 11.9036 25.8956 12.5652 25.8956 13.3789V18.6232C25.8956 19.4369 25.2637 20.0985 24.4875 20.0985H22.3064V22.2029H24.4875C26.4243 22.2029 28 20.5971 28 18.6232V13.3789C27.9993 11.4043 26.4236 9.79848 24.4871 9.79848Z" />
            </mask>
            <path
                d="M24.4871 9.79848L21.6119 9.77727C20.8353 9.77727 20.2037 9.11563 20.2037 8.30194L20.2016 5.51255C20.2016 3.57575 18.5958 2 16.6223 2H11.3774C9.40382 2 7.79768 3.57575 7.79768 5.51255L7.81642 13.5699C7.81642 15.3532 9.17892 16.83 10.9354 17.0524H16.8182C17.4657 17.1249 17.9855 17.5987 18.0972 18.2063V26.4878C18.0972 27.264 17.4352 27.8956 16.6219 27.8956H11.3774C10.564 27.8956 9.90207 27.264 9.90207 26.4878V23.197C9.70793 21.5353 8.3274 20.2226 6.61447 20.0974H3.51251C2.73596 20.0974 2.10439 19.4358 2.10439 18.6221V13.3779C2.10439 12.5642 2.73596 11.9026 3.51251 11.9026H5.69364V9.79813H3.51251C1.57538 9.79813 0 11.4039 0 13.3779V18.6221C0 20.5961 1.57538 22.2019 3.51251 22.2019H6.52182C7.16717 22.2751 7.68523 22.7472 7.79768 23.3519V26.4874C7.79768 28.4242 9.40382 30 11.3774 30H16.6219C18.5955 30 20.2013 28.4242 20.2013 26.4874V20.6314H20.225L20.2013 18.0521C20.0089 16.3869 18.6252 15.071 16.908 14.9483H11.0938C10.4247 14.815 9.92117 14.2481 9.92117 13.5706L9.90243 5.51326C9.90243 4.73705 10.5644 4.10548 11.3777 4.10548H16.6223C17.4356 4.10548 18.0976 4.73705 18.0976 5.51326L18.0993 8.30265C18.0993 10.2762 19.6754 11.8824 21.6122 11.8824L24.4875 11.9036C25.2637 11.9036 25.8956 12.5652 25.8956 13.3789V18.6232C25.8956 19.4369 25.2637 20.0985 24.4875 20.0985H22.3064V22.2029H24.4875C26.4243 22.2029 28 20.5971 28 18.6232V13.3789C27.9993 11.4043 26.4236 9.79848 24.4871 9.79848Z"
                fill="#259EF0"
                stroke="#259EF0"
                strokeWidth="2"
                mask="url(#path-2-inside-1_198_1276)"
            />
        </svg>
    );

    return (
        <Fragment>
            <ul className="nav navbar-nav align-items-center">
                <NavItem className="d-xl-none d-xxl-block d-xxl-none ">
                    <NavLink className="brand-logo sign-in-brand-logo" to="/">
                        {logoIcon}
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
                            <div className="user-nav ">
                                <span className="user-name fw-bold mb-1">{`${user?.firstName} ${user?.lastName}`}</span>
                                <span className="user-status">{user?.role}</span>
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
    // DEV NOTE: Remove once layout is complete in future sprints
    // const [menuData, setMenuData] = useState([])

    // ** For ServerSide navigation
    // useEffect(() => {
    //   axios.get(URL).then(response => setMenuData(response.data))
    // }, [])

    return (
        <Layout menuData={navigation} navbar={<CustomNavbar />} {...props}>
            {props.children}
        </Layout>
    );
};

export default VerticalLayout;
