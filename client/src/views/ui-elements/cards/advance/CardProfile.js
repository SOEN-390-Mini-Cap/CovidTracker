// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import { Card, CardBody, CardImg, Badge } from "reactstrap";

// ** Images

const CardProfile = () => {
    return (
        <Card className="card-profile">
            <CardImg className="img-fluid" top />
            <CardBody>
                <div className="profile-image-wrapper">
                    <div className="profile-image">
                        <Avatar />
                    </div>
                </div>
                <h3>Curtis Stone</h3>
                <h6 className="text-muted">Malaysia</h6>
                <Badge className="profile-badge" color="light-primary">
                    Pro Level
                </Badge>
                <hr className="mb-2" />
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="text-muted fw-bolder">Followers</h6>
                        <h3 className="mb-0">10.3k</h3>
                    </div>
                    <div>
                        <h6 className="text-muted fw-bolder">Projects</h6>
                        <h3 className="mb-0">156</h3>
                    </div>
                    <div>
                        <h6 className="text-muted fw-bolder">Rank</h6>
                        <h3 className="mb-0">23</h3>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default CardProfile;
