// ** React Imports
import { Fragment } from "react";

// ** Demo Components
import PaymentMethods from "./PaymentMethods";
import BillingAddress from "./BillingAddress";
import BillingCurrentPlan from "./BillingCurrentPlan";

const BillingTabContent = () => {
    return (
        <Fragment>
            <BillingCurrentPlan />
            <PaymentMethods />
            <BillingAddress />
        </Fragment>
    );
};

export default BillingTabContent;
