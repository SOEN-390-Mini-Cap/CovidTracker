// ** React Imports
import { useState, Fragment } from "react";
import { Link } from "react-router-dom";

// ** Third Party Components
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { ArrowRight } from "react-feather";
import classnames from "classnames";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";
import NumberFormat from 'react-number-format';

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";

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

    const [data, setData] = useState(null);
    // ** Hooks
    const {
        control,
        setError,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        setGlobalData(data);
        setData(data);
        if (Object.values(data).every((field) => field.length > 0)) {
            stepper.next();
        } else {
            for (const key in data) {
                if (key == 'firstName' && data[key].length === 0) {
                    setError(key, {
                        type: "manual",
                        message: `Enter a first name.`,
                    });
                }
                if (key == 'lastName' && data[key].length === 0) {
                    setError(key, {
                        type: "manual",
                        message: `Enter a last name.`,
                    });
                }
                if (key == 'phone' && data[key].length != 10) {
                    setError(key, {
                        type: "manual",
                        message: `Enter a valid phone number.`,
                    });
                }
                if (key == 'gender' && data.gender === null) {
                    setError(key, {
                        type: "manual",
                        message: `Select a gender.`,
                    });
                }
                if (key == 'dateOfBirth' && data[key].length === 0) {
                    setError(key, {
                        type: "manual",
                        message: `Enter a date of birth.`,
                    });
                }
                if (key == 'address1' && data[key].length === 0) {
                    setError(key, {
                        type: "manual",
                        message: `Enter an address.`,
                    });
                }
                if (key == 'city' && data[key].length === 0) {
                    setError(key, {
                        type: "manual",
                        message: `Enter a city.`,
                    });
                }
                if (key == 'postalCode' && data[key].length === 0) {
                    setError(key, {
                        type: "manual",
                        message: `Enter a valid post code.`,
                    });
                }
                if (key == 'province' && data.province === null) {
                    setError(key, {
                        type: "manual",
                        message: `Select a province.`,
                    });
                }
            }
        }
    };

    const genderOptions = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
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
        <Fragment >
            <Form style={{ margin: "0px 10px" }} onSubmit={handleSubmit(onSubmit)}>
                <Row className="">
                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="firstName">
                            First Name
                        </Label>
                        <Controller
                            id="firstName"
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.firstName && true} {...field} />
                            )}
                        />
                        {errors.firstName && <FormFeedback>{errors.firstName.message}</FormFeedback>}
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="lastName">
                            Last Name
                        </Label>
                        <Controller
                            id="lastName"
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.lastName && true} {...field} />
                            )}
                        />
                        {errors.lastName && <FormFeedback>{errors.lastName.message}</FormFeedback>}
                    </Col>
                </Row>
                <Row className="mb-0">
                    <Col md="7" className="mb-1">
                        <Label className="form-label" for="phone">
                            Phone Number
                        </Label>
                        <Controller
                            id="phone"
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <NumberFormat
                                    className="form-control"
                                    placeholder="999-999-9999"
                                    format="###-###-####"
                                    className={classnames("form-control", {
                                        "is-invalid": data !== null && data.phone == '',
                                    })}
                                    {...field}
                                />
                            )}
                        />
                        {errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
                    </Col>
                    <Col md="5" className="mb-1">
                        <Label className="form-label" for="gender">
                            Gender
                        </Label>
                        <Controller
                            id="gender"
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <Select options={genderOptions}
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder=''
                                    theme={selectThemeColors}
                                    className={classnames("react-select", {
                                        "is-invalid": data !== null && data.gender === null,
                                    })}
                                    {...field} />
                            )}
                        />
                        {errors.gender ? <FormFeedback>{errors.gender.message}</FormFeedback> : null}
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
                            <Input
                                placeholder="MM/DD/YYYY"
                                invalid={errors.dateOfBirth && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.dateOfBirth ? <FormFeedback>{errors.dateOfBirth.message}</FormFeedback> : null}
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
                        render={({ field }) => (
                            <Input
                                invalid={errors.address1 && true}
                                {...field}
                            />
                        )}
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
                            render={({ field }) => (
                                <Input
                                    invalid={errors.city && true}
                                    {...field}
                                />
                            )}
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
                                <Input
                                    placeholder="A1A 1A1"
                                    invalid={errors.postalCode && true}
                                    {...field}
                                />
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
                            <Select options={provinceOptions}
                                className='react-select'
                                classNamePrefix='select'
                                placeholder=''
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                    "is-invalid": data !== null && data.province === null,
                                })}
                                {...field} />
                        )}
                    />
                    {errors.province ? <FormFeedback>{errors.province.message}</FormFeedback> : null}
                </Col>


                <div className="text-center">

                    <Button type="submit" color="primary" className="btn-next col-md-12" onClick={() => {
                        stepper.next();
                    }}>
                        <span className="align-middle d-sm-inline-block d-none">Next</span>
                        <ArrowRight size={14} className="align-middle ms-sm-25 ms-0"></ArrowRight>
                    </Button>
                </div>
                <p className="text-center mt-2">
                    <span className="me-25">Already have an account?</span>
                    <Link to="/pages/login-basic">
                        <span>Sign in</span>
                    </Link>
                </p>
            </Form>
        </Fragment >
    );
};

export default PersonalSignUp;
