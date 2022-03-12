import BreadCrumbsPage from "@components/breadcrumbs";
import { useSelector } from "react-redux";
import { Fragment, useState, useEffect } from "react";
import { Card, CardBody, CardText, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";
import { Activity, ChevronDown, Heart } from "react-feather";
import Avatar from "@components/avatar";
import { getPatientCounts } from "../../../services/api";

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
            )}
        </div>
    );
}

export default PatientsAssigned;
