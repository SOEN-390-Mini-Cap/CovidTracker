import BreadCrumbsPage from "@components/breadcrumbs";
import Select from "react-select";
import { Button, Card, CardBody, CardFooter, CardTitle, Form, FormFeedback, Input, Label } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import classnames from "classnames";

async function defineStatusReport(data, token) {
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
        userId: "",
        role: null,
    };

    const AssignRoleSchema = yup.object().shape({
        userId: yup.number("Enter a user ID.").typeError("Enter a user ID.").required("Enter a user ID."),
        role: yup
            .object({
                label: yup.string().required("Select a role."),
                value: yup.string().required("Select a role."),
            })
            .nullable("Select a role.")
            .required("Select a role."),
    });

    const primarySymtpoms = [
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
    const secondarySymptpoms = [
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
    } = useForm({ defaultValues, resolver: yupResolver(AssignRoleSchema) });

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
                breadCrumbTitle="DefineStatusReport"
                breadCrumbParent="Patient"
                breadCrumbActive="DefineStatusReport"
            />
            <Card className="assign-role-card mx-auto">
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
                            {errors.userId && <FormFeedback className="d-block">{errors.userId.message}</FormFeedback>}
                        </div>
                        <div className="mb-1">
                            <Label className="form-label">General</Label>
                            <div className="form-check form-check-info">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="temperature"
                                    disabled="true"
                                    checked="true"
                                />
                                <label htmlFor="checkbox">Temperature</label>
                            </div>
                            <div className="form-check form-check-info">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="weight"
                                    disabled="true"
                                    checked="true"
                                />
                                <label htmlFor="checkbox">Weight</label>
                            </div>


                            <Label className="form-label" for="patientId" position="left">
                                Primary Symptoms
                            </Label>
                            <Label className="form-label" for="patientId" position="right">
                                Secondary Symptoms
                            </Label>

                        </div>

                        <div classname="mb-1">
                            <div className="row">
                                <div className="col">
                                    {primarySymtpoms.map((object) => (
                                        <div className="form-check form-check-info">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={object.name}
                                                checked={object.checked} disabled={object.disabled}
                                                checked={object.value}
                                                onChange={() => (object.value = !object.value)}
                                            />
                                            <label htmlFor="checkbox">{object.name}</label>
                                        </div>
                                    ))}
                                </div>
                                <div className="col">
                                    {secondarySymptpoms.map((object) => (
                                        <div className="form-check form-check-info">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={object.name}
                                                checked={object.checked} disabled={object.disabled}
                                                checked={object.value}
                                                onChange={() => (object.value = !object.value)}
                                            />
                                            <label htmlFor="checkbox">{object.name}</label>
                                        </div>
                                    ))}
                                </div>
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
