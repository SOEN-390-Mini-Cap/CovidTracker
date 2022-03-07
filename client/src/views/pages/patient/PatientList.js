import BreadCrumbsPage from "@components/breadcrumbs";
import axios from "axios";
import { useSelector } from "react-redux";
import { Fragment, useState, useEffect } from "react";
import {
    Badge,
    Card,
    CardBody,
    CardText,
    Col,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Row,
    UncontrolledDropdown,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { Archive, ChevronDown, Edit, FileText, MoreVertical, Trash } from "react-feather";
import { Link } from "react-router-dom";

const columns = [
    {
        name: "ID",
        sortable: true,
        width: "80px",
        selector: (row) => row.account.userId,
    },
    {
        name: "Name",
        sortable: true,
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
        width: "140px",
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
        width: "100px",
        selector: (row) => (
            <Badge pill color={row.gender === "MALE" ? "light-info" : "light-danger"}>
                {row.gender}
            </Badge>
        ),
    },
    {
        name: "Phone",
        sortable: true,
        width: "140px",
        selector: (row) => row.phoneNumber,
    },
    {
        name: "Actions",
        allowOverflow: true,
        width: "80px",
        cell: (row) => {
            return (
                <div className="d-flex">
                    <UncontrolledDropdown>
                        <DropdownToggle className="pe-1" tag="span">
                            <MoreVertical size={15} />
                        </DropdownToggle>
                        <DropdownMenu end>
                            <DropdownItem tag={Link} to={`/add_test/patients/${row.account.userId}`} className="w-100">
                                Add Test Result
                            </DropdownItem>
                            <DropdownItem tag={Link} to={`/tests/patients/${row.account.userId}`} className="w-100">
                                Test Results
                            </DropdownItem>
                            <DropdownItem tag={Link} to={`/statuses/patients/${row.account.userId}`} className="w-100">
                                Status Reports
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            );
        },
    },
];

const selectToken = (state) => state.auth.userData.token;

async function getPatients(token) {
    const res = await axios.get("http://localhost:8080/patients", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

function PatientList() {
    const token = useSelector(selectToken);
    const [patients, setPatients] = useState(null);
    useEffect(() => {
        async function f() {
            const patients = await getPatients(token);
            setPatients(patients);
        }
        f();
    }, [token]);

    return (
        <div>
            <BreadCrumbsPage
                breadCrumbTitle="Patient List"
                breadCrumbParent="Patient"
                breadCrumbActive="Patient List"
            />
            {patients && (
                <Card className="overflow-hidden">
                    <div className="react-dataTable">
                        <DataTable
                            noHeader
                            pagination
                            data={patients}
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

export default PatientList;
