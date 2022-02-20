import BreadCrumbsPage from "@components/breadcrumbs";
import { Button, Card, CardBody, CardFooter, CardTitle, Form, FormFeedback, Input, Label } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

async function defineStatusReport(data, token) {
    console.log(data);
    await axios.put(
        `http://localhost:8080/patients/${data.patientId}/statuses/fields`,
        {
            role: data.role.value,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}

const selectToken = (state) => state.auth.userData.token;

function DefineStatusReport() {
    const defaultValues = {
        patientId: "",
    };

    const defineStatusReportSchema = yup.object().shape({
        patientId: yup.number("Enter a patient ID.").typeError("Enter a patient ID.").required("Enter a patient ID."),
    });

    const primarySymptoms = [
        {
            name: "Fever",
            value: false,
            disabled: false,
        },
        {
            name: "Cough",
            value: false,
            disabled: false,
        },
        {
            name: "Shortness of Breath",
            value: false,
            disabled: false,
        },
        {
            name: "Loss of Taste and Smell",
            value: false,
            disabled: false,
        },
    ];
    const secondarySymptoms = [
        {
            name: "Nausea",
            value: false,
            disabled: false,
        },
        {
            name: "Stomach Aches",
            value: false,
            disabled: false,
        },
        {
            name: "Vomiting",
            value: false,
            disabled: false,
        },
        {
            name: "Headache",
            value: false,
            disabled: false,
        },
        {
            name: "Muscle Pain",
            value: false,
            disabled: false,
        },
        {
            name: "Sore Throat",
            value: false,
            disabled: false,
        },
        {
            name: "Other Symptoms",
            value: true,
            disabled: true,
        },
    ];

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues, resolver: yupResolver(defineStatusReportSchema) });

    const token = useSelector(selectToken);

    const onSubmit = async (data) => {
        try {
            await defineStatusReport(data, token);
            toast.success("Status Report Defined for a Patient", {
                position: "top-right",
                autoClose: 5000,
            });
        } catch (error) {
            toast.error("Could not Assign Status Report for a Patient", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    return (
        <div>
            <BreadCrumbsPage
                breadCrumbTitle="Define Status Report"
                breadCrumbParent="Patient"
                breadCrumbActive="Define Status Report"
            />
            <Card className="basic-card status-report-fields-card mx-auto">
                <CardBody>
                    <CardTitle className="mb-0">Define Status Report for a Patient</CardTitle>
                </CardBody>
                <CardFooter>
                    <Form>
                        <div className="mb-1">
                            <Label className="form-label" for="patientId">
                                Patient ID
                            </Label>
                            <Controller
                                id="patientId"
                                name="patientId"
                                control={control}
                                render={({ field }) => (
                                    <Input autoFocus type="number" invalid={!!errors.patientId} {...field} />
                                )}
                            />
                            {errors.patientId && (
                                <FormFeedback className="d-block">{errors.patientId.message}</FormFeedback>
                            )}
                        </div>
                        <div className="mb-1">
                            <Label className="form-label">General</Label>
                            <div className="d-flex">
                                <div className="form-check w-50">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="temperature"
                                        disabled={true}
                                        checked={true}
                                    />
                                    <label htmlFor="checkbox">Temperature</label>
                                </div>
                                <div className="form-check w-50">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="weight"
                                        disabled={true}
                                        checked={true}
                                    />
                                    <label htmlFor="checkbox">Weight</label>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="w-50 me-1">
                                <Label className="form-label" for="patientId" position="left">
                                    Primary Symptoms
                                </Label>
                                {primarySymptoms.map((object, key) => (
                                    <div className="form-check" key={key}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={object.name}
                                            disabled={object.disabled}
                                            checked={object.value}
                                            onChange={() => (object.value = !object.value)}
                                        />
                                        <label htmlFor="checkbox">{object.name}</label>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <Label className="form-label" for="patientId" position="right">
                                    Secondary Symptoms
                                </Label>
                                {secondarySymptoms.map((object, key) => (
                                    <div className="form-check" key={key}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={object.name}
                                            disabled={object.disabled}
                                            checked={object.value}
                                            onChange={() => (object.value = !object.value)}
                                        />
                                        <label htmlFor="checkbox">{object.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button onClick={handleSubmit(onSubmit)} color="primary" block className="mt-2 mb-1">
                            Define Status Report
                        </Button>
                    </Form>
                </CardFooter>
            </Card>
        </div>
    );
}

export default DefineStatusReport;
