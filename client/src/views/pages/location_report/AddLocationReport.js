import BreadCrumbsPage from "@components/breadcrumbs";
import { Button, Card, CardBody, CardFooter, CardTitle, Col, Form, FormFeedback, Input, Label, Row } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { selectThemeColors } from "@utils";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { postLocationReport } from "../../../services/api";

const provinceOptions = [
    { value: "Alberta", label: "Alberta" },
    { value: "British Columbia", label: "British Columbia" },
    { value: "Manitoba", label: "Manitoba" },
    { value: "New Brunswick", label: "New Brunswick" },
    { value: "Newfoundland and Labrador", label: "Newfoundland and Labrador" },
    { value: "Northwest Territories", label: "Northwest Territories" },
    { value: "Nova Scotia", label: "Nova Scotia" },
    { value: "Nunavut", label: "Nunavut" },
    { value: "Ontario", label: "Ontario" },
    { value: "Prince Edward Island", label: "Prince Edward Island" },
    { value: "Quebec", label: "Quebec" },
    { value: "Saskatshewan", label: "Saskatshewan" },
    { value: "Yukon", label: "Yukon" },
];

const defaultValues = {
    createdOn: "",
    address: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    province: "",
};

const locationReportSchema = yup
    .object()
    .shape({
        createdOn: yup.date().required("Enter a date.").typeError("Enter a date."),
        address: yup.string().required("Enter an address.").max(100, "Address must be 100 characters long or less."),
        addressLine2: yup.string().max(100, "Address must be 100 characters long or less."),
        postalCode: yup.string().required("Enter a valid postal code."),
        province: yup
            .object({
                label: yup.string().required("Select a province."),
                value: yup.string().required("Select a province."),
            })
            .nullable("Select a province.")
            .required("Select a province."),
    })
    .required();

function AddLocationReport() {
    const token = useSelector((state) => state.auth.userData.token);
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues,
        resolver: yupResolver(locationReportSchema),
    });

    const onSubmit = async (data) => {
        try {
            await postLocationReport(token, data);
            toast.success("Location added", {
                position: "top-right",
                autoClose: 5000,
            });
            reset();
        } catch (error) {
            console.log(error);
            toast.error("Location could not be added", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    return (
        <div>
            <BreadCrumbsPage breadCrumbTitle="Add Location" breadCrumbActive="Add Location" />
            <Card className="basic-card small-margin-card mx-auto">
                <CardBody>
                    <CardTitle className="mb-0">Add Location</CardTitle>
                </CardBody>
                <CardFooter>
                    <Form>
                        <Row>
                            <Col className="mb-2">
                                <Label className="form-label" for="createdOn">
                                    Date
                                </Label>
                                <Controller
                                    id="createdOn"
                                    name="createdOn"
                                    control={control}
                                    render={({ field }) => (
                                        <Flatpickr
                                            placeholder="MM/DD/YYYY"
                                            options={{maxDate: new Date()}}
                                            className={classnames("flatpickr form-control", {
                                                "is-invalid": errors.createdOn,
                                            })}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.createdOn && <FormFeedback>{errors.createdOn.message}</FormFeedback>}
                            </Col>
                        </Row>
                        <hr />
                        <Col className="mb-1">
                            <Label className="form-label" for="address">
                                Address
                            </Label>
                            <Controller
                                id="address"
                                name="address"
                                control={control}
                                render={({ field }) => <Input invalid={errors.address && true} {...field} />}
                            />
                            {errors.address ? <FormFeedback>{errors.address.message}</FormFeedback> : null}
                        </Col>
                        <Col className="mb-1">
                            <Label className="form-label" for="address2">
                                Address Line 2
                            </Label>
                            <Controller
                                id="addressLine2"
                                name="addressLine2"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Apartment, Suite, Unit, Building, Floor, etc."
                                        invalid={errors.addressLine2 && true}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.addressLine2 ? <FormFeedback>{errors.addressLine2.message}</FormFeedback> : null}
                        </Col>
                        <Row>
                            <Col md={7} className="mb-1">
                                <Label className="form-label" for="city">
                                    City
                                </Label>
                                <Controller
                                    id="city"
                                    name="city"
                                    control={control}
                                    render={({ field }) => <Input invalid={errors.city && true} {...field} />}
                                />
                                {errors.city ? <FormFeedback>{errors.city.message}</FormFeedback> : null}
                            </Col>
                            <Col md={5} className="mb-1">
                                <Label className="form-label" for="postalCode">
                                    Postal Code
                                </Label>
                                <Controller
                                    id="postalCode"
                                    name="postalCode"
                                    control={control}
                                    render={({ field }) => (
                                        <Input placeholder="A1A 1A1" invalid={errors.postalCode && true} {...field} />
                                    )}
                                />
                                {errors.postalCode ? <FormFeedback>{errors.postalCode.message}</FormFeedback> : null}
                            </Col>
                        </Row>
                        <Col className="mb-2">
                            <Label className="form-label" for="province">
                                Province
                            </Label>
                            <Controller
                                id="province"
                                name="province"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={provinceOptions}
                                        placeholder=""
                                        classNamePrefix="select"
                                        className={classnames("react-select", {
                                            "is-invalid": errors.province,
                                        })}
                                        theme={selectThemeColors}
                                    />
                                )}
                            />
                            {errors.province && (
                                <FormFeedback className="d-block">{errors.province.message}</FormFeedback>
                            )}
                        </Col>

                        <div className="text-center">
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                type="submit"
                                color="primary"
                                className="btn-next d-block w-100"
                            >
                                Add Location
                            </Button>
                        </div>
                    </Form>
                </CardFooter>
            </Card>
        </div>
    );
}

export default AddLocationReport;
