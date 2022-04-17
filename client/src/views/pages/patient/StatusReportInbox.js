import BreadCrumbsPage from "@components/breadcrumbs";
import { useSelector } from "react-redux";
import { Fragment, useState, useEffect } from "react";
import { Card, Input, Label, Row, Col } from "reactstrap";
import DataTable from "react-data-table-component";
import { Eye, ChevronDown } from "react-feather";
import { Link } from "react-router-dom";
import { getPatients, getStatuses, putStatusReviewed } from "../../../services/api";
import ReactPaginate from "react-paginate";

import "@styles/react/libs/tables/react-dataTable-component.scss";

const columns = (statuses, setStatuses) => [
    {
        width: "60px",
        selector: (row) => <ReviewCheckbox statuses={statuses} setStatuses={setStatuses} row={row} />,
    },
    {
        name: "#",
        sortable: true,
        width: "80px",
        selector: (row) => row.statusId,
    },
    {
        name: "Name",
        sortable: true,
        allowOverflow: true,
        minWidth: "300px",
        selector: (row) => (
            <Fragment>
                <span className="fw-bold">
                    {row.patient.firstName} {row.patient.lastName}
                </span>
                <br />
                {row.patient.account.email}
            </Fragment>
        ),
    },
    {
        name: "Weight",
        sortable: true,
        selector: (row) => `${row.statusBody.weight} lbs`,
    },
    {
        name: "Temperature",
        sortable: true,
        selector: (row) => <Fragment>{row.statusBody.temperature} &deg;C</Fragment>,
    },
    {
        name: "Last Updated",
        sortable: true,
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
        name: "Actions",
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

function ReviewCheckbox({ row, statuses, setStatuses }) {
    const token = useSelector(selectToken);

    const onChange = async () => {
        await putStatusReviewed(token, row.statusId, !row.isReviewed);

        const patientStatuses = statuses.map((status) => {
            if (status.statusId === row.statusId) {
                return {
                    ...status,
                    isReviewed: !row.isReviewed,
                };
            }
            return status;
        });
        setStatuses(patientStatuses);
    };

    return (
        <div className="form-check">
            <Input type="checkbox" checked={row.isReviewed} onChange={onChange} />
        </div>
    );
}

const selectToken = (state) => state.auth.userData.token;

function StatusReportInbox() {
    const token = useSelector(selectToken);
    const [statuses, setStatuses] = useState(null);

    useEffect(() => {
        async function f() {
            const statuses = await getStatuses(token);
            const patients = await getPatients(token);

            const patientStatuses = statuses.map((status) => {
                const patient = patients.find((p) => p.account.userId === status.patientId);
                return {
                    ...status,
                    patient,
                };
            });

            setStatuses(patientStatuses);
        }
        f();
    }, [token]);

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
                <label className="justify-content-start ps-1 mt-2 mb-1" for="sort-select">Showing {lowerBound+1} to {lowerBound+dataToRender().length} of {statuses.length} entries</label>
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
                pageCount={Math.ceil(statuses.length / rowsPerPage) || 1}                    
                onPageChange={(page) => handlePagination(page)}
                containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-center justify-content-sm-end pe-1 mt-1"
            />
            </Col>
        </Row>
    );

    // ** Table data to render
    const dataToRender = () => {
        if (statuses.length) {
            return statuses.slice(lowerBound, upperBound);;
        } else {
            return []
        }
    };

    return (
        <div>
            <BreadCrumbsPage
                breadCrumbTitle="Status Report Inbox"
                breadCrumbParent="Patient"
                breadCrumbActive="Status Report Inbox"
            />
            {statuses && (
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
                            columns={columns(statuses, setStatuses)}
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

export default StatusReportInbox;
