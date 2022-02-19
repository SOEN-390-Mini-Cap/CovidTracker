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
                            <table className="table table-borderless">
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="form-check form-check-info">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="temperature"
                                                    v-model="checked"
                                                />
                                                <label htmlFor="checkbox">Temperature</label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check form-check-info">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="weight"
                                                    v-model="checked"
                                                />
                                                <label htmlFor="checkbox">Weight</label>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="table table-borderless">
                                <thead>
                                    <tr>
                                        <th>Primary Symptoms</th>
                                        <th>Secondary Symptoms</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="form-check form-check-info">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="fever"
                                                    v-model="checked"
                                                />
                                                <label htmlFor="checkbox">Fever</label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check form-check-info">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="nausea"
                                                    v-model="checked"
                                                />
                                                <label htmlFor="checkbox">Nausea</label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="form-check form-check-info">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="cough"
                                                    v-model="checked"
                                                />
                                                <label htmlFor="checkbox">Cough</label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check form-check-info">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="stomachAches"
                                                    v-model="checked"
                                                />
                                                <label htmlFor="checkbox">Stomach Aches</label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="form-check form-check-info">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="shortnessOfBreath"
                                                    v-model="checked"
                                                />
                                                <label htmlFor="checkbox">Shortness of Breath</label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check form-check-info">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="votiming"
                                                    v-model="checked"
                                                />
                                                <label htmlFor="checkbox">Vomiting</label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="form-check form-check-info">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="lossOfTasteAndSmell"
                                                    v-model="checked"
                                                />
                                                <label htmlFor="checkbox">Loss of Taste and Smell</label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check form-check-info">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="headache"
                                                    v-model="checked"
                                                />
                                                <label htmlFor="checkbox">Headache</label>
                                            </div>
                                        </td>
                                        <tr>
                                            <td>

                                            </td>
                                            <td>
                                                <div className="form-check form-check-info">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="muscle_pain"
                                                        v-model="checked"
                                                    />
                                                    <label htmlFor="checkbox">Muscle Pain</label>
                                                </div>
                                            </td>
                                            <tr>
                                                <td>

                                                </td>
                                                <td>
                                                    <div className="form-check form-check-info">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="sore_throat"
                                                            v-model="checked"
                                                        />
                                                        <label htmlFor="checkbox">Sore Throat</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>

                                                </td>
                                                <td>
                                                    <div className="form-check form-check-info">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="other_symptoms"
                                                            v-model="checked"
                                                        />
                                                        <label htmlFor="checkbox">Other Symptoms</label>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tr>
                                    </tr>
                                </tbody>
                            </table>

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
