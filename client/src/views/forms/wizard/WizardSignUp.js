// ** React Imports
import { useRef, useState } from "react";

// ** Custom Components
import Wizard from "@components/wizard";

// ** Steps
import PersonalSignUp from "./steps-with-validation/PersonalSignUp";
import AccountSignUp from "./steps-with-validation/AccountSignUp";

const WizardSignUp = () => {
    // ** Ref
    const ref = useRef(null);

    // ** State
    const [stepper, setStepper] = useState(null);

    const steps = [

        {
            id: "personal",
            title: "Personal ",
            content: <PersonalSignUp stepper={stepper} />,
        },

        {
            id: "account",
            title: "Account",
            content: <AccountSignUp stepper={stepper} />,
        },
    ];

    return (
        <div className="horizontal-wizard">
            <Wizard instance={(el) => setStepper(el)} ref={ref} steps={steps} />
        </div>

    );
};

export default WizardSignUp;
