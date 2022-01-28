// ** React Imports
import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import useJwt from "@src/auth/jwt/useJwt";

// ** Store & Actions
import { useDispatch } from "react-redux";
import { handleLogin } from "@store/authentication";

// ** Third Party Components
import { useForm, Controller } from "react-hook-form";


// ** Context
import { AbilityContext } from "@src/utility/context/Can";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Label, Button, Form, Input, FormFeedback } from "reactstrap";
import WizardHorizontal from "@src/views/forms/wizard/WizardHorizontal";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
// ** Third Party Components
import Select from "react-select";

// ** Utils
//import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
//import { Card, CardHeader, CardTitle, CardBody, Row, Col, Label } from "reactstrap";

const colourOptions = [
    { value: "ocean", label: "Ocean" },
    { value: "blue", label: "Blue" },
    { value: "purple", label: "Purple" },
    { value: "red", label: "Red" },
    { value: "orange", label: "Orange" },
];
const defaultValues = {
    email: "",
    terms: false,
    username: "",
    password: "",

    // personal info 
    firstName: "",
    lastName: "",
    phone: "",
    gender:"",
    dateOfBirth: "",
    address1:"",
    address2:"",
    city: "",
    postalCode: "",
    province: "",
    
};

const Register = () => {
    // ** Hooks
    const ability = useContext(AbilityContext);
    const { skin } = useSkin();
    const history = useHistory();
    const dispatch = useDispatch();
    const {
        control,
        setError,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues });

    const logo = (
        <svg width="201" height="32" viewBox="0 0 201 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M44.502 25.182C43.0633 25.182 41.772 24.8787 40.628 24.272C39.484 23.6653 38.5913 22.8247 37.95 21.75C37.3087 20.658 36.988 19.4273 36.988 18.058C36.988 16.6887 37.3087 15.4667 37.95 14.392C38.5913 13.3173 39.4753 12.4767 40.602 11.87C41.746 11.2633 43.046 10.96 44.502 10.96C45.8713 10.96 47.0673 11.2373 48.09 11.792C49.13 12.3467 49.91 13.144 50.43 14.184L47.934 15.64C47.5353 14.9987 47.0327 14.522 46.426 14.21C45.8367 13.8807 45.1867 13.716 44.476 13.716C43.2627 13.716 42.2573 14.1147 41.46 14.912C40.6627 15.692 40.264 16.7407 40.264 18.058C40.264 19.3753 40.654 20.4327 41.434 21.23C42.2313 22.01 43.2453 22.4 44.476 22.4C45.1867 22.4 45.8367 22.244 46.426 21.932C47.0327 21.6027 47.5353 21.1173 47.934 20.476L50.43 21.932C49.8927 22.972 49.104 23.778 48.064 24.35C47.0413 24.9047 45.854 25.182 44.502 25.182ZM58.8477 25.182C57.4437 25.182 56.1784 24.8787 55.0517 24.272C53.9251 23.6653 53.0411 22.8247 52.3997 21.75C51.7757 20.658 51.4637 19.4273 51.4637 18.058C51.4637 16.6887 51.7757 15.4667 52.3997 14.392C53.0411 13.3173 53.9251 12.4767 55.0517 11.87C56.1784 11.2633 57.4437 10.96 58.8477 10.96C60.2691 10.96 61.5431 11.2633 62.6697 11.87C63.7964 12.4767 64.6717 13.3173 65.2957 14.392C65.9371 15.4667 66.2577 16.6887 66.2577 18.058C66.2577 19.4273 65.9371 20.658 65.2957 21.75C64.6717 22.8247 63.7964 23.6653 62.6697 24.272C61.5431 24.8787 60.2691 25.182 58.8477 25.182ZM58.8477 22.4C60.0437 22.4 61.0317 22.0013 61.8117 21.204C62.5917 20.4067 62.9817 19.358 62.9817 18.058C62.9817 16.758 62.5917 15.7093 61.8117 14.912C61.0317 14.1147 60.0437 13.716 58.8477 13.716C57.6517 13.716 56.6637 14.1147 55.8837 14.912C55.1211 15.7093 54.7397 16.758 54.7397 18.058C54.7397 19.358 55.1211 20.4067 55.8837 21.204C56.6637 22.0013 57.6517 22.4 58.8477 22.4ZM81.5561 11.116L75.6021 25H72.2481L66.2941 11.116H69.6741L73.9901 21.412L78.4361 11.116H81.5561ZM83.1588 11.116H86.4088V25H83.1588V11.116ZM84.7968 8.828C84.2075 8.828 83.7135 8.646 83.3148 8.282C82.9161 7.90067 82.7168 7.43267 82.7168 6.878C82.7168 6.32333 82.9161 5.864 83.3148 5.5C83.7135 5.11867 84.2075 4.928 84.7968 4.928C85.3861 4.928 85.8801 5.11 86.2788 5.474C86.6775 5.82067 86.8768 6.26267 86.8768 6.8C86.8768 7.372 86.6775 7.85733 86.2788 8.256C85.8975 8.63733 85.4035 8.828 84.7968 8.828ZM103.844 5.708V25H100.724V23.206C100.187 23.8647 99.5192 24.3587 98.7218 24.688C97.9418 25.0173 97.0752 25.182 96.1218 25.182C94.7872 25.182 93.5825 24.8873 92.5078 24.298C91.4505 23.7087 90.6185 22.8767 90.0118 21.802C89.4052 20.71 89.1018 19.462 89.1018 18.058C89.1018 16.654 89.4052 15.4147 90.0118 14.34C90.6185 13.2653 91.4505 12.4333 92.5078 11.844C93.5825 11.2547 94.7872 10.96 96.1218 10.96C97.0405 10.96 97.8812 11.116 98.6438 11.428C99.4065 11.74 100.057 12.208 100.594 12.832V5.708H103.844ZM96.5118 22.4C97.2918 22.4 97.9938 22.2267 98.6178 21.88C99.2418 21.516 99.7358 21.0047 100.1 20.346C100.464 19.6873 100.646 18.9247 100.646 18.058C100.646 17.1913 100.464 16.4287 100.1 15.77C99.7358 15.1113 99.2418 14.6087 98.6178 14.262C97.9938 13.898 97.2918 13.716 96.5118 13.716C95.7318 13.716 95.0298 13.898 94.4058 14.262C93.7818 14.6087 93.2878 15.1113 92.9238 15.77C92.5598 16.4287 92.3778 17.1913 92.3778 18.058C92.3778 18.9247 92.5598 19.6873 92.9238 20.346C93.2878 21.0047 93.7818 21.516 94.4058 21.88C95.0298 22.2267 95.7318 22.4 96.5118 22.4ZM116.698 24.246C116.317 24.558 115.849 24.792 115.294 24.948C114.757 25.104 114.185 25.182 113.578 25.182C112.053 25.182 110.874 24.7833 110.042 23.986C109.21 23.1887 108.794 22.0273 108.794 20.502V13.82H106.506V11.22H108.794V8.048H112.044V11.22H115.762V13.82H112.044V20.424C112.044 21.1 112.209 21.62 112.538 21.984C112.868 22.3307 113.344 22.504 113.968 22.504C114.696 22.504 115.303 22.3133 115.788 21.932L116.698 24.246ZM122.037 13.144C122.973 11.688 124.62 10.96 126.977 10.96V14.054C126.7 14.002 126.449 13.976 126.223 13.976C124.958 13.976 123.97 14.3487 123.259 15.094C122.549 15.822 122.193 16.8793 122.193 18.266V25H118.943V11.116H122.037V13.144ZM134.534 10.96C136.579 10.96 138.139 11.454 139.214 12.442C140.306 13.4127 140.852 14.886 140.852 16.862V25H137.784V23.31C137.385 23.9167 136.813 24.3847 136.068 24.714C135.34 25.026 134.456 25.182 133.416 25.182C132.376 25.182 131.466 25.0087 130.686 24.662C129.906 24.298 129.299 23.804 128.866 23.18C128.45 22.5387 128.242 21.8193 128.242 21.022C128.242 19.774 128.701 18.7773 129.62 18.032C130.556 17.2693 132.02 16.888 134.014 16.888H137.602V16.68C137.602 15.7093 137.307 14.964 136.718 14.444C136.146 13.924 135.288 13.664 134.144 13.664C133.364 13.664 132.592 13.7853 131.83 14.028C131.084 14.2707 130.452 14.6087 129.932 15.042L128.658 12.676C129.386 12.1213 130.261 11.6967 131.284 11.402C132.306 11.1073 133.39 10.96 134.534 10.96ZM134.092 22.816C134.906 22.816 135.626 22.634 136.25 22.27C136.891 21.8887 137.342 21.3513 137.602 20.658V19.046H134.248C132.376 19.046 131.44 19.6613 131.44 20.892C131.44 21.4813 131.674 21.9493 132.142 22.296C132.61 22.6427 133.26 22.816 134.092 22.816ZM151.091 25.182C149.652 25.182 148.361 24.8787 147.217 24.272C146.073 23.6653 145.18 22.8247 144.539 21.75C143.898 20.658 143.577 19.4273 143.577 18.058C143.577 16.6887 143.898 15.4667 144.539 14.392C145.18 13.3173 146.064 12.4767 147.191 11.87C148.335 11.2633 149.635 10.96 151.091 10.96C152.46 10.96 153.656 11.2373 154.679 11.792C155.719 12.3467 156.499 13.144 157.019 14.184L154.523 15.64C154.124 14.9987 153.622 14.522 153.015 14.21C152.426 13.8807 151.776 13.716 151.065 13.716C149.852 13.716 148.846 14.1147 148.049 14.912C147.252 15.692 146.853 16.7407 146.853 18.058C146.853 19.3753 147.243 20.4327 148.023 21.23C148.82 22.01 149.834 22.4 151.065 22.4C151.776 22.4 152.426 22.244 153.015 21.932C153.622 21.6027 154.124 21.1173 154.523 20.476L157.019 21.932C156.482 22.972 155.693 23.778 154.653 24.35C153.63 24.9047 152.443 25.182 151.091 25.182ZM164.941 19.046L162.523 21.334V25H159.273V5.708H162.523V17.356L169.257 11.116H173.157L167.359 16.94L173.703 25H169.751L164.941 19.046ZM187.842 18.136C187.842 18.3613 187.824 18.682 187.79 19.098H176.896C177.086 20.1207 177.58 20.9353 178.378 21.542C179.192 22.1313 180.198 22.426 181.394 22.426C182.919 22.426 184.176 21.9233 185.164 20.918L186.906 22.92C186.282 23.6653 185.493 24.2287 184.54 24.61C183.586 24.9913 182.512 25.182 181.316 25.182C179.79 25.182 178.447 24.8787 177.286 24.272C176.124 23.6653 175.223 22.8247 174.582 21.75C173.958 20.658 173.646 19.4273 173.646 18.058C173.646 16.706 173.949 15.4927 174.556 14.418C175.18 13.326 176.038 12.4767 177.13 11.87C178.222 11.2633 179.452 10.96 180.822 10.96C182.174 10.96 183.378 11.2633 184.436 11.87C185.51 12.4593 186.342 13.3 186.932 14.392C187.538 15.4667 187.842 16.7147 187.842 18.136ZM180.822 13.56C179.782 13.56 178.898 13.872 178.17 14.496C177.459 15.1027 177.026 15.9173 176.87 16.94H184.748C184.609 15.9347 184.184 15.12 183.474 14.496C182.763 13.872 181.879 13.56 180.822 13.56ZM193.629 13.144C194.565 11.688 196.212 10.96 198.569 10.96V14.054C198.292 14.002 198.04 13.976 197.815 13.976C196.55 13.976 195.562 14.3487 194.851 15.094C194.14 15.822 193.785 16.8793 193.785 18.266V25H190.535V11.116H193.629V13.144Z"
                fill="#6610F2"
            />
            <path
                d="M24.4871 10.2985H24.4834L21.6119 10.2773C21.6112 10.2773 21.6106 10.2773 21.61 10.2773C20.5366 10.2762 19.7039 9.36916 19.7037 8.30232L24.4871 10.2985ZM24.4871 10.2985C26.1383 10.2985 27.4993 11.6713 27.5 13.3789C27.5 13.379 27.5 13.3791 27.5 13.3791V18.6232C27.5 20.33 26.1392 21.7029 24.4875 21.7029H22.8064V20.5985H24.4875C25.5614 20.5985 26.3956 19.6909 26.3956 18.6232V13.3789C26.3956 12.3119 25.5625 11.4048 24.4895 11.4036C24.4888 11.4036 24.4882 11.4036 24.4875 11.4036L21.6159 11.3824H21.6122C19.9604 11.3824 18.5993 10.009 18.5993 8.30265V8.30234L18.5976 5.51326C18.5976 5.51315 18.5976 5.51305 18.5976 5.51294C18.5974 4.43891 17.6893 3.60548 16.6223 3.60548H11.3777C10.3106 3.60548 9.40243 4.43907 9.40242 5.51326L9.40243 5.51442L9.42117 13.5706H9.92117L9.42117 13.5718L9.42117 13.5714C9.42158 14.5077 10.1143 15.263 10.9961 15.4387L11.0444 15.4483H11.0938H16.8895C18.3557 15.5611 19.527 16.6806 19.7015 18.0842L19.7203 20.1314H19.7013V20.6314V26.4874C19.7013 28.1393 18.3283 29.5 16.6219 29.5H11.3774C9.67097 29.5 8.29768 28.1392 8.29768 26.4874V23.3519V23.3058L8.28925 23.2604C8.13439 22.4277 7.42962 21.8016 6.57817 21.7051L6.55008 21.7019H6.52182H3.51251C1.86044 21.7019 0.5 20.3289 0.5 18.6221V13.3779C0.5 11.6711 1.86044 10.2981 3.51251 10.2981H5.19364V11.4026H3.51251C2.43812 11.4026 1.60439 12.3102 1.60439 13.3779V18.6221C1.60439 19.6898 2.43812 20.5974 3.51251 20.5974H6.59554C8.05703 20.7124 9.22504 21.8279 9.40207 23.2272V26.4878C9.40207 27.562 10.3103 28.3956 11.3774 28.3956H16.6219C17.689 28.3956 18.5972 27.562 18.5972 26.4878V18.2063V18.1607L18.589 18.1158C18.4352 17.2796 17.7281 16.6511 16.8738 16.5555L16.8461 16.5524H16.8182H10.9681C9.4652 16.3473 8.31642 15.0803 8.31642 13.5699L8.31642 13.5687L8.29768 5.51255C8.29768 5.51231 8.29768 5.51208 8.29768 5.51184C8.29808 3.86041 9.67122 2.5 11.3774 2.5H16.6223C18.3286 2.5 19.7016 3.86074 19.7016 5.51255V5.51293L19.7037 8.30194L24.4871 10.2985Z"
                fill="#259EF0"
                stroke="#259EF0"
            />
        </svg>
    );

    const illustration = skin === "dark" ? "register-v2-dark.svg" : "register-v2.svg",
        source = require(`@src/assets/images/pages/${illustration}`).default;

    const onSubmit = (data) => {
        const tempData = { ...data };
        delete tempData.terms;
        if (Object.values(tempData).every((field) => field.length > 0) && data.terms === true) {
            const { firstName, lastName, phone, gender, dateOfBirth, address1, address2, city, postalCode, province } = data;
            useJwt
                .register({ firstName, lastName, phone, gender, dateOfBirth, address1, address2, city, postalCode, province })
                .then((res) => {
                    if (res.data.error) {
                        for (const property in res.data.error) {
                            if (res.data.error[property] !== null) {
                                setError(property, {
                                    type: "manual",
                                    message: res.data.error[property],
                                });
                            }
                        }
                    } else {
                        const data = { ...res.data.user, accessToken: res.data.accessToken };
                        ability.update(res.data.user.ability);
                        dispatch(handleLogin(data));
                        history.push("/");
                    }
                })
                .catch((err) => console.log(err));
        } else {
            for (const key in data) {
                if (data[key].length === 0) {
                    setError(key, {
                        type: "manual",
                        message: `Please enter a valid ${key}`,
                    });
                }
                if (key === "terms" && data.terms === false) {
                    setError("terms", {
                        type: "manual",
                    });
                }
            }
        }
    };

    return (
        <div className="auth-wrapper auth-cover">
           
            <Row className="auth-inner m-0">
            
                <Col className="d-none d-lg-flex align-items-center p-5" lg="4" sm="12">
               
                </Col>

                <Col sm="12">
                    <WizardHorizontal />
                </Col>
                
            </Row>
            
        </div>
    );
};

