import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
    // DropdownItem,
    // DropdownMenu,
    // DropdownToggle,
    // Table,
    // UncontrolledDropdown,
    Card,
    CardHeader,
    CardTitle,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
} from "reactstrap";
import { Archive, ChevronDown, Edit, Eye, FileText, MoreVertical, Trash } from "react-feather";
import DataTable from "react-data-table-component";

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
            cell: () => {
                return (
                    <div className="d-flex">
                        <UncontrolledDropdown>
                            <DropdownToggle className="pe-1" tag="span">
                                <Eye size={18} />
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem tag="a" href="/" className="w-100" onClick={(e) => e.preventDefault()}>
                                    <FileText size={15} />
                                    <span className="align-middle ms-50">Details</span>
                                </DropdownItem>
                                <DropdownItem tag="a" href="/" className="w-100" onClick={(e) => e.preventDefault()}>
                                    <Archive size={15} />
                                    <span className="align-middle ms-50">Archive</span>
                                </DropdownItem>
                                <DropdownItem tag="a" href="/" className="w-100" onClick={(e) => e.preventDefault()}>
                                    <Trash size={15} />
                                    <span className="align-middle ms-50">Delete</span>
                                </DropdownItem>
                            </DropdownMenu>
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
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle tag="h4">Zero Configuration</CardTitle>
            </CardHeader>
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

        /**
        <div>
            <Card className="card-company-table">
                <div style={{ margin: "10px" }}>
                    <div style={{ display: "inline-block", alignSelf: "center" }}>
                        <p>Show</p>
                    </div>
                    <div style={{ display: "inline-block", marginLeft: "15px", justifySelf: "center" }}>
                        <UncontrolledDropdown style={{ borderWidth: "3px" }}>
                            <DropdownToggle outline color="secondary" caret>
                                10
                            </DropdownToggle>
                            <DropdownMenu style={{ width: "100%" }}>
                                <DropdownItem style={{ width: "100%" }} onClick={(e) => e.preventDefault()}>
                                    10
                                </DropdownItem>
                                <DropdownItem style={{ width: "100%" }} onClick={(e) => e.preventDefault()}>
                                    25
                                </DropdownItem>
                                <DropdownItem style={{ width: "100%" }} onClick={(e) => e.preventDefault()}>
                                    50
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                </div>
                <Table bordered striped responsive>
                    <thead>
                        <tr>
                            <th className="sortable">#</th>
                            <th>Last Updated</th>
                            <th>Weight</th>
                            <th>Temperature</th>
                            <th>Symptoms</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statusReports.map((object) => (
                            <tr>
                                <td>{object.statusId}</td>
                                <td>{object.createdOn}</td>
                                <td>{object.statusBody.weight}</td>
                                <td>{object.statusBody.temperature}</td>
                                <td>{object.statusBody.otherSymptoms}</td>
                                <td>
                                    <UncontrolledDropdown>
                                        <DropdownToggle
                                            className="icon-btn hide-arrow"
                                            color="transparent"
                                            size="md"
                                            caret
                                        >
                                            <Eye size={19} />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                                                <Edit className="me-50" size={15} />
                                                <span className="align-middle">Edit</span>
                                            </DropdownItem>
                                            <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                                                <Trash className="me-50" size={15} />{" "}
                                                <span className="align-middle">Delete</span>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
         **/
    );
}

export default StatusReports;
