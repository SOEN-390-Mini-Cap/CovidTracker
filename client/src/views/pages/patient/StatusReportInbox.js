import BreadCrumbsPage from "@components/breadcrumbs";
import axios from "axios";
import { useSelector } from "react-redux";
import {Fragment, useState, useEffect, forwardRef} from "react";
import {Card, Input} from "reactstrap";
import DataTable from "react-data-table-component";
import { Eye, ChevronDown } from "react-feather";
import { Link } from "react-router-dom";

const columns = [
    {
        width: "80px",
        selector: (row) => {
            const x = () => {
                console.log(row);
            };
            return (
                <div className="form-check" onClick={x}>
                    <Input type="checkbox" />
                </div>
            );
        },
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
        minWidth: "280px",
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

async function getStatuses(token) {
    const res = await axios.get("http://localhost:8080/statuses", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

async function getPatients(token) {
    const res = await axios.get("http://localhost:8080/patients", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

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

    return (
        <div>
            <BreadCrumbsPage
                breadCrumbTitle="Status Report Inbox"
                breadCrumbParent="Patient"
                breadCrumbActive="Status Report Inbox"
            />
            {statuses && (
                <Card className="overflow-hidden">
                    <div className="react-dataTable">
                        <DataTable
                            noHeader
                            pagination
                            data={statuses}
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

export default StatusReportInbox;
