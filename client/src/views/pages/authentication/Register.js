import { Col } from "reactstrap";
import WizardSignUp from "@src/views/forms/wizard/WizardSignUp";
import "@styles/react/pages/page-authentication.scss";

const Register = () => {
    return (
        <div className="auth-wrapper auth-basic px-2">
            <div className="auth-inner my-2">
                <Col sm="12">
                    <WizardSignUp />
                </Col>
            </div>
        </div>
    );
};

export default Register;
