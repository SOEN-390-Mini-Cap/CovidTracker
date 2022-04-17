import BreadCrumbsPage from "@components/breadcrumbs";
import { useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { Card, CardBody, CardText, Col, Row, Input, Label } from "reactstrap";
import { Activity, ChevronDown, Heart } from "react-feather";
import DataTable from "react-data-table-component";
import { getAppointments } from "../../../services/api";
import Avatar from "../../../@core/components/avatar";
import ReactPaginate from "react-paginate";

import "@styles/react/libs/tables/react-dataTable-component.scss";

const selectToken = (state) => state.auth.userData.token;
const selectUserRole = (state) => state.auth.userData.user.role;

function Appointments() {
    const token = useSelector(selectToken);
    const role = useSelector(selectUserRole);
    const [appointments, setAppointments] = useState([]);
    useEffect(() => {
        async function f() {
            const appointments = await getAppointments(token);
            setAppointments(appointments);
        }
        f();
    }, [token]);

    const columns = [
        {
            name: "Start date",
            sortable: true,
            selector: (row) =>
                new Date(row.startDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                }),
        },
        {
            name: "End date",
            sortable: true,
            selector: (row) =>
                new Date(row.endDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                }),
        },
        {
            name: role === "DOCTOR" ? "Patient" : "Doctor",
            sortable: true,
            minWidth: "280px",
            selector: (row) => {
                const userDetails = role === "DOCTOR" ? row.patientDetails : row.doctorDetails;
                return (
                    <Fragment>
                        <span className="fw-bold">{userDetails.name}</span>
                        <br />
                        {userDetails.email}
                    </Fragment>
                );
            },
        },
        {
            name: "Address",
            sortable: true,
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
    ];

    // ** States
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    let lowerBound = rowsPerPage*(currentPage+1)-rowsPerPage;
    let upperBound = rowsPerPage*(currentPage+1);  

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
                <label className="justify-content-start ps-1 mt-2 mb-1" for="sort-select">Showing {lowerBound+1} to {lowerBound+dataToRender().length} of {appointments.length} entries</label>
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
                pageCount={Math.ceil(appointments.length / rowsPerPage) || 1}                    
                onPageChange={(page) => handlePagination(page)}
                containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-center justify-content-sm-end pe-1 mt-1"
            />
            </Col>
        </Row>
    );

    // ** Table data to render
    const dataToRender = () => {
        if (appointments.length) {
            return appointments.slice(lowerBound, upperBound);;
        } else {
            return []
        }
    };

    const TotalAppointmentsCard = (
        <Card className="card-statistics">
            <CardBody className="statistics-body">
                <div className="d-flex align-items-center">
                    <div className="my-auto">
                        <h3 className="fw-bolder">{appointments.length}</h3>
                        <CardText>Total Appointments</CardText>
                    </div>
                    <Avatar color="light-danger" icon={<Heart size={24} />} className="ms-auto" />
                </div>
            </CardBody>
        </Card>
    );

    const TodayAppointments = (
        <Card className="card-statistics">
            <CardBody className="statistics-body">
                <div className="d-flex align-items-center">
                    <div className="my-auto">
                        <h3 className="fw-bolder">
                            {
                                appointments.filter((a) => {
                                    const today = new Date();
                                    const appointmentDate = new Date(a?.startDate);
                                    return (
                                        appointmentDate.getFullYear() === today.getFullYear() &&
                                        appointmentDate.getMonth() === today.getMonth() &&
                                        appointmentDate.getDate() === today.getDate()
                                    );
                                }).length
                            }
                        </h3>
                        <CardText>Appointments Today</CardText>
                    </div>
                    <Avatar color="light-primary" icon={<Activity size={24} />} className="ms-auto" />
                </div>
            </CardBody>
        </Card>
    );

    return (
        <div>
            <BreadCrumbsPage
                breadCrumbTitle="Appointments"
                breadCrumbParent="Patient"
                breadCrumbActive="Appointments"
            />
            {role === "DOCTOR" && (
                <Row className="match-height">
                    <Col md="4" xs="12">
                        {TotalAppointmentsCard}
                    </Col>
                    <Col md="4" xs="12">
                        {TodayAppointments}
                    </Col>
                </Row>
            )}
            {appointments && (
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

export default Appointments;
