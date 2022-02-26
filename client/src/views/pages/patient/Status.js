import BreadCrumbsPage from "@components/breadcrumbs";
import { Button, Card, CardBody, CardFooter, CardTitle, Form, FormFeedback, Input, Label } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {Fragment, useEffect, useState} from "react";
import {useParams} from "react-router-dom";

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

    console.log(patient, status);

    return (
        <div>
            <BreadCrumbsPage
                breadCrumbTitle={`#${statusId} Status Report Details`}
                breadCrumbParent="Patient"
                breadCrumbParent2="Status Reports"
                breadCrumbActive="Status Report Details"
            />
            <Card className="basic-card status-report-fields-card mx-auto">
                <CardBody>
                    <CardTitle className="mb-0">Status Report Details</CardTitle>
                </CardBody>
                <CardFooter>
                    {status && patient && (
                        <Fragment>
                            <div className="d-flex mb-1">
                                <div className="w-50">
                                    Patient ID
                                    <br/>
                                    Name
                                    <br/>
                                    Email
                                    <br/>
                                    Temperature
                                    <br/>
                                    Weight
                                    <br/>
                                    Last Updated
                                </div>
                                <div className="w-50">
                                    {patient.account.userId}
                                    <br/>
                                    {`${patient.firstName} ${patient.lastName}`}
                                    <br/>
                                    {patient.account.email}
                                    <br/>
                                    {status.status.temperature}&deg;C
                                    <br/>
                                    {status.status.weight} lbs
                                    <br/>
                                    {new Date(status.createdOn).toDateString()}
                                </div>
                            </div>

                            <div className="d-flex mb-1">
                                <div className="w-50 me-1">
                                    <Label className="form-label">Primary Symptoms</Label>
                                    {primarySymptoms.map(
                                        (fieldData, key) =>
                                            (
                                                <div className="form-check" key={key}>
                                                    <Input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={status.status[fieldData.id]}
                                                    />
                                                    <Label className="form-check-label">{fieldData.name}</Label>
                                                </div>
                                            ),
                                    )}
                                </div>
                                <div>
                                    <Label className="form-label">Secondary Symptoms</Label>
                                    {secondarySymptoms.map(
                                        (fieldData, key) =>
                                            (
                                                <div className="form-check" key={key}>
                                                    <Input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={status.status[fieldData.id]}
                                                    />
                                                    <Label className="form-check-label">{fieldData.name}</Label>
                                                </div>
                                            ),
                                    )}
                                </div>
                            </div>

                            <div className="mb-2">
                                Other Symptoms
                                <br/>
                                {status.status.otherSymptoms}
                            </div>
                        </Fragment>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

export default Status;
