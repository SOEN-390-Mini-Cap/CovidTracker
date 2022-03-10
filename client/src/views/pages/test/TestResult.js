import BreadCrumbsPage from "@components/breadcrumbs";
import { Card, CardBody, CardFooter, CardTitle, Input, Label } from "reactstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQRCode } from "next-qrcode";

async function getTest(token, testId) {
    const res = await axios.get(`http://localhost:8080/tests/${testId}`, {
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

function TestResult() {
    const { testId } = useParams();
    const token = useSelector(selectToken);
    const role = useSelector(selectRole);
    const [test, setTest] = useState(null);
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        async function f() {
            const test = await getTest(token, testId);
            setTest(test);
            const patient = await getUser(token, test.patientId);
            setPatient(patient);
        }
        f();
    }, [token, testId]);

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

    console.log(patient, test);

    return (
        <div>
            {role === "PATIENT" ? (
                <BreadCrumbsPage
                    breadCrumbTitle={`#${testId} Test Result Details`}
                    breadCrumbParent="Patient"
                    breadCrumbParent2={<Link to={`/tests/patients/${patient?.account?.userId}`}>Test Results</Link>}
                    breadCrumbActive="Test Result Details"
                />
            ) : (
                <BreadCrumbsPage
                    breadCrumbTitle={`#${testId} Test Result Details`}
                    breadCrumbParent="Patient"
                    breadCrumbParent2="Patient List"
                    breadCrumbParent3={<Link to={`/tests/patients/${patient?.account?.userId}`}>Test Results</Link>}
                    breadCrumbActive="Test Result Details"
                />
            )}
            <Card className="basic-card status-report-fields-card mx-auto">
                <CardBody>
                    <CardTitle className="mb-0">Test Result Details</CardTitle>
                </CardBody>
                <CardFooter>
                    {qrCode}
                    <p>Hello World!</p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default TestResult;
