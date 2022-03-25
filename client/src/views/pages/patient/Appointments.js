import BreadCrumbsPage from "@components/breadcrumbs";
import { useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import {Card, CardBody, CardText, Col, Row} from "reactstrap";
import {Activity, ChevronDown, Heart} from "react-feather";
import DataTable from "react-data-table-component";
import { getAppointments } from "../../../services/api";
import Avatar from "../../../@core/components/avatar";

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
            <Card className="overflow-hidden">
                <div className="react-dataTable">
                    <DataTable
                        noHeader
                        pagination
                        data={appointments}
                        columns={columns}
                        className="react-dataTable"
                        sortIcon={<ChevronDown size={10} />}
                        paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
                    />
                </div>
            </Card>
        </div>
    );
}

export default Appointments;
