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

function RoleChange() {
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

    const options = [
        { value: "PATIENT", label: "Patient" },
        { value: "DOCTOR", label: "Doctor" },
        { value: "ADMIN", label: "Admin" },
        { value: "HEALTH_OFFICIAL", label: "Health Official" },
        { value: "IMMIGRATION_OFFICER", label: "Immigration Officer" },
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
            toast.success("Role Added to User", {
                position: "top-right",
                autoClose: 5000,
            });
        } catch (error) {
            toast.error("Could not Assign Role to User", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    return (
        <div>
            <BreadCrumbsPage breadCrumbTitle="DefineStatusReport" breadCrumbParent="Patient" breadCrumbActive="DefineStatusReport" />
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
                            <Label className="form-label">
                                General
                            </Label>
                        </div>

                        <div classname="mb-1">
                            <ul class="general">
                                <li>
                                    <vs-checkbox v-model="temperature">Temperature</vs-checkbox>
                                </li>
                                <li>
                                    <vs-checkbox v-model="weight">Weight</vs-checkbox>
                                </li>
                            </ul>
                            <div className="mb-1">
                                <Label className="form-label">
                                    Primary Symptoms
                                </Label>
                            </div>
                            <ul class="primary_symptoms">
                                <li>
                                    <vs-checkbox v-model="fever">Fever</vs-checkbox>
                                </li>
                                <li>
                                    <vs-checkbox v-model="cough">Cough</vs-checkbox>
                                </li>
                                <li>
                                    <vs-checkbox v-model="shortnessOfBreath">Shortness of Breath</vs-checkbox>
                                </li>
                                <li>
                                    <vs-checkbox v-model="LossOfTaste">Loss of Taste and Smell</vs-checkbox>
                                </li>
                            </ul>

                            <div className="mb-1">
                                <Label className="form-label">
                                    Secondary Symptoms
                                </Label>
                            </div>
                            <ul class="secondary_symptoms">
                                <li>
                                    <vs-checkbox v-model="nausea">Nausea</vs-checkbox>
                                </li>
                                <li>
                                    <vs-checkbox v-model="stomach_aches">Stomach Aches</vs-checkbox>
                                </li>
                                <li>
                                    <vs-checkbox v-model="vomiting">Vomiting</vs-checkbox>
                                </li>
                                <li>
                                    <vs-checkbox v-model="headache">Headache</vs-checkbox>
                                </li>
                                <li>
                                    <vs-checkbox v-model="muscle_pain">Muscle Pain</vs-checkbox>
                                </li>
                                <li>
                                    <vs-checkbox v-model="sore_throat">Sore Throat</vs-checkbox>
                                </li>
                                <li>
                                    <vs-checkbox v-model="other_symptoms">Other Symptoms</vs-checkbox>
                                </li>
                            </ul>

                        </div>

                        <div className="input-group">
                            <div className="form-check form-check-info">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="checkbox"
                                    v-model="checked"
                                />
                                <label htmlFor="checkbox">checked</label>
                            </div>
                            <div className="form-check form-check-info">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="checkbox"
                                    v-model="checked"
                                />
                                <label htmlFor="checkbox">checked</label>
                            </div>
                        </div>



                        <div className="mb-1">
                            <Controller
                                id="role"
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={options}
                                        classNamePrefix="select"
                                        className={classnames("react-select", {
                                            "is-invalid": !!errors.role,
                                        })}
                                        placeholder=""
                                    />
                                )}
                            />
                            {errors.role && <FormFeedback className="d-block">{errors.role.message}</FormFeedback>}
                        </div>
                        <Button onClick={handleSubmit(onSubmit)} color="primary" block className="mt-2 mb-1">
                            Define Status Report
                        </Button>
                    </Form>
                </CardFooter>
            </Card>
        </div >
    );
}

export default DefineStatusReport;
