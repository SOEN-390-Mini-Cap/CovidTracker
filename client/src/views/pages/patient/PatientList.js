import BreadCrumbsPage from "@components/breadcrumbs";
import axios from "axios";
import { useSelector } from "react-redux";
import { Fragment, useState, useEffect } from "react";
import {Badge, Card, CardBody, CardText, Col, Row} from "reactstrap";
import DataTable from "react-data-table-component";
import { Activity, ChevronDown, Heart } from "react-feather";
import Avatar from "@components/avatar";

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
                <span className="fw-bold">
                    {row.firstName} {row.lastName}
                </span>
                <br /> {row.account.email}
            </Fragment>
        ),
    },
    {
        name: "Date of Birth",
        sortable: true,
        selector: (row) => new Date(row.dateOfBirth).toDateString(),
    },
    {
        name: "Gender",
        sortable: true,
        selector: (row) => (
            <Badge pill color={row.gender === "MALE" ? "light-info" : "light-danger"}>
                {row.gender}
            </Badge>
        ),
    },
    {
        name: "Phone",
        sortable: true,
        selector: (row) => row.phoneNumber,
    },
    {
        name: "Actions",
        width: "120px",
        selector: (row) => (
            <Fragment>
                <span className="fw-bold">
                    action
                </span>
            </Fragment>
        ),
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

    console.log(patients)

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
