import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect } from "react";

async function getStatusReports(patientId, token) {
    const res = await axios.get(`http://localhost:8080/statuses/patients/${patientId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

const selectToken = (state) => state.auth.userData.token;
const selectUserId = (state) => state.auth.userData.user.account.userId;

function StatusReports() {
    const token = useSelector(selectToken);
    const userId = useSelector(selectUserId);

    useEffect(() => {
        async function f() {
            const statusReports = await getStatusReports(userId, token);
            console.log(statusReports);
        }
        f();
    }, [token, userId]);

    return (
        <div>
            <h2>Hello</h2>
        </div>
    );
}

export default StatusReports;
