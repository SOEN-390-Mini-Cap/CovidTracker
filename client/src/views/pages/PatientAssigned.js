import BreadCrumbsPage from "@components/breadcrumbs";

function PatientsAssigned() {
    return (
        <div>
            <BreadCrumbsPage
                breadCrumbTitle="Patients Assigned"
                breadCrumbParent="Doctor"
                breadCrumbActive="Patients Assigned"
            />
        </div>
    );
}

export default PatientsAssigned;
