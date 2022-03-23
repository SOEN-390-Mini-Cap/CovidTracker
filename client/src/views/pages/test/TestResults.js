import BreadCrumbsPage from "@components/breadcrumbs";
import { useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { Badge, Card } from "reactstrap";
import { ChevronDown, Eye } from "react-feather";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import { getStatusReports, getTestResults, getUser } from "../../../services/api";

const columns = [
    {
        name: "#",
        sortable: true,
        width: "80px",
        selector: (row) => row.testId,
    },
    {
        name: "Date",
        sortable: true,
        selector: (row) =>
            new Date(row.testDate).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            }),
    },
    {
        name: "Type",
        sortable: true,
        selector: (row) => (
            <Badge pill color={row.testType === "ANTIGEN" ? "light-primary" : "light-warning"}>
                {row.testType}
            </Badge>
        ),
    },
    {
        name: "Result",
        sortable: true,
        selector: (row) => (
            <Badge pill color={row.result === "POSITIVE" ? "light-success" : "light-danger"}>
                {row.result}
            </Badge>
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
        name: "Actions",
        allowOverflow: true,
        width: "80px",
        cell: (row) => {
            return (
                <Link to={`/tests/${row.testId}`} className="m-auto">
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

function TestResults() {
    const { patientId } = useParams();
    const token = useSelector(selectToken);
    const role = useSelector(selectUserRole);
    const [testResults, setTestResults] = useState(null);
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        async function f() {
            const patient = await getUser(token, patientId);
            setPatient(patient);
            const testResults = await getTestResults(patientId, token);
            setTestResults(testResults);
        }
        f();
    }, [token, patientId]);

    return (
        <div>
            {patient &&
                (role === "PATIENT" ? (
                    <BreadCrumbsPage
                        breadCrumbTitle="Test Results"
                        breadCrumbParent="Patient"
                        breadCrumbActive="Test Results"
                    />
                ) : (
                    <BreadCrumbsPage
                        breadCrumbTitle={`${patient.firstName} ${patient.lastName}'s Test Results`}
                        breadCrumbParent="Patient"
                        breadCrumbParent2={<Link to="/patients">Patient List</Link>}
                        breadCrumbActive="Test Results"
                    />
                ))}
            <Card className="overflow-hidden">
                <div className="react-dataTable">
                    <DataTable
                        noHeader
                        pagination
                        data={testResults || []}
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

export default TestResults;
