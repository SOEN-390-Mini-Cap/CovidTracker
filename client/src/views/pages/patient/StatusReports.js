import BreadCrumbsPage from "@components/breadcrumbs";
import { useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { Card } from "reactstrap";
import { ChevronDown, Eye } from "react-feather";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import { getStatusReports, getUser } from "../../../services/api";

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
        minWidth: "300px",
        selector: (row) => row.statusBody.otherSymptoms,
    },
    {
        name: "Actions",
        allowOverflow: true,
        width: "80px",
        cell: (row) => {
            return (
                <Link to={`/statuses/${row.statusId}`} className="m-auto">
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
            <Card className="overflow-hidden">
                <div className="react-dataTable">
                    <DataTable
                        noHeader
                        pagination
                        data={statusReports || []}
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

export default StatusReports;
