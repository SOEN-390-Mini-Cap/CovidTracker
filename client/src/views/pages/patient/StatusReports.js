import BreadCrumbsPage from "@components/breadcrumbs";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Card, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { ChevronDown, Eye } from "react-feather";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

async function getStatusReports(patientId, token) {
    const res = await axios.get(`http://localhost:8080/statuses/patients/${patientId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

const selectToken = (state) => state.auth.userData.token;
const selectUserId = (state) => state.auth.userData.user.account.userId;

function StatusReports() {
    const token = useSelector(selectToken);
    const userId = useSelector(selectUserId);
    const [statusReports, setStatusReports] = useState(null);
    const [isDataLoaded, setDataLoaded] = useState(false);
    const columns = [
        {
            name: "ID",
            sortable: true,
            maxWidth: "100px",
            selector: (row) => row.statusId,
        },
        {
            name: "Last Updated",
            sortable: true,
            minWidth: "225px",
            selector: (row) => row.createdOn,
        },
        {
            name: "Weight",
            sortable: true,
            minWidth: "50px",
            selector: (row) => row.statusBody.weight,
        },
        {
            name: "Temperature",
            sortable: true,
            minWidth: "50px",
            selector: (row) => row.statusBody.temperature,
        },
        {
            name: "Symptoms",
            sortable: true,
            minWidth: "450px",
            selector: (row) => row.statusBody.otherSymptoms,
        },
        {
            name: "Actions",
            allowOverflow: true,
            cell: (index) => {
                return (
                    <div className="d-flex">
                        <UncontrolledDropdown>
                            <DropdownToggle href={"/statuses/" + index.statusId} className="pe-1" tag="a">
                                <Eye size={18} />
                            </DropdownToggle>
                        </UncontrolledDropdown>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        async function f() {
            const statusReports = await getStatusReports(userId, token);
            setStatusReports(statusReports);
            setDataLoaded(true);
            console.log(statusReports);
        }
        f();
    }, [token, userId]);
    if (!isDataLoaded) {
        return <div></div>;
    }
    return (
        <div>
            <BreadCrumbsPage
                breadCrumbTitle="Status Reports"
                breadCrumbParent="Patient"
                breadCrumbActive="Status Reports"
            />
            <Card className="overflow-hidden">
                <div className="react-dataTable">
                    <DataTable
                        noHeader
                        pagination
                        data={statusReports}
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
