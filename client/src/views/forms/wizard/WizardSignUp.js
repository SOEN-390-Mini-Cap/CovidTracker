import { useRef, useState } from "react";
import Wizard from "@components/wizard";
import PersonalSignUp from "./steps-with-validation/PersonalSignUp";
import AccountSignUp from "./steps-with-validation/AccountSignUp";

import { User, Home } from "react-feather";

const WizardSignUp = () => {
    // ** Ref
    const ref = useRef(null);

    // ** State
    const [stepper, setStepper] = useState(null);

    const [globalData, setGlobalData] = useState(null);

    const steps = [
        {
            id: "personal",
            title: "Personal ",
            icon: <User size={18} />,
            content: <PersonalSignUp stepper={stepper} setGlobalData={setGlobalData}/>,
        },

        {
            id: "account",
            title: "Account",
            icon: <Home size={18} />,
            content: <AccountSignUp stepper={stepper} globalData={globalData}/>,
        },
    ];

    return (
        <div className="horizontal-wizard">
            <Wizard instance={(el) => setStepper(el)} ref={ref} steps={steps} />
        </div>
    );
};

export default WizardSignUp;
