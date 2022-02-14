import Select from "react-select";
import { Button, Card, CardBody, Form, FormFeedback, Input, Label } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import * as yup from "yup";

async function assignRole(data) {
    data.preventDefault();
    // TODO
}

const formatErrorMessage = (err) => err.charAt(0).toUpperCase() + err.slice(1);

function RoleChange() {
    const defaultValues = {
        password: "",
        email: "",
    };

    const AssignRoleSchema = yup.object().shape({
        userId: yup.number().required("Enter a valid userId."),
        role: yup.string().required("Select a role."),
    });

    const options = [
        { value: "user", label: "User" },
        { value: "patient", label: "Patient" },
        { value: "doctor", label: "Doctor" },
        { value: "admin", label: "Admin" },
        { value: "health_official", label: "Health Official" },
        { value: "immigration_officer", label: "Immigration Officer" },
    ];

    const {
        control,
        setError,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues, resolver: yupResolver(AssignRoleSchema) });

    const onSubmit = async (data) => {
        try {
            console.log(data);
        } catch (error) {
            setError("req", {
                type: "manual",
                message: error.toString(),
            });
        }
    };

    return (
        <div className="auth-wrapper auth-basic px-2">
            <div className="auth-inner my-2">
                <Card className="mb-0" style={{ width: "35%", margin: "auto" }}>
                    <CardBody className="sign-in-card-body">
                        <h2>Add a Role</h2>
                        <Form className="auth-login-form sign-in-form" onSubmit={handleSubmit(onSubmit)}>
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
                                {errors.email && (
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
                                        <Select options={options} className="react-select" classNamePrefix="select" />
                                    )}
                                />
                                {errors.role && (
                                    <FormFeedback className="d-block">
                                        {formatErrorMessage(errors.role.message)}
                                    </FormFeedback>
                                )}
                            </div>
                            <Button type="submit" color="primary" block className="mt-1 btn-sign-in">
                                Add a Role
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default RoleChange;
