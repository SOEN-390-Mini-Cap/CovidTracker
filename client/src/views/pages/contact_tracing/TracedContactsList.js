import BreadCrumbsPage from "@components/breadcrumbs";
import { useSelector } from "react-redux";
import { Fragment, useState, useEffect } from "react";
import { Badge, Card, Col, Label, Row, Input } from "reactstrap";
import DataTable from "react-data-table-component";
import { ChevronDown, Send } from "react-feather";
import { getTracedPatientsByDate, postEmail, postSMS } from "../../../services/api";
import Flatpickr from "react-flatpickr";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

import "@styles/react/libs/tables/react-dataTable-component.scss";
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
            name: "ID",
            sortable: true,
            width: "80px",
            selector: (row) => row.account.userId,
        },
        {
            name: "Contact Date",
            sortable: true,
            wrap: true,
            width: "180px",
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
            name: "Name",
            sortable: true,
            minWidth: "260px",
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
            minWidth: "370px",
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
            width: "170px",
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
            width: "130px",
            selector: (row) => (
                <Badge pill color={row.gender === "MALE" ? "light-info" : "light-danger"}>
                    {row.gender.charAt(0) +  row.gender.substring(1).toLowerCase()}
                </Badge>
            ),
        },
        {
            name: "Phone",
            sortable: true,
            width: "130px",
            selector: (row) => row.phoneNumber,
        },
        {
            name: "Notify",
            allowOverflow: true,
            cell: (row) => (
                <div>
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
                breadCrumbTitle="Contacts"
                breadCrumbParent="Patient"
                breadCrumbParent2={<Link to="/contact_tracing">Contact Tracing</Link>}
                breadCrumbActive="Contacts"
            />
            {patients && (
                <Fragment>
                <Card>
                <Row className="mx-0 mt-1 mb-50">
                    <Col sm="8">
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
                    <Col className="d-flex align-items-center mt-1 mt-sm-0">
                        <Label className="form-label" for="resultDate" style={{ whiteSpace: "nowrap" }}>
                            Contact Date
                        </Label>
                        <Flatpickr
                            className="form-control mx-2"
                            id="resultDate"
                            value={displayRange}
                            options={{ mode: "range", dateFormat: "m/d/Y", maxDate: new Date() }}
                            placeholder="MM/DD/YYYY to MM/DD/YYYY"
                            onChange={(range) => setDisplayRange(range)}
                        />
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
