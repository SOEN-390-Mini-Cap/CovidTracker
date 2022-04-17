import BreadCrumbsPage from "@components/breadcrumbs";
import { useSelector, useDispatch } from "react-redux";
import { Fragment, useState, useEffect } from "react";
import { Badge, Card, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Input, Label, Row, Col } from "reactstrap";
import DataTable from "react-data-table-component";
import { Flag, ChevronDown, MoreVertical} from "react-feather";
import { Link } from "react-router-dom";
import { getPatients, putPatientPrioritized } from "../../../services/api";
import ReactPaginate from "react-paginate";

import "@styles/react/libs/tables/react-dataTable-component.scss";

function PrioritizeFlag({ row, setPatients }) {
    const token = useSelector(selectToken);

    const onClick = async () => {
        await putPatientPrioritized(token, row.account.userId, !row.isPrioritized);

        const patients = await getPatients(token);
        setPatients(patients);
    };

    return <Flag color={row.isPrioritized ? "#EA5455" : "#5E5873"} size={20} onClick={onClick} />;
}

const selectToken = (state) => state.auth.userData.token;

function PatientList() {
    const token = useSelector(selectToken);
    const role = useSelector((state) => state.auth.userData.user.role);

    const [patients, setPatients] = useState(null);

    // ** States
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    let lowerBound = rowsPerPage*(currentPage+1)-rowsPerPage;
    let upperBound = rowsPerPage*(currentPage+1);  

    useEffect(() => {
        async function f() {
            const patients = await getPatients(token);
            setPatients(patients);
        }
        f();
    }, [token]);

    const columns = [
        {
            name: "ID",
            sortable: true,
            width: "80px",
            selector: (row) => row.account.userId,
        },
        {
            name: "Name",
            sortable: true,
            allowOverflow: true,
            minWidth: "300px",
            selector: (row) => (
                <Fragment>
                    <span className="fw-bold">
                        {row.firstName} {row.lastName}
                    </span>
                    <br /> {row.account.email}
                </Fragment>
            ),
        },
        {
            name: "Address",
            sortable: true,
            allowOverflow: true,
            minWidth: "380px",
            selector: (row) => (
                <Fragment>
                    {row.address.streetAddress}
                    <br />
                    {row.address.city}, {row.address.province} {row.address.postalCode}
                    <br />
                    {row.address.country}
                </Fragment>
            ),
        },
        {
            name: "Date of Birth",
            sortable: true,
            width: "200px",
            selector: (row) =>
                new Date(row.dateOfBirth).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
        },
        {
            name: "Gender",
            sortable: true,
            width: "160px",
            selector: (row) => (
                <Badge pill color={row.gender === "MALE" ? "light-info" : "light-danger"}>
                    { row.gender.charAt(0) +  row.gender.substring(1).toLowerCase()}
                </Badge>
            ),
        },
        {
            name: "Phone",
            sortable: true,
            width: "160px",
            selector: (row) => row.phoneNumber,
        },
        {
            name: "Actions",
            cell: (row) => {
                return (
                    <div className="d-flex">
                        <PrioritizeFlag row={row} setPatients={setPatients} />
                        <UncontrolledDropdown>
                            <DropdownToggle tag="span">
                                <MoreVertical color="#5E5873" size={20} />
                            </DropdownToggle>
                            <DropdownMenu end>
                                {(role === "DOCTOR" || role === "HEALTH_OFFICIAL") && (
                                    <DropdownItem
                                        tag={Link}
                                        to={`/add_test/patients/${row.account.userId}`}
                                        className="w-100"
                                    >
                                        Add Test Result
                                    </DropdownItem>
                                )}
                                <DropdownItem tag={Link} to={`/tests/patients/${row.account.userId}`} className="w-100">
                                    Test Results
                                </DropdownItem>
                                {role === "DOCTOR" && (
                                    <DropdownItem
                                        tag={Link}
                                        to={`/statuses/define/${row.account.userId}`}
                                        className="w-100"
                                    >
                                        Define Status Report
                                    </DropdownItem>
                                )}
                                {(role === "DOCTOR" || role === "HEALTH_OFFICIAL") && (
                                    <DropdownItem
                                        tag={Link}
                                        to={`/statuses/patients/${row.account.userId}`}
                                        className="w-100"
                                    >
                                        Status Reports
                                    </DropdownItem>
                                )}
                                {role === "DOCTOR" && (
                                    <DropdownItem
                                        tag={Link}
                                        to={`/create_appointment/${row.account.userId}`}
                                        className="w-100"
                                    >
                                        Book Appointment
                                    </DropdownItem>
                                )}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                );
            },
        },
    ];

    // ** Function to handle Pagination
    const handlePagination = (page) => {
        setCurrentPage(page.selected);
    };

    // ** Function to handle per page
    const handlePerPage = (e) => {
        setCurrentPage(0);
        setRowsPerPage(parseInt(e.target.value));
    };

    // ** Custom Pagination
    const CustomPagination = () => (
        <Row>
            <Col className="d-none d-sm-block" sm="5">
                <label className="justify-content-start ps-1 mt-2 mb-1" for="sort-select">Showing {lowerBound+1} to {lowerBound+dataToRender().length} of {patients.length} entries</label>
            </Col>
            <Col sm="7">
            <ReactPaginate
                nextLabel=""
                breakLabel="..."
                previousLabel=""
                pageRangeDisplayed={2}
                forcePage={currentPage}
                marginPagesDisplayed={2}
                activeClassName="active"
                pageClassName="page-item"
                breakClassName="page-item"
                nextLinkClassName="page-link"
                pageLinkClassName="page-link"
                breakLinkClassName="page-link"
                previousLinkClassName="page-link"
                nextClassName="page-item next-item"
                previousClassName="page-item prev-item"
                pageCount={Math.ceil(patients.length / rowsPerPage) || 1}                    
                onPageChange={(page) => handlePagination(page)}
                containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-center justify-content-sm-end pe-1 mt-1"
            />
            </Col>
        </Row>
    );

    // ** Table data to render
    const dataToRender = () => {
        if (patients.length) {
            return patients.slice(lowerBound, upperBound);;
        } else {
            return []
        }
    };

    return (
        <div>
            <BreadCrumbsPage
                breadCrumbTitle="Patient List"
                breadCrumbParent="Patient"
                breadCrumbActive="Patient List"
            />
            {patients && (
                <Fragment>
                <Card>
                <Row className="mx-0 mt-1 mb-50">
                    <Col sm="2">
                        <div className="d-flex align-items-center">
                            <Label className="me-1" for="sort-select">Show</Label>
                            <Input
                                className="dataTable-select"
                                type="select"
                                id="sort-select"
                                value={rowsPerPage}
                                onChange={(e) => handlePerPage(e)}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={75}>75</option>
                                <option value={100}>100</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <div className="react-dataTable">
                        <DataTable
                            noHeader
                            pagination
                            paginationServer
                            data={dataToRender()}
                            columns={columns}
                            className="react-dataTable"
                            sortIcon={<ChevronDown size={10} />}
                            paginationComponent={CustomPagination}
                            paginationDefaultPage={currentPage + 1}
                        />
                    </div>
                </Card>
                </Fragment>
            )}
        </div>
    );
}

export default PatientList;
