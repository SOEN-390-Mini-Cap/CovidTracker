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

async function assignRole(data, token) {
    await axios.put(
        `http://localhost:8080/users/${data.userId}/roles`,
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
        reset,
        formState: { errors },
    } = useForm({ defaultValues, resolver: yupResolver(AssignRoleSchema) });

    const token = useSelector(selectToken);

    const onSubmit = async (data) => {
        try {
            await assignRole(data, token);
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
        reset();
    };

    return (
        <div>
            <BreadCrumbsPage breadCrumbTitle="Roles" breadCrumbParent="User" breadCrumbActive="Roles" />
            <Card className="basic-card mx-auto">
                <CardBody>
                    <CardTitle className="mb-0">Add a Role</CardTitle>
                </CardBody>
                <CardFooter>
                    <Form>
                        <div className="mb-1">
                            <Label className="form-label" for="userId">
                                User ID
                            </Label>
                            <Controller
                                id="userId"
                                name="userId"
                                control={control}
                                render={({ field }) => (
                                    <Input autoFocus type="number" invalid={!!errors.userId} {...field} />
                                )}
                            />
                            {errors.userId && <FormFeedback className="d-block">{errors.userId.message}</FormFeedback>}
                        </div>
                        <div className="mb-1">
                            <Label className="form-label" for="d-role">
                                Role
                            </Label>
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
                            Add a Role
                        </Button>
                    </Form>
                </CardFooter>
            </Card>
        </div>
    );
}

export default RoleChange;
