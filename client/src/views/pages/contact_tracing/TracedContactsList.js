import BreadCrumbsPage from "@components/breadcrumbs";
import { useSelector } from "react-redux";
import { Fragment, useState, useEffect } from "react";
import { Badge, Card, Col, Label, Row } from "reactstrap";
import DataTable from "react-data-table-component";
import { ChevronDown, Send } from "react-feather";
import { getTracedPatientsByDate, postEmail, postSMS } from "../../../services/api";
import Flatpickr from "react-flatpickr";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "@styles/react/libs/flatpickr/flatpickr.scss";

const selectToken = (state) => state.auth.userData.token;

export default function ContactTracing() {
    const { patientId } = useParams();
    const token = useSelector(selectToken);

    const [displayRange, setDisplayRange] = useState([]);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        async function f() {
            const from = displayRange[0] || new Date("1900-01-01 00:00:0.000000 +00:00");
            const to = displayRange[1] || new Date();
            const patients = await getTracedPatientsByDate(token, patientId, from, to);
            setPatients(patients);
        }
        f();
    }, [token, patientId, displayRange]);

    const notificationBody = `You have been contact traced by the CovidTracker system. Someone you have been in contact with between the dates of ${displayRange[0]} and ${displayRange[1]} has tested positive for Covid-19. You should contact your doctor and self quarantine for the next 2 weeks.`;

    const columns = [
        {
            name: "Contact Date",
            sortable: true,
            maxWidth: "200px",
            selector: (row) =>
                new Date(row.contactDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                }),
        },
        {
            name: "ID",
            sortable: true,
            width: "80px",
            selector: (row) => row.account.userId,
        },
        {
            name: "Name",
            sortable: true,
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
            width: "140px",
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
            width: "100px",
            selector: (row) => (
                <Badge pill color={row.gender === "MALE" ? "light-info" : "light-danger"}>
                    {row.gender}
                </Badge>
            ),
        },
        {
            name: "Phone",
            sortable: true,
            width: "140px",
            selector: (row) => row.phoneNumber,
        },
        {
            name: "Notify",
            allowOverflow: true,
            width: "80px",
            cell: (row) => (
                <div className="m-auto">
                    <Send
                        size={18}
                        color="#5E5873"
                        onClick={() => {
                            postSMS(token, row.account.userId, notificationBody);
                            postEmail(
                                token,
                                row.account.userId,
                                "CovidTracker Alert: Contact trace update",
                                notificationBody,
                            );
                            toast.success(`Patient ${row.firstName} ${row.lastName} notified`, {
                                position: "top-right",
                                autoClose: 3000,
                            });
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <div>
            <BreadCrumbsPage
                breadCrumbTitle="Contacts"
                breadCrumbParent="Patient"
                breadCrumbParent2={<Link to="/contact_tracing">Contact Tracing</Link>}
                breadCrumbActive="Contacts"
            />
            {patients && (
                <Card className="overflow-hidden">
                    <Row className="mt-1 mb-50 d-flex justify-content-end">
                        <Col lg="4" md="6" className="d-flex align-items-center">
                            <Label className="form-label" for="resultDate" style={{ whiteSpace: "nowrap" }}>
                                Contact Date
                            </Label>
                            <Flatpickr
                                className="form-control mx-2"
                                id="resultDate"
                                value={displayRange}
                                options={{ mode: "range", dateFormat: "m/d/Y" }}
                                onChange={(range) => setDisplayRange(range)}
                            />
                        </Col>
                    </Row>
                    <div className="react-dataTable">
                        <DataTable
                            noHeader
                            pagination
                            data={patients}
                            columns={columns}
                            className="react-dataTable"
                            sortIcon={<ChevronDown size={10} />}
                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        />
                    </div>
                </Card>
            )}
        </div>
    );
}
