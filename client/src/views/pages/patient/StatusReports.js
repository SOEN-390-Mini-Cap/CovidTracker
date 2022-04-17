import BreadCrumbsPage from "@components/breadcrumbs";
import { useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { Card, Input, Label, Row, Col  } from "reactstrap";
import { ChevronDown, Eye } from "react-feather";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import { getStatusReports, getUser } from "../../../services/api";
import ReactPaginate from "react-paginate";

import "@styles/react/libs/tables/react-dataTable-component.scss";

const columns = [
    {
        name: "#",
        sortable: true,
        width: "80px",
        selector: (row) => row.statusId,
    },
    {
        name: "Last Updated",
        sortable: true,
        width: "200px",
        selector: (row) =>
            new Date(row.createdOn).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            }),
    },
    {
        name: "Weight",
        sortable: true,
        width: "120px",
        selector: (row) => `${row.statusBody.weight} lbs`,
    },
    {
        name: "Temperature",
        sortable: true,
        width: "140px",
        selector: (row) => <Fragment>{row.statusBody.temperature} &deg;C</Fragment>,
    },
    {
        name: "Symptoms",
        sortable: true,
        wrap: true,
        minWidth: "760px",
        selector: (row) => row.statusBody.otherSymptoms,
    },
    {
        name: "Actions",
        allowOverflow: true,
        cell: (row) => {
            return (
                <Link to={`/statuses/${row.statusId}`}>
                    <div>
                        <Eye color="#5E5873" size={20} />
                    </div>
                </Link>
            );
        },
    },
];

const selectToken = (state) => state.auth.userData.token;
const selectUserRole = (state) => state.auth.userData.user.role;

function StatusReports() {
    const { patientId } = useParams();
    const token = useSelector(selectToken);
    const role = useSelector(selectUserRole);
    const [statusReports, setStatusReports] = useState(null);
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        async function f() {
            const patient = await getUser(token, patientId);
            setPatient(patient);
            const statusReports = await getStatusReports(patientId, token);
            setStatusReports(statusReports);
        }
        f();
    }, [token, patientId]);

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
                <label className="justify-content-start ps-1 mt-2 mb-1" for="sort-select">Showing {lowerBound+1} to {lowerBound+dataToRender().length} of {statusReports.length} entries</label>
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
                pageCount={Math.ceil(statusReports.length / rowsPerPage) || 1}                    
                onPageChange={(page) => handlePagination(page)}
                containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-center justify-content-sm-end pe-1 mt-1"
            />
            </Col>
        </Row>
    );

    // ** Table data to render
    const dataToRender = () => {
        if (statusReports.length) {
            return statusReports.slice(lowerBound, upperBound);;
        } else {
            return []
        }
    };

    return (
        <div>
            {patient &&
                (role === "PATIENT" ? (
                    <BreadCrumbsPage
                        breadCrumbTitle="Status Reports"
                        breadCrumbParent="Patient"
                        breadCrumbActive="Status Reports"
                    />
                ) : (
                    <BreadCrumbsPage
                        breadCrumbTitle={`${patient.firstName} ${patient.lastName}'s Status Reports`}
                        breadCrumbParent="Patient"
                        breadCrumbParent2={<Link to="/patients">Patient List</Link>}
                        breadCrumbActive="Status Reports"
                    />
                ))}
            {statusReports && (
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

export default StatusReports;
