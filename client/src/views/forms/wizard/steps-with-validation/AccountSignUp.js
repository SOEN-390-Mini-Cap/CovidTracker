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
import { ArrowLeft } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

// ** Reactstrap Imports
import { Form, Label, Input, Col, Button, FormFeedback } from "reactstrap";

async function signUp(data) {
    const res = await axios.post("http://localhost:8080/sign_up", {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phone.replaceAll('-', ''),
            gender: data.gender.value.toUpperCase(),
            dateOfBirth: new Date(data.dateOfBirth).toISOString(),
            email: data.email,
            password: data.password,
            streetAddress: data.address1,
            streetAddressLineTwo: data.address2,
            city: data.city,
            postalCode: data.postalCode,
            province: data.province.value
    });

    if (res.status !== 201) {
        throw new Error("error message");
    }

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
        email: yup.string().email().required('Enter a valid email.'),
        password: yup.string().required('Enter a password'),
        confirmPassword: yup
            .string()
            .required('Confirm your password')
            .oneOf([yup.ref(`password`), null], "Passwords must match"),
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

        globalData = Object.assign({}, globalData, data)
        console.log(globalData);

        if (isObjEmpty(errors)) {
            await signUp(globalData)
            .then((globalData) => {
                dispatch(
                    handleLogin({
                        accessToken: globalData.token,
                    }),
                );
                history.push(getHomeRouteForLoggedInUser("admin"));
            })
            .catch((error) => console.log(error));
        }
    };

    return (
        <Fragment>
            <Form onSubmit={handleSubmit(onSubmit)} style={{ margin: "0px 10px" }} >
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
                                placeholder="john.doe@email.com"
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
                                {...field} />
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
                                {...field} />
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
                <Button type="submit" color="primary" className="btn-submit col-md-12 mb-0">
                    Sign Up
                </Button>
                <Button color="flat-primary" className="btn-prev col-md-12" onClick={() => stepper.previous()}>
                    <ArrowLeft size={14} className="align-middle me-sm-25 me-0"></ArrowLeft>
                    <span className="align-middle d-sm-inline-block d-none">Back</span>
                </Button>
                <p className="text-center mt-2">
                    <span className="me-25">Already have an account?</span>
                    <Link to="/pages/login-basic">
                        <span>Sign in</span>
                    </Link>
                </p>
            </Form>
        </Fragment>
    );
};

export default AccountSignUp;