export default Register;


/*
 <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="4" sm="12">
                    <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
                        
                        <CardTitle tag="h2" className="fw-bold mb-1">
                        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
                            {logo}
                        </Link>
                        </CardTitle>
                        <CardText className="mb-2">Make your app management easy and fun!</CardText>
                        
                        <Form action="/" className="auth-register-form mt-2" onSubmit={handleSubmit(onSubmit)}>
                       <Row> 
                           <Col> 
                                <div className="mb-1">
                                    <Label className="form-label" for="register-firstName">
                                        First Name
                                    </Label>
                                    <Controller
                                        id="firstName"
                                        name="firstName"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="firstName"
                                                placeholder="Bruce"
                                                invalid={errors.firstName && true}
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.firstName ? <FormFeedback>{errors.firstName.message}</FormFeedback> : null}
                                 </div>
                            </Col>

                         <Col>
                                <div className="mb-1">
                                    <Label className="form-label" for="register-lastName">
                                        Last Name
                                    </Label>
                                    <Controller
                                        id="lastName"
                                        name="lastName"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                autoFocus
                                                placeholder="Wayne"
                                                invalid={errors.lastName && true}
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.lastName ? <FormFeedback>{errors.lastName.message}</FormFeedback> : null}
                                </div>
                            </Col>
                            
                        </Row>
                            
                            <div className="mb-1">
                                <Label className="form-label" for="register-phone">
                                    Phone Number
                                </Label>
                                <Controller
                                    id="phone"
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            autoFocus
                                            placeholder="999-999-9999"
                                            invalid={errors.phone && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.phone ? <FormFeedback>{errors.phone.message}</FormFeedback> : null}
                            </div>
                            <div className="mb-1">
                                <Label className="form-label" for="register-gender">
                                    Gender
                                </Label>
                                <Controller
                                    id="gender"
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            autoFocus
                                            placeholder="Gender"
                                            invalid={errors.gender && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.gender ? <FormFeedback>{errors.gender.message}</FormFeedback> : null}
                            </div>
                            <div className="mb-1">
                                <Label className="form-label" for="register-address1">
                                Address
                                </Label>
                                <Controller
                                    id="address1"
                                    name="address1"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            autoFocus
                                            placeholder="Address"
                                            invalid={errors.address1 && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.address1 ? <FormFeedback>{errors.address1.message}</FormFeedback> : null}
                            </div>
                            
                            <div className="mb-1">
                                <Label className="form-label" for="register-address2">
                                Address 2
                                </Label>
                                <Controller
                                    id="address2"
                                    name="address2"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            autoFocus
                                            placeholder="Address 2"
                                            invalid={errors.address2 && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.address2 ? <FormFeedback>{errors.address2.message}</FormFeedback> : null}
                            </div>
                            <div className="mb-1">
                                <Label className="form-label" for="register-city">
                                City
                                </Label>
                                <Controller
                                    id="city"
                                    name="city"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            autoFocus
                                            placeholder="City"
                                            invalid={errors.city && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.city ? <FormFeedback>{errors.city.message}</FormFeedback> : null}
                            </div>
                            <div className="mb-1">
                                <Label className="form-label" for="register-postalCode">
                                Postal Code
                                </Label>
                                <Controller
                                    id="postalCode"
                                    name="postalCode"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            autoFocus
                                            placeholder="Postal Code"
                                            invalid={errors.postalCode && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.postalCode ? <FormFeedback>{errors.postalCode.message}</FormFeedback> : null}
                            </div>
                            <div className="mb-1">
                                <Label className="form-label" for="register-province">
                                Province
                                </Label>
                                <Controller
                                    id="province"
                                    name="province"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            autoFocus
                                            placeholder="Province"
                                            invalid={errors.province && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.province ? <FormFeedback>{errors.province.message}</FormFeedback> : null}
                            </div>
                            
                            
                            <Button type="submit" block color="primary">
                                Next
                            </Button>
                        </Form>
                        <p className="text-center mt-2">
                            <span className="me-25">Already have an account?</span>
                            <Link to="/Login">
                                <span>Sign in instead</span>
                            </Link>
                        </p>
                        
                        
                    </Col>
                </Col>
*/