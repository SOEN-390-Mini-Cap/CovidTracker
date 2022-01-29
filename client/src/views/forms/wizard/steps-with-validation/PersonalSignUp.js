// ** React Imports
import { Fragment } from "react";
import { Link } from "react-router-dom";

// ** Third Party Components
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { ArrowRight } from "react-feather";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";

const defaultValues = {
    lastName: "",
    firstName: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    province: "",
};

const PersonalSignUp = ({ stepper }) => {
    // ** Hooks
    const {
        control,
        setError,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        if (Object.values(data).every((field) => field.length > 0)) {
            stepper.next();
        } else {
            for (const key in data) {
                if (data[key].length === 0) {
                    setError(key, {
                        type: "manual",
                        message: `Please enter a valid ${key}`,
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
        <Fragment>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
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
                <Row className="mb-1">
                    <Col md="7" className="mb-1">
                        <Label className="form-label" for="register-phone">
                            Phone Number
                        </Label>
                        <Controller
                            id="phone"
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="999-999-9999"
                                    invalid={errors.phone && true}
                                    {...field}
                                />
                            )}
                        />
                        {errors.phone ? <FormFeedback>{errors.phone.message}</FormFeedback> : null}
                    </Col>
                    <Col md="5" className="mb-1">
                        <Label className="form-label" for="register-gender">
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
                                    invalid={errors.gender && true}
                                    {...field} />
                            )}
                        />
                        {errors.gender ? <FormFeedback>{errors.gender.message}</FormFeedback> : null}
                    </Col>
                </Row>
                <hr />
                <Col className="mb-1">
                    <Label className="form-label" for="register-address1">
                        Address
                    </Label>
                    <Controller
                        id="address1"
                        name="address1"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder="Address"
                                invalid={errors.address1 && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.address1 ? <FormFeedback>{errors.address1.message}</FormFeedback> : null}
                </Col>
                <Col className="mb-1">
                    <Label className="form-label" for="register-address2">
                        Address 2
                    </Label>
                    <Controller
                        id="address2"
                        name="address2"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder="Address 2"
                                invalid={errors.address2 && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.address2 ? <FormFeedback>{errors.address2.message}</FormFeedback> : null}
                </Col>
                <Row>

                    <Col className="mb-1">
                        <Label className="form-label" for="register-city">
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
                        <Label className="form-label" for="register-postalCode">
                            Postal Code
                        </Label>
                        <Controller
                            id="postalCode"
                            name="postalCode"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="Postal Code"
                                    invalid={errors.postalCode && true}
                                    {...field}
                                />
                            )}
                        />
                        {errors.postalCode ? <FormFeedback>{errors.postalCode.message}</FormFeedback> : null}
                    </Col>
                </Row>
                <Col className="mb-2">
                    <Label className="form-label" for="register-province">
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
                                invalid={errors.gender && true}
                                {...field} />
                        )}
                    />
                    {errors.province ? <FormFeedback>{errors.province.message}</FormFeedback> : null}
                </Col>


                <div className="text-center">

                    <Button type="submit" color="primary" className="btn-next col-md-12" onClick={() => stepper.next()}>
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
