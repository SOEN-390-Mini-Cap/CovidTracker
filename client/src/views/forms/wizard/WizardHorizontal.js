// ** React Imports
import { useRef, useState } from "react";

// ** Custom Components
import Wizard from "@components/wizard";

// ** Steps
import Address from "./steps-with-validation/Address";
import SocialLinks from "./steps-with-validation/SocialLinks";
import PersonalInfo from "./steps-with-validation/PersonalInfo";
import AccountDetails from "./steps-with-validation/AccountDetails";

const WizardHorizontal = () => {
    // ** Ref
    const ref = useRef(null);

    // ** State
    const [stepper, setStepper] = useState(null);

    const steps = [
        
        {
            id: "personal-info",
            title: "Personal ",
            subtitle: "Add Personal Info",
            content: <PersonalInfo stepper={stepper} />,
        },
        
        {
            id: "account-details",
            title: "Account",
            subtitle: "Add Account Details",
            content: <AccountDetails stepper={stepper} />,
        },
    ];

    return (
        <div className="horizontal-wizard">
            <Wizard instance={(el) => setStepper(el)} ref={ref} steps={steps} />
        </div>
        
    );
};

export default WizardHorizontal;
