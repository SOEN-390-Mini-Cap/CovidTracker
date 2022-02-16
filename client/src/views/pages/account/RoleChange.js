import BreadCrumbsPage from "@components/breadcrumbs";
import Select from "react-select";
import { Button, Card, CardBody, Form, FormFeedback, Input, Label } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Check, XCircle } from "react-feather";

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
const formatErrorMessage = (err) => err.charAt(0).toUpperCase() + err.slice(1);

function RoleChange() {
    const defaultValues = {
        userId: 1,
        role: null,
    };

    const AssignRoleSchema = yup.object().shape({
        userId: yup.number().required("Enter a valid userId."),
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
        setError,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues, resolver: yupResolver(AssignRoleSchema) });

    const token = useSelector(selectToken);

    const successToaster = () =>
        toast.success("Role Added to User", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    const errorToaster = () =>
        toast.error("Could not Assign Role to User", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    const onSubmit = async (data) => {
        try {
            await assignRole(data, token).then(successToaster);
        } catch (error) {
            errorToaster();
            setError("req", {
                type: "manual",
                message: error.toString(),
            });
        }
    };

    return (
        <div>
            <BreadCrumbsPage breadCrumbTitle="Roles" breadCrumbParent="Users" breadCrumbActive="Roles" />
            <div className="auth-wrapper auth-basic px-2">
                <div className="auth-inner my-2">
                    <Card className="mb-0">
                        <CardBody className="sign-in-card-body">
                            <h2>Add a Role</h2>
                            <Form className="auth-login-form sign-in-form">
                                <div className="mb-1">
                                    <Label className="form-label" for="userId">
                                        User Id
                                    </Label>
                                    <Controller
                                        id="userId"
                                        name="userId"
                                        control={control}
                                        render={({ field }) => (
                                            <Input autoFocus type="number" invalid={errors.number && true} {...field} />
                                        )}
                                    />
                                    {errors.number && (
                                        <FormFeedback className="d-block">
                                            {formatErrorMessage(errors.number.message)}
                                        </FormFeedback>
                                    )}
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
                                                className="react-select"
                                                classNamePrefix="select"
                                            />
                                        )}
                                    />
                                    {errors.role && (
                                        <FormFeedback className="d-block">
                                            {formatErrorMessage(errors.role.message)}
                                        </FormFeedback>
                                    )}
                                </div>
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    color="primary"
                                    block
                                    className="mt-1 btn-sign-in"
                                >
                                    Add a Role
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default RoleChange;
