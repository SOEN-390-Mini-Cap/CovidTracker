import BreadCrumbsPage from "@components/breadcrumbs";
import { useSelector } from "react-redux";
import { Fragment, useState, useEffect } from "react";
import { Card, Input } from "reactstrap";
import DataTable from "react-data-table-component";
import { Eye, ChevronDown } from "react-feather";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getPatients, getStatuses, putStatusReviewed } from "../../../services/api";

const columns = (statuses, setStatuses) => [
    {
        width: "80px",
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

function ReviewCheckbox({ row, statuses, setStatuses }) {
    const token = useSelector(selectToken);

    const onChange = async () => {
        await putStatusReviewed(token, row.statusId, !row.isReviewed);
        toast.success(!row.isReviewed ? "Status marked as reviewed" : "Status marked as unreviewed", {
            position: "top-right",
            autoClose: 2000,
        });

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
                            columns={columns(statuses, setStatuses)}
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
