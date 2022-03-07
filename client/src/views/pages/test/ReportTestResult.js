import BreadCrumbsPage from "@components/breadcrumbs";
import { Button, Card, CardBody, CardFooter, CardTitle, Col, Form, FormFeedback, Input, Label, Row } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { selectThemeColors } from "@utils";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function ReportTestResult() {
    async function submitTestResult(data, patientId, token) {
        await axios.post(
            `http://localhost:8080/tests/patients/${patientId}`,
            {
                result: data.testResult.value,
                testType: data.typeOfTest.value,
                testDate: data.dateOfTest.toISOString(),
                streetAddress: data.address,
                streetAddressLineTwo: data.addressLine2,
                city: data.city,
                postalCode: data.postalCode,
                province: data.province.value,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
    }

    const selectToken = (state) => state.auth.userData.token;
    const token = useSelector(selectToken);

    const defaultValues = {
        testResult: null,
        typeOfTest: null,
        dateOfTest: "",
        address: "",
        addressLine2: "",
        city: "",
        postalCode: "",
        province: "",
    };

    const ReportTestSchema = yup
        .object()
        .shape({
            testResult: yup
                .object({
                    label: yup.string().required("Select a test result."),
                    value: yup.string().required("Select a test result."),
                })
                .nullable("Select a test result.")
                .required("Select a test result."),
            typeOfTest: yup
                .object({
                    label: yup.string().required("Select a type of test."),
                    value: yup.string().required("Select a type of test."),
                })
                .nullable("Select a test result.")
                .required("Select a test result."),
            dateOfTest: yup.date().required("Enter a date of test.").typeError("Enter a date of test."),
            address: yup
                .string()
                .required("Enter an address.")
                .max(100, "Address must be 100 characters long or less."),
            addressLine2: yup.string().max(100, "Address must be 100 characters long or less."),
            postalCode: yup.string().required("Enter a valid postal code."),
            province: yup
                .object({
                    label: yup.string().required("Select a province."),
                    value: yup.string().required("Select a province."),
                })
                .nullable("Select a province.")
                .required("Select a province."),
        })
        .required();

    // ** Hooks
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues,
        resolver: yupResolver(ReportTestSchema),
    });

    const testResultOptions = [
        { value: "NEGATIVE", label: "NEGATIVE" },
        { value: "POSITIVE", label: "POSITIVE" },
    ];

    const typeOfTestOptions = [
        { value: "PCR", label: "PCR" },
        { value: "ANTIGEN", label: "ANTIGEN" },
    ];

    const provinceOptions = [
        { value: "Alberta", label: "Alberta" },
        { value: "British Columbia", label: "British Columbia" },
        { value: "Manitoba", label: "Manitoba" },
        { value: "New Brunswick", label: "New Brunswick" },
        { value: "Newfoundland and Labrador", label: "Newfoundland and Labrador" },
        { value: "Northwest Territories", label: "Northwest Territories" },
        { value: "Nova Scotia", label: "Nova Scotia" },
        { value: "Nunavut", label: "Nunavut" },
        { value: "Ontario", label: "Ontario" },
        { value: "Prince Edward Island", label: "Prince Edward Island" },
        { value: "Quebec", label: "Quebec" },
        { value: "Saskatshewan", label: "Saskatshewan" },
        { value: "Yukon", label: "Yukon" },
    ];

    const { patientId } = useParams();

    const onSubmit = async (data) => {
        try {
            await submitTestResult(data, patientId, token);
            toast.success("Test Result Submitted", {
                position: "top-right",
                autoClose: 5000,
            });
        } catch (error) {
            toast.error("Test Result Could Not Be Submitted", {
                position: "top-right",
                autoClose: 5000,
            });
        }

        reset();
    };

    return (
        <div>
            <BreadCrumbsPage
                breadCrumbTitle={`Add Test Result for ${patientId}`}
                breadCrumbParent="Patient"
                breadCrumbParent2="Patient List"
                breadCrumbActive="Add Test Result"
            />
            <Card className="basic-card add-test-fields-card mx-auto">
                <CardBody>
                    <CardTitle className="mb-0">Add a Test Result</CardTitle>
                </CardBody>
                <CardFooter>
                    <Form>
                        <Row>
                            <Col d="6" className="mb-1 mx-0 pr-0">
                                <Label className="form-label" for="testResult">
                                    Test Result
                                </Label>
                                <Controller
                                    id="testResult"
                                    name="testResult"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder=""
                                            options={testResultOptions}
                                            classNamePrefix="select"
                                            className={classnames("react-select", {
                                                "is-invalid": errors.testResult,
                                            })}
                                            theme={selectThemeColors}
                                        />
                                    )}
                                />
                                {errors.testResult && <FormFeedback>{errors.testResult.message}</FormFeedback>}
                            </Col>
                            <Col d="6" className="mb-1 pl-0">
                                <Label className="form-label" for="typeOfTest">
                                    Type of Test
                                </Label>
                                <Controller
                                    id="typeOfTest"
                                    name="typeOfTest"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder=""
                                            options={typeOfTestOptions}
                                            classNamePrefix="select"
                                            className={classnames("react-select", {
                                                "is-invalid": errors.typeOfTest,
                                            })}
                                            theme={selectThemeColors}
                                        />
                                    )}
                                />
                                {errors.typeOfTest && <FormFeedback>{errors.typeOfTest.message}</FormFeedback>}
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mb-2">
                                <Label className="form-label" for="dateOfTest">
                                    Date of Test
                                </Label>
                                <Controller
                                    id="dateOfTest"
                                    name="dateOfTest"
                                    control={control}
                                    render={({ field }) => (
                                        <Flatpickr
                                            data-enable-time
                                            placeholder="YYYY-mm-dd 00:00"
                                            id="date-time-picker"
                                            className={classnames("flatpickr form-control", {
                                                "is-invalid": errors.typeOfTest,
                                            })}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.dateOfTest && <FormFeedback>{errors.dateOfTest.message}</FormFeedback>}
                            </Col>
                        </Row>
                        <hr />
                        <Col className="mb-1">
                            <Label className="form-label" for="address">
                                Address
                            </Label>
                            <Controller
                                id="address"
                                name="address"
                                control={control}
                                render={({ field }) => <Input invalid={errors.address && true} {...field} />}
                            />
                            {errors.address ? <FormFeedback>{errors.address.message}</FormFeedback> : null}
                        </Col>
                        <Col className="mb-1">
                            <Label className="form-label" for="address2">
                                Address Line 2
                            </Label>
                            <Controller
                                id="addressLine2"
                                name="addressLine2"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Apartment, Suite, Unit, Building, Floor, etc."
                                        invalid={errors.addressLine2 && true}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.addressLine2 ? <FormFeedback>{errors.addressLine2.message}</FormFeedback> : null}
                        </Col>
                        <Row>
                            <Col className="mb-1">
                                <Label className="form-label" for="city">
                                    City
                                </Label>
                                <Controller
                                    id="city"
                                    name="city"
                                    control={control}
                                    render={({ field }) => <Input invalid={errors.city && true} {...field} />}
                                />
                                {errors.city ? <FormFeedback>{errors.city.message}</FormFeedback> : null}
                            </Col>
                            <Col className="mb-1">
                                <Label className="form-label" for="postalCode">
                                    Postal Code
                                </Label>
                                <Controller
                                    id="postalCode"
                                    name="postalCode"
                                    control={control}
                                    render={({ field }) => (
                                        <Input placeholder="A1A 1A1" invalid={errors.postalCode && true} {...field} />
                                    )}
                                />
                                {errors.postalCode ? <FormFeedback>{errors.postalCode.message}</FormFeedback> : null}
                            </Col>
                        </Row>
                        <Col className="mb-2">
                            <Label className="form-label" for="province">
                                Province
                            </Label>
                            <Controller
                                id="province"
                                name="province"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={provinceOptions}
                                        placeholder=""
                                        classNamePrefix="select"
                                        className={classnames("react-select", {
                                            "is-invalid": errors.province,
                                        })}
                                        theme={selectThemeColors}
                                    />
                                )}
                            />
                            {errors.province && (
                                <FormFeedback className="d-block">{errors.province.message}</FormFeedback>
                            )}
                        </Col>

                        <div className="text-center">
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                type="submit"
                                color="primary"
                                className="btn-next d-block w-100"
                            >
                                Add a Test Result
                            </Button>
                        </div>
                    </Form>
                </CardFooter>
            </Card>
        </div>
    );
}

export default ReportTestResult;
