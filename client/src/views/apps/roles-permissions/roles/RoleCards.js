// ** React Imports
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";

// ** Reactstrap Imports
import {
    Row,
    Col,
    Card,
    Label,
    Input,
    Table,
    Modal,
    Button,
    CardBody,
    ModalBody,
    ModalHeader,
    FormFeedback,
    UncontrolledTooltip,
} from "reactstrap";

// ** Third Party Components
import { Copy, Info } from "react-feather";
import { useForm, Controller } from "react-hook-form";

// ** Custom Components
import AvatarGroup from "@components/avatar-group";

// ** Vars

const rolesArr = [
    "User Management",
    "Content Management",
    "Disputes Management",
    "Database Management",
    "Financial Management",
    "Reporting",
    "API Control",
    "Repository Management",
    "Payroll",
];

const RoleCards = () => {
    // ** States
    const [show, setShow] = useState(false);
    const [modalType, setModalType] = useState("Add New");

    // ** Hooks
    const {
        reset,
        control,
        setError,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: { roleName: "" } });

    const onSubmit = (data) => {
        if (data.roleName.length) {
            setShow(false);
        } else {
            setError("roleName", {
                type: "manual",
            });
        }
    };

    const onReset = () => {
        setShow(false);
        reset({ roleName: "" });
    };

    const handleModalClosed = () => {
        setModalType("Add New");
        setValue("roleName");
    };

    return (
        <Fragment>
            <Row>
                <Col xl={4} md={6}>
                    <Card>
                        <Row>
                            <Col sm={5}>
                                <div className="d-flex align-items-end justify-content-center h-100"></div>
                            </Col>
                            <Col sm={7}>
                                <CardBody className="text-sm-end text-center ps-sm-0">
                                    <Button
                                        color="primary"
                                        className="text-nowrap mb-1"
                                        onClick={() => {
                                            setModalType("Add New");
                                            setShow(true);
                                        }}
                                    >
                                        Add New Role
                                    </Button>
                                    <p className="mb-0">Add a new role, if it does not exist</p>
                                </CardBody>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Modal
                isOpen={show}
                onClosed={handleModalClosed}
                toggle={() => setShow(!show)}
                className="modal-dialog-centered modal-lg"
            >
                <ModalHeader className="bg-transparent" toggle={() => setShow(!show)}></ModalHeader>
                <ModalBody className="px-5 pb-5">
                    <div className="text-center mb-4">
                        <h1>{modalType} Role</h1>
                        <p>Set role permissions</p>
                    </div>
                    <Row tag="form" onSubmit={handleSubmit(onSubmit)}>
                        <Col xs={12}>
                            <Label className="form-label" for="roleName">
                                Role Name
                            </Label>
                            <Controller
                                name="roleName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="roleName"
                                        placeholder="Enter role name"
                                        invalid={errors.roleName && true}
                                    />
                                )}
                            />
                            {errors.roleName && <FormFeedback>Please enter a valid role name</FormFeedback>}
                        </Col>
                        <Col xs={12}>
                            <h4 className="mt-2 pt-50">Role Permissions</h4>
                            <Table className="table-flush-spacing" responsive>
                                <tbody>
                                    <tr>
                                        <td className="text-nowrap fw-bolder">
                                            <span className="me-50"> Administrator Access</span>
                                            <Info size={14} id="info-tooltip" />
                                            <UncontrolledTooltip placement="top" target="info-tooltip">
                                                Allows a full access to the system
                                            </UncontrolledTooltip>
                                        </td>
                                        <td>
                                            <div className="form-check">
                                                <Input type="checkbox" id="select-all" />
                                                <Label className="form-check-label" for="select-all">
                                                    Select All
                                                </Label>
                                            </div>
                                        </td>
                                    </tr>
                                    {rolesArr.map((role, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="text-nowrap fw-bolder">{role}</td>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="form-check me-3 me-lg-5">
                                                            <Input type="checkbox" id={`read-${role}`} />
                                                            <Label className="form-check-label" for={`read-${role}`}>
                                                                Read
                                                            </Label>
                                                        </div>
                                                        <div className="form-check me-3 me-lg-5">
                                                            <Input type="checkbox" id={`write-${role}`} />
                                                            <Label className="form-check-label" for={`write-${role}`}>
                                                                Write
                                                            </Label>
                                                        </div>
                                                        <div className="form-check">
                                                            <Input type="checkbox" id={`create-${role}`} />
                                                            <Label className="form-check-label" for={`create-${role}`}>
                                                                Create
                                                            </Label>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </Col>
                        <Col className="text-center mt-2" xs={12}>
                            <Button type="submit" color="primary" className="me-1">
                                Submit
                            </Button>
                            <Button type="reset" outline onClick={onReset}>
                                Discard
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};

export default RoleCards;
