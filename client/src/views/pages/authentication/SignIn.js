import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { handleLogin } from "@store/authentication";
import InputPasswordToggle from "@components/input-password-toggle";
import { getHomeRouteForLoggedInUser } from "@utils";
import { Form, Input, Label, Button, Card, CardBody, FormFeedback } from "reactstrap";
import "@styles/react/pages/page-authentication.scss";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Logo from "../../components/Logo";

async function signIn(data) {
    const res = await axios.post("http://localhost:8080/sign_in", {
        password: data.password,
        email: data.email,
    });

    return res.data;
}

const formatErrorMessage = (err) => err.charAt(0).toUpperCase() + err.slice(1);

const SignIn = () => {
    const defaultValues = {
        password: "",
        email: "",
        rememberMe: false,
    };

    const SignInSchema = yup.object().shape({
        email: yup.string().email("Enter a valid email.").required("Enter a valid email."),
        password: yup.string().required("Enter a password."),
    });

    // ** Hooks
    const dispatch = useDispatch();
    const history = useHistory();
    const {
        control,
        setError,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues, resolver: yupResolver(SignInSchema) });

    const onSubmit = async (data) => {
        await signIn(data)
            .then((res) => {
                dispatch(
                    handleLogin({
                        accessToken: res.token,
                        rememberMe: data.rememberMe,
                    }),
                );
                history.push(getHomeRouteForLoggedInUser("admin"));
            })
            .catch((error) => {
                setError("req", {
                    type: "manual",
                    message: error.toString(),
                });
            });
    };

    return (
        <div className="auth-wrapper auth-basic px-2">
            <div className="auth-inner my-2">
                <Card className="mb-0">
                    <CardBody className="sign-in-card-body">
                        <Link className="brand-logo sign-in-brand-logo" to="/" onClick={(e) => e.preventDefault()}>
                            <Logo />
                        </Link>
                        <Form className="auth-login-form sign-in-form" onSubmit={handleSubmit(onSubmit)}>
                            {errors.req && (
                                <FormFeedback className="d-block text-center mt-2 mb-0 incorrect-email-pass-error">
                                    {formatErrorMessage("Email or password is incorrect.")}
                                </FormFeedback>
                            )}
                            <div className="mb-1">
                                <Label className="form-label" for="login-email">
                                    Email
                                </Label>
                                <Controller
                                    id="email"
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input autoFocus type="email" invalid={errors.email && true} {...field} />
                                    )}
                                />
                                {errors.email && (
                                    <FormFeedback className="d-block">
                                        {formatErrorMessage(errors.email.message)}
                                    </FormFeedback>
                                )}
                            </div>
                            <div className="mb-1">
                                <Label className="form-label" for="login-password">
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
                                {errors.password && (
                                    <FormFeedback className="d-block">
                                        {formatErrorMessage(errors.password.message)}
                                    </FormFeedback>
                                )}
                            </div>
                            <div className="d-flex justify-content-between remember-me">
                                <div className="form-check mb-1">
                                    <Controller
                                        id="rememberMe"
                                        name="rememberMe"
                                        control={control}
                                        render={({ field }) => <Input type="checkbox" id="remember-me" {...field} />}
                                    />
                                    <Label className="form-check-label" for="remember-me">
                                        Remember Me
                                    </Label>
                                </div>
                            </div>
                            <Button type="submit" color="primary" block className="mt-1 btn-sign-in">
                                Sign in
                            </Button>
                        </Form>

                        <p className="text-center mt-2 mb-0">
                            <span className="me-25">Don't have an account?</span>
                            <Link to="/sign_up">
                                <span>Sign Up</span>
                            </Link>
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default SignIn;
