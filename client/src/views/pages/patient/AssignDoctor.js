import BreadCrumbsPage from "@components/breadcrumbs";
import { Button, Card, CardBody, CardFooter, CardTitle, Form, FormFeedback, Input, Label } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

async function assignDoctor(data, token) {
    await axios.post(
        `http://localhost:8080/patients/${data.patientId}/doctors`,
        {
            doctorId: data.doctorId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}

const selectToken = (state) => state.auth.userData.token;

function AssignDoctor() {
    const defaultValues = {
        patientId: "",
        doctorId: "",
    };

    const AssignDoctorSchema = yup.object().shape({
        patientId: yup.number("Enter a patient ID.").typeError("Enter a patient ID.").required("Enter a patient ID."),
        doctorId: yup.number("Enter a doctor ID.").typeError("Enter a doctor ID.").required("Enter a doctor ID."),
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues, resolver: yupResolver(AssignDoctorSchema) });

    const token = useSelector(selectToken);

    const onSubmit = async (data) => {
        try {
            await assignDoctor(data, token);
            toast.success("Patient Assigned to a Doctor", {
                position: "top-right",
                autoClose: 5000,
            });
        } catch (error) {
            toast.error("Could not Assign Patient to a Doctor", {
                position: "top-right",
                autoClose: 5000,
            });
        }
        reset();
    };

    return (
        <div>
            <BreadCrumbsPage breadCrumbTitle="Assign Doctor" breadCrumbParent="User" breadCrumbActive="Assign Doctor" />
            <Card className="basic-card mx-auto">
                <CardBody>
                    <CardTitle className="mb-0">Assign a Patient to a Doctor</CardTitle>
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
                            <Label className="form-label" for="d-role">
                                Doctor ID
                            </Label>
                            <Controller
                                id="doctorId"
                                name="doctorId"
                                control={control}
                                render={({ field }) => (
                                    <Input autoFocus type="number" invalid={!!errors.doctorId} {...field} />
                                )}
                            />
                            {errors.doctorId && (
                                <FormFeedback className="d-block">{errors.doctorId.message}</FormFeedback>
                            )}
                        </div>
                        <Button onClick={handleSubmit(onSubmit)} color="primary" block className="mt-2 mb-1">
                            Assign a Doctor
                        </Button>
                    </Form>
                </CardFooter>
            </Card>
        </div>
    );
}

export default AssignDoctor;
