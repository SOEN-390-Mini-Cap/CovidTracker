import { Fragment } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import classnames from "classnames";
import * as yup from "yup";
import { selectThemeColors } from "@utils";
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import { isObjEmpty } from "../../../../utility/Utils";

const defaultValues = {
    lastName: "",
    firstName: "",
    phone: "",
    gender: null,
    dateOfBirth: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    province: null,
};

const PersonalSignUp = ({ stepper, setGlobalData }) => {
    const signUpSchema = yup
        .object()
        .shape({
            firstName: yup
                .string()
                .required("Enter a first name.")
                .matches(/^[aA-zZ\s]+$/, "First name must only contain alphabetic characters.")
                .max(32, "First name must be 32 characters or less."),
            lastName: yup
                .string()
                .required("Enter a last name.")
                .matches(/^[aA-zZ\s]+$/, "Last name must only contain alphabetic characters.")
                .max(32, "Last name must be 32 characters or less."),
            phone: yup
                .string()
                .required("Enter a valid phone number.")
                .matches(/^\d{3}-\d{3}-\d{4}$/, "Enter a valid phone number (###-###-####)."),
            gender: yup
                .object({
                    label: yup.string().required("Select a gender."),
                    value: yup.string().required("Select a gender."),
                })
                .nullable("Select a gender.")
                .required("Select a gender."),
            dateOfBirth: yup
                .string()
                .required("Enter a date of birth.")
                .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Enter a valid date of birth. (MM/DD/YYYY)."),
            address1: yup.string().required("Enter an address.").max(100, "Address must be 100 characters or less."),
            address2: yup.string().max(100, "Address must be 100 characters or less."),
            city: yup.string().required("Enter a city.").max(100, "City must be 100 characters or less."),
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
    // ** Hooks
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues,
        resolver: yupResolver(signUpSchema),
    });

    const onSubmit = (data) => {
        if (isObjEmpty(errors)) {
            setGlobalData(data);
            stepper.next();
        }
    };

    const genderOptions = [
        { value: "MALE", label: "Male" },
        { value: "FEMALE", label: "Female" },
    ];

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

    return (
        <Fragment>
            <Form style={{ margin: "0px 10px" }} onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col d="6" className="mb-1">
                        <Label className="form-label" for="firstName">
                            First Name
                        </Label>
                        <Controller
                            id="firstName"
                            name="firstName"
                            control={control}
                            render={({ field }) => <Input invalid={errors.firstName && true} {...field} />}
                        />
                        {errors.firstName && <FormFeedback>{errors.firstName.message}</FormFeedback>}
                    </Col>
                    <Col d="6" className="mb-1">
                        <Label className="form-label" for="lastName">
                            Last Name
                        </Label>
                        <Controller
                            id="lastName"
                            name="lastName"
                            control={control}
                            render={({ field }) => <Input invalid={errors.lastName && true} {...field} />}
                        />
                        {errors.lastName && <FormFeedback>{errors.lastName.message}</FormFeedback>}
                    </Col>
                </Row>
                <Row>
                    <Col d="7" className="mb-1">
                        <Label className="form-label" for="phone">
                            Phone Number
                        </Label>
                        <Controller
                            id="phone"
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    className="form-control"
                                    placeholder="999-999-9999"
                                    invalid={errors.phone && true}
                                    {...field}
                                />
                            )}
                        />
                        {errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
                    </Col>
                    <Col d="5" className="mb-1">
                        <Label className="form-label" for="gender">
                            Gender
                        </Label>
                        <Controller
                            id="gender"
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder=""
                                    options={genderOptions}
                                    classNamePrefix="select"
                                    className={classnames("react-select", {
                                        "is-invalid": errors.gender,
                                    })}
                                    theme={selectThemeColors}
                                />
                            )}
                        />
                        {errors.gender && <FormFeedback className="d-block">{errors.gender.message}</FormFeedback>}
                    </Col>
                </Row>
                <Col className="mb-2">
                    <Label className="form-label" for="dateOfBirth">
                        Date of Birth
                    </Label>
                    <Controller
                        id="dateOfBirth"
                        name="dateOfBirth"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="MM/DD/YYYY" invalid={errors.dateOfBirth && true} {...field} />
                        )}
                    />
                    {errors.dateOfBirth && <FormFeedback>{errors.dateOfBirth.message}</FormFeedback>}
                </Col>
                <hr />
                <Col className="mb-1">
                    <Label className="form-label" for="address1">
                        Address
                    </Label>
                    <Controller
                        id="address1"
                        name="address1"
                        control={control}
                        render={({ field }) => <Input invalid={errors.address1 && true} {...field} />}
                    />
                    {errors.address1 ? <FormFeedback>{errors.address1.message}</FormFeedback> : null}
                </Col>
                <Col className="mb-1">
                    <Label className="form-label" for="address2">
                        Address 2
                    </Label>
                    <Controller
                        id="address2"
                        name="address2"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder="Apartment, Suite, Unit, Building, Floor, etc."
                                invalid={errors.address2 && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.address2 ? <FormFeedback>{errors.address2.message}</FormFeedback> : null}
                </Col>
                <Row>
                    <Col className="mb-1">
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
                    <Col className="mb-1">
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
                    {errors.province && <FormFeedback className="d-block">{errors.province.message}</FormFeedback>}
                </Col>

                <div className="text-center">
                    <Button type="submit" color="primary" className="btn-next d-block w-100">
                        Next
                    </Button>
                </div>
                <p className="text-center mt-2">
                    <span className="me-25">Already have an account?</span>
                    <Link to="/sign_in">
                        <span>Sign In</span>
                    </Link>
                </p>
            </Form>
        </Fragment>
    );
};

export default PersonalSignUp;
