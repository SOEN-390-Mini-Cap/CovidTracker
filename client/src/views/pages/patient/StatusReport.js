import BreadCrumbsPage from "@components/breadcrumbs";
import { Button, Card, CardBody, CardFooter, CardTitle, Form, FormFeedback, Input, Label } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

async function defineStatusReport(data, token) {
    const { patientId, ...fields } = data;
    await axios.post(
        `http://localhost:8080/patients/${patientId}/statuses/fields`,
        {
            ...fields,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}

const selectToken = (state) => state.auth.userData.token;

function StatusReport() {
    const defaultValues = {
        patientId: "",
        temperature: true,
        weight: true,
        fever: false,
        cough: false,
        shortnessOfBreath: false,
        lossOfTasteAndSmell: false,
        nausea: false,
        stomachAches: false,
        vomiting: false,
        headache: false,
        musclePain: false,
        soreThroat: false,
        otherSymptoms: true,
    };

    const defineStatusReportSchema = yup.object().shape({
        patientId: yup.number("Enter a patient ID.").typeError("Enter a patient ID.").required("Enter a patient ID."),
    });

    const primarySymptoms = [
        {
            name: "Fever",
            id: "fever",
            disabled: false,
        },
        {
            name: "Cough",
            id: "cough",
            disabled: false,
        },
        {
            name: "Shortness of Breath",
            id: "shortnessOfBreath",
            disabled: false,
        },
        {
            name: "Loss of Taste and Smell",
            id: "lossOfTasteAndSmell",
            disabled: false,
        },
    ];
    const secondarySymptoms = [
        {
            name: "Nausea",
            id: "nausea",
            disabled: false,
        },
        {
            name: "Stomach Aches",
            id: "stomachAches",
            disabled: false,
        },
        {
            name: "Vomiting",
            id: "vomiting",
            disabled: false,
        },
        {
            name: "Headache",
            id: "headache",
            disabled: false,
        },
        {
            name: "Muscle Pain",
            id: "musclePain",
            disabled: false,
        },
        {
            name: "Sore Throat",
            id: "soreThroat",
            disabled: false,
        },
        {
            name: "Other Symptoms",
            id: "otherSymptoms",
            disabled: true,
        },
    ];

    const {
        control,
        handleSubmit,
        reset,
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
            toast.error("Status report could not be defined", {
                position: "top-right",
                autoClose: 5000,
            });
        }

        reset();
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
                                    <Controller
                                        id="temperature"
                                        name="temperature"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="checkbox"
                                                defaultChecked={field.value}
                                                disabled={true}
                                                {...field}
                                            />
                                        )}
                                    />
                                    <Label className="form-check-label">Temperature</Label>
                                </div>
                                <div className="form-check w-50">
                                    <Controller
                                        id="weight"
                                        name="weight"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="checkbox"
                                                defaultChecked={field.value}
                                                disabled={true}
                                                {...field}
                                            />
                                        )}
                                    />
                                    <Label className="form-check-label">Weight</Label>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="w-50 me-1">
                                <Label className="form-label">Primary Symptoms</Label>
                                {primarySymptoms.map((fieldData, key) => (
                                    <div className="form-check" key={key}>
                                        <Controller
                                            id={fieldData.id}
                                            name={fieldData.id}
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    disabled={fieldData.disabled}
                                                    defaultChecked={field.value}
                                                    {...field}
                                                />
                                            )}
                                        />
                                        <Label className="form-check-label">{fieldData.name}</Label>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <Label className="form-label">Secondary Symptoms</Label>
                                {secondarySymptoms.map((fieldData, key) => (
                                    <div className="form-check" key={key}>
                                        <Controller
                                            id={fieldData.id}
                                            name={fieldData.id}
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    disabled={fieldData.disabled}
                                                    defaultChecked={field.value}
                                                    {...field}
                                                />
                                            )}
                                        />
                                        <Label className="form-check-label">{fieldData.name}</Label>
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

export default StatusReport;
