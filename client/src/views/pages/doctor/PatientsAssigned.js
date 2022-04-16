import BreadCrumbsPage from "@components/breadcrumbs";
import { useSelector } from "react-redux";
import { Fragment, useState, useEffect } from "react";
import { Card, CardBody, CardText, Col, Row, Input, Label} from "reactstrap";
import DataTable from "react-data-table-component";
import { Activity, ChevronDown, Heart } from "react-feather";
import Avatar from "@components/avatar";
import { getPatientCounts } from "../../../services/api";
import ReactPaginate from "react-paginate";

import "@styles/react/libs/tables/react-dataTable-component.scss";

const columns = [
    {
        name: "ID",
        sortable: true,
        maxWidth: "200px",
        minWidth: "20px",
        selector: (row) => row.doctorId,
    },
    {
        name: "Doctor",
        sortable: true,
        minWidth: "200px",
        selector: (row) => (
            <Fragment>
                <span className="fw-bold">{row.doctorName}</span>
                <br /> {row.doctorEmail}
            </Fragment>
        ),
    },
    {
        name: "Patients Assigned",
        sortable: true,
        minWidth: "170px",
        selector: (row) => row.numberOfPatients,
    },
];

const selectToken = (state) => state.auth.userData.token;

function PatientsAssigned() {
    const token = useSelector(selectToken);
    const [patientCounts, setPatientCounts] = useState(null);
    useEffect(() => {
        async function f() {
            const res = await getPatientCounts(token);
            setPatientCounts(res);
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
                <label className="justify-content-start ps-1 mt-2 mb-1" for="sort-select">Showing {lowerBound+1} to {lowerBound+dataToRender().length} of {patientCounts.counts.length} entries</label>
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
                pageCount={Math.ceil(patientCounts.counts.length / rowsPerPage) || 1}                    
                onPageChange={(page) => handlePagination(page)}
                containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-center justify-content-sm-end pe-1 mt-1"
            />
            </Col>
        </Row>
    );

    // ** Table data to render
    const dataToRender = () => {
        if (patientCounts.counts.length) {
            return patientCounts.counts.slice(lowerBound, upperBound);;
        } else {
            return []
        }
    };

    const PatientsAssignedCard = (
        <Card className="card-statistics">
            <CardBody className="statistics-body">
                <div className="d-flex align-items-center">
                    <div className="my-auto">
                        <h3 className="fw-bolder">{patientCounts?.total}</h3>
                        <CardText>Patients Assigned</CardText>
                    </div>
                    <Avatar color="light-danger" icon={<Heart size={24} />} className="ms-auto" />
                </div>
            </CardBody>
        </Card>
    );

    const PatientsPerDoctorCard = (
        <Card className="card-statistics">
            <CardBody className="statistics-body">
                <div className="d-flex align-items-center">
                    <div className="my-auto">
                        <h3 className="fw-bolder">{patientCounts?.average}</h3>
                        <CardText>Patients per Doctor</CardText>
                    </div>
                    <Avatar color="light-primary" icon={<Activity size={24} />} className="ms-auto" />
                </div>
            </CardBody>
        </Card>
    );

    return (
        <div>
            <BreadCrumbsPage
                breadCrumbTitle="Patients Assigned"
                breadCrumbParent="Doctor"
                breadCrumbActive="Patients Assigned"
            />
            <Row className="match-height">
                <Col md="4" xs="12">
                    {PatientsAssignedCard}
                </Col>
                <Col md="4" xs="12">
                    {PatientsPerDoctorCard}
                </Col>
            </Row>
            {patientCounts && (
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
                            // data={patientCounts.counts}
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
{/* 
            {patientCounts && (
                <Card className="overflow-hidden">
                    <div className="react-dataTable">
                        <DataTable
                            noHeader
                            pagination
                            data={patientCounts.counts}
                            columns={columns}
                            className="react-dataTable"
                            sortIcon={<ChevronDown size={10} />}
                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        />
                    </div>
                </Card>
            )} */}
        </div>
    );
}

export default PatientsAssigned;
