import BreadCrumbsPage from "@components/breadcrumbs";
import { Card, CardBody, CardFooter, CardTitle } from "reactstrap";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQRCode } from "next-qrcode";
import { getTest, getUser } from "../../../services/api";

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
                    breadCrumbParent2={<Link to="/patients">Patient List</Link>}
                    breadCrumbParent3={<Link to={`/tests/patients/${patient?.account?.userId}`}>Test Results</Link>}
                    breadCrumbActive="Test Result Details"
                />
            )}
            <Card className="basic-card small-margin-card mx-auto">
                <CardBody>
                    <CardTitle className="mb-0">Test Result Details</CardTitle>
                </CardBody>
                <CardFooter>
                    {qrCode}
                    {patient && test && (
                        <div className="d-flex mb-1 mx-2">
                            <div className="me-2" style={{ fontWeight: 500 }}>
                                Patient ID:
                                <br />
                                Name:
                                <br />
                                Email:
                                <br />
                                Date:
                                <br />
                                Type:
                                <br />
                                Result:
                                <br />
                                Address:
                            </div>
                            <div>
                                {patient.account.userId}
                                <br />
                                {`${patient.firstName} ${patient.lastName}`}
                                <br />
                                {patient.account.email}
                                <br />
                                {new Date(test.testDate).toDateString()}
                                <br />
                                { test.testType == "ANTIGEN" ? test.testType.charAt(0) +  test.testType.substring(1).toLowerCase() : test.testType}
                                <br />
                                {test.result.charAt(0) +  test.result.substring(1).toLowerCase()}
                                <br />
                                {test.address.streetAddress}
                                <br />
                                {test.address.city}, {test.address.province} {test.address.postalCode}
                                <br />
                                {test.address.country}
                            </div>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

export default TestResult;
