// ** React Imports
import { Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

// ** Utils
import { isObjEmpty } from "@utils";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";
import { handleLogin } from "@store/authentication";
import { getHomeRouteForLoggedInUser } from "@utils";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { ChevronLeft } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

// ** Reactstrap Imports
import { Form, Label, Input, Col, Button, FormFeedback } from "reactstrap";

async function signUp(data) {
    const res = await axios.post("http://localhost:8080/auth/sign_up", {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phone.replaceAll("-", ""),
        gender: data.gender.value,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
        email: data.email,
        password: data.password,
        streetAddress: data.address1,
        streetAddressLineTwo: data.address2,
        city: data.city,
        postalCode: data.postalCode,
        province: data.province.value,
    });

    return res.data;
}

async function getProfile(token) {
    const res = await axios.get("http://localhost:8080/users/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

const defaultValues = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
};

const AccountSignUp = ({ stepper, globalData }) => {
    const SignupSchema = yup.object().shape({
        email: yup
            .string()
            .email("Enter a valid email.")
            .required("Enter a valid email.")
            .max(50, "Email must be 50 characters or less."),
        password: yup
            .string()
            .required("Enter a password.")
            .min(8, "Password must be between 8 and 20 characters.")
            .max(20, "Password must be between 8 and 20 characters."),
        confirmPassword: yup
            .string()
            .required("Confirm your password.")
            .oneOf([yup.ref("password"), null], "The passwords you entered do not match."),
    });

    // ** Hooks

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues,
        resolver: yupResolver(SignupSchema),
    });

    const dispatch = useDispatch();
    const history = useHistory();

    const onSubmit = async (data) => {
        try {
            globalData = Object.assign({}, globalData, data);

            if (isObjEmpty(errors)) {
                const { token } = await signUp(globalData);
                const user = await getProfile(token);
                dispatch(
                    handleLogin({
                        user,
                        token,
                        rememberMe: true,
                    }),
                );
                history.push(getHomeRouteForLoggedInUser("admin"));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Fragment>
            <Form onSubmit={handleSubmit(onSubmit)} style={{ margin: "0px 10px" }}>
                <Col md="12" className="mb-1">
                    <Label className="form-label" for={`email`}>
                        Email
                    </Label>
                    <Controller
                        control={control}
                        id="email"
                        name="email"
                        render={({ field }) => (
                            <Input
                                type="email"
                                invalid={errors.email && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                </Col>
                <div className="form-password-toggle col-md-12 mb-1">
                    <Label className="form-label" for="password">
                        Password
                    </Label>
                    <Controller
                        id="password"
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <InputPasswordToggle
                                className="input-group-merge"
                                invalid={errors.password && true}
                                placeholder=""
                                {...field}
                            />
                        )}
                    />
                    {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
                </div>
                <div className="form-password-toggle col-md-12 mb-1">
                    <Label className="form-label" for="confirmPassword">
                        Confirm Password
                    </Label>
                    <Controller
                        control={control}
                        id="confirmPassword"
                        name="confirmPassword"
                        render={({ field }) => (
                            <InputPasswordToggle
                                className="input-group-merge"
                                invalid={errors.confirmPassword && true}
                                placeholder=""
                                {...field}
                            />
                        )}
                    />
                    {errors.confirmPassword && <FormFeedback>{errors.confirmPassword.message}</FormFeedback>}
                </div>

                <div className="form-check mb-2">
                    <Input type="checkbox" id="remember-me" />
                    <Label className="form-check-label" for="remember-me">
                        Remember Me
                    </Label>
                </div>
                <Button type="submit" color="primary" className="btn-submit d-block w-100">
                    Sign Up
                </Button>
                <p className="text-center mt-1">
                    <Link className="text-center mt-2" onClick={() => stepper.previous()} to="#">
                        <ChevronLeft size={14} className="align-middle me-sm-25 me-0" />
                        <span className="align-middle">Back</span>
                    </Link>
                </p>
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

export default AccountSignUp;