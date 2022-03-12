import BreadCrumbsPage from "@components/breadcrumbs";
import { Button, Card, CardBody, CardFooter, CardTitle, Form, FormFeedback, Input, Label } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getFields, submitStatusReport } from "../../../services/api";

const selectToken = (state) => state.auth.userData.token;
const selectUserId = (state) => state.auth.userData.user.account.userId;

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

function StatusReport() {
    const defaultValues = {
        temperature: "",
        weight: "",
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
        otherSymptoms: "",
    };

    const statusReportSchema = yup.object().shape({
        temperature: yup
            .number("Enter a temperature.")
            .typeError("Enter a temperature.")
            .required("Enter a temperature."),
        weight: yup.number("Enter a weight.").typeError("Enter a weight.").required("Enter a weight."),
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues, resolver: yupResolver(statusReportSchema) });

    const token = useSelector(selectToken);
    const userId = useSelector(selectUserId);
    const [fields, setFields] = useState(null);
    useEffect(() => {
        async function f() {
            const res = await getFields(userId, token);
            setFields(res);
        }
        f();
    }, [userId, token]);

    const onSubmit = async (data) => {
        try {
            await submitStatusReport(data, userId, token);
            toast.success("Status Report Submitted", {
                position: "top-right",
                autoClose: 5000,
            });
        } catch (error) {
            toast.error("Status Report Could Not Be Submitted", {
                position: "top-right",
                autoClose: 5000,
            });
        }

        reset();
    };

    return (
        <div>
            <BreadCrumbsPage
                breadCrumbTitle="Status Report"
                breadCrumbParent="Patient"
                breadCrumbActive="Status Report"
            />
            <Card className="basic-card small-margin-card mx-auto">
                <CardBody>
                    <CardTitle className="mb-0">Submit Status Report</CardTitle>
                </CardBody>
                {fields && (
                    <CardFooter>
                        <Form>
                            <div className="d-flex mb-1">
                                {fields.temperature && (
                                    <div className="w-50 me-1">
                                        <Label className="form-label" for="temperature">
                                            Temperature
                                        </Label>
                                        <Controller
                                            id="temperature"
                                            name="temperature"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    type="number"
                                                    placeholder="&deg;C"
                                                    invalid={!!errors.temperature}
                                                    {...field}
                                                />
                                            )}
                                        />
                                        {errors.temperature && (
                                            <FormFeedback className="d-block">
                                                {errors.temperature.message}
                                            </FormFeedback>
                                        )}
                                    </div>
                                )}
                                {fields.weight && (
                                    <div className="w-50">
                                        <Label className="form-label" for="temperature">
                                            Weight
                                        </Label>
                                        <Controller
                                            id="weight"
                                            name="weight"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    type="number"
                                                    placeholder="lbs"
                                                    invalid={!!errors.weight}
                                                    {...field}
                                                />
                                            )}
                                        />
                                        {errors.weight && (
                                            <FormFeedback className="d-block">{errors.weight.message}</FormFeedback>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="d-flex mb-1">
                                <div className="w-50 me-1">
                                    <Label className="form-label">Primary Symptoms</Label>
                                    {primarySymptoms.map(
                                        (fieldData, key) =>
                                            fields[fieldData.id] && (
                                                <div className="form-check" key={key}>
                                                    <Controller
                                                        id={fieldData.id}
                                                        name={fieldData.id}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={field.value}
                                                                {...field}
                                                            />
                                                        )}
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
                                            fields[fieldData.id] && (
                                                <div className="form-check" key={key}>
                                                    <Controller
                                                        id={fieldData.id}
                                                        name={fieldData.id}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={field.value}
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                    <Label className="form-check-label">{fieldData.name}</Label>
                                                </div>
                                            ),
                                    )}
                                </div>
                            </div>
                            {fields.otherSymptoms && (
                                <div>
                                    <Label className="form-label" for="otherSymptoms">
                                        Other Symptoms
                                    </Label>
                                    <Controller
                                        id="otherSymptoms"
                                        name="otherSymptoms"
                                        control={control}
                                        render={({ field }) => <Input type="textarea" {...field} />}
                                    />
                                </div>
                            )}
                            <Button onClick={handleSubmit(onSubmit)} color="primary" block className="mt-2 mb-1">
                                Submit
                            </Button>
                        </Form>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}

export default StatusReport;
