import BreadCrumbsPage from "@components/breadcrumbs";
import { Card, CardBody, CardFooter, CardTitle, Input, Label } from "reactstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQRCode } from "next-qrcode";

async function getStatus(token, statusId) {
    const res = await axios.get(`http://localhost:8080/statuses/${statusId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

async function getUser(token, userId) {
    const res = await axios.get(`http://localhost:8080/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

const selectToken = (state) => state.auth.userData.token;
const selectRole = (state) => state.auth.userData.user.role;

const primarySymptoms = [
    {
        name: "Fever",
        id: "fever",
    },
    {
        name: "Cough",
        id: "cough",
    },
    {
        name: "Shortness of Breath",
        id: "shortnessOfBreath",
    },
    {
        name: "Loss of Taste and Smell",
        id: "lossOfTasteAndSmell",
    },
];
const secondarySymptoms = [
    {
        name: "Nausea",
        id: "nausea",
    },
    {
        name: "Stomach Aches",
        id: "stomachAches",
    },
    {
        name: "Vomiting",
        id: "vomiting",
    },
    {
        name: "Headache",
        id: "headache",
    },
    {
        name: "Muscle Pain",
        id: "musclePain",
    },
    {
        name: "Sore Throat",
        id: "soreThroat",
    },
];

function Status() {
    const { statusId } = useParams();
    const token = useSelector(selectToken);
    const role = useSelector(selectRole);
    const [status, setStatus] = useState(null);
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        async function f() {
            const status = await getStatus(token, statusId);
            setStatus(status);
            const patient = await getUser(token, status.patientId);
            setPatient(patient);
        }
        f();
    }, [token, statusId]);

    const { Image } = useQRCode();
    const qrCode = (
        <div className="d-flex justify-content-center my-2">
            <Image
                text={window.location.href}
                options={{
                    width: 175,
                    margin: 0,
                }}
            />
        </div>
    );

    return (
        <div>
            {role === "PATIENT" ? (
                <BreadCrumbsPage
                    breadCrumbTitle={`#${statusId} Status Report Details`}
                    breadCrumbParent="Patient"
                    breadCrumbParent2={
                        <Link to={`/statuses/patients/${patient?.account?.userId}`}>Status Reports</Link>
                    }
                    breadCrumbActive="Status Report Details"
                />
            ) : (
                <BreadCrumbsPage
                    breadCrumbTitle={`#${statusId} Status Report Details`}
                    breadCrumbParent="Patient"
                    breadCrumbParent2="Patient List"
                    breadCrumbParent3={
                        <Link to={`/statuses/patients/${patient?.account?.userId}`}>Status Reports</Link>
                    }
                    breadCrumbActive="Status Report Details"
                />
            )}
            <Card className="basic-card status-report-fields-card mx-auto">
                <CardBody>
                    <CardTitle className="mb-0">Status Report Details</CardTitle>
                </CardBody>
                <CardFooter>
                    {qrCode}
                    {status && patient && (
                        <Fragment>
                            <div className="d-flex mb-1">
                                <div className="me-2">
                                    Patient ID
                                    <br />
                                    Name
                                    <br />
                                    Email
                                    <br />
                                    Temperature
                                    <br />
                                    Weight
                                    <br />
                                    Last Updated
                                </div>
                                <div>
                                    {patient.account.userId}
                                    <br />
                                    {`${patient.firstName} ${patient.lastName}`}
                                    <br />
                                    {patient.account.email}
                                    <br />
                                    {status.statusBody.temperature} &deg;C
                                    <br />
                                    {status.statusBody.weight} lbs
                                    <br />
                                    {new Date(status.createdOn).toDateString()}
                                </div>
                            </div>

                            <div className="d-flex mb-1">
                                <div className="w-50 me-1">
                                    <Label className="form-label">Primary Symptoms</Label>
                                    {primarySymptoms.map((fieldData, key) => (
                                        <div className="form-check" key={key}>
                                            <Input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={status.statusBody[fieldData.id]}
                                                readOnly={true}
                                            />
                                            <Label className="form-check-label">{fieldData.name}</Label>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <Label className="form-label">Secondary Symptoms</Label>
                                    {secondarySymptoms.map((fieldData, key) => (
                                        <div className="form-check" key={key}>
                                            <Input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={status.statusBody[fieldData.id]}
                                                readOnly={true}
                                            />
                                            <Label className="form-check-label">{fieldData.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-2">
                                Other Symptoms
                                <br />
                                {status.statusBody.otherSymptoms}
                            </div>
                        </Fragment>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

export default Status;
