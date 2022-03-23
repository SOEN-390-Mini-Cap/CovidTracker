import axios from "axios";

const baseUrl = `http://${process.env.REACT_APP_SERVER_DOMAIN || "localhost"}:${process.env.REACT_APP_SERVER_PORT}`;

export async function submitTestResult(data, patientId, token) {
    await axios.post(
        `${baseUrl}/tests/patients/${patientId}`,
        {
            result: data.testResult.value,
            testType: data.typeOfTest.value,
            testDate: data.dateOfTest.toISOString(),
            streetAddress: data.address,
            streetAddressLineTwo: data.addressLine2,
            city: data.city,
            postalCode: data.postalCode,
            province: data.province.value,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}

export async function getTest(token, testId) {
    const res = await axios.get(`${baseUrl}/tests/${testId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function getUser(token, userId) {
    const res = await axios.get(`${baseUrl}/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function assignRole(data, token) {
    await axios.put(
        `${baseUrl}/users/${data.userId}/roles`,
        {
            role: data.role.value,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}

export async function assignDoctor(data, token) {
    await axios.post(
        `${baseUrl}/patients/${data.patientId}/doctors`,
        {
            doctorId: data.doctorId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}

export async function defineStatusReport(data, token) {
    const { patientId, ...fields } = data;
    await axios.post(
        `${baseUrl}/statuses/fields/patients/${patientId}`,
        {
            ...fields,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}

export async function getPatients(token) {
    const res = await axios.get(`${baseUrl}/patients`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function putPatientPrioritized(token, patientId, isPrioritized) {
    await axios.put(
        `${baseUrl}/patients/${patientId}/prioritize`,
        {
            isPrioritized,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}

export async function getStatus(token, statusId) {
    const res = await axios.get(`${baseUrl}/statuses/${statusId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function submitStatusReport(data, patientId, token) {
    await axios.post(
        `${baseUrl}/statuses/patients/${patientId}`,
        {
            ...data,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}

export async function getFields(patientId, token) {
    const res = await axios.get(`${baseUrl}/statuses/fields/patients/${patientId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function getStatuses(token) {
    const res = await axios.get(`${baseUrl}/statuses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function putStatusReviewed(token, statusId, isReviewed) {
    await axios.put(
        `${baseUrl}/statuses/${statusId}/reviewed`,
        {
            isReviewed,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}

export async function getPatientCounts(token) {
    const res = await axios.get(`${baseUrl}/doctors/patient_counts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function signIn(data) {
    const res = await axios.post(`${baseUrl}/auth/sign_in`, {
        password: data.password,
        email: data.email,
    });

    return res.data;
}

export async function getProfile(token) {
    const res = await axios.get(`${baseUrl}/users/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function signUp(data) {
    const res = await axios.post(`${baseUrl}/auth/sign_up`, {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phone.replaceAll("-", ""),
        gender: data.gender.value,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
        email: data.email,
        password: data.password,
        streetAddress: data.address1,
        streetAddressLineTwo: data.address2,
        city: data.city,
        postalCode: data.postalCode,
        province: data.province.value,
    });

    return res.data;
}

export async function getStatusReports(patientId, token) {
    const res = await axios.get(`${baseUrl}/statuses/patients/${patientId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function getTestResults(patientId, token) {
    const res = await axios.get(`${baseUrl}/tests/patients/${patientId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function postAppointment(token, data) {
    await axios.post(
        `${baseUrl}/appointments`,
        {
            patientId: data.patientId,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
            streetAddress: data.address,
            streetAddressLineTwo: data.addressLine2,
            city: data.city,
            postalCode: data.postalCode,
            province: data.province.value,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}

export async function postLocationReport(token, data) {
    console.log(data);
    await axios.post(
        `${baseUrl}/location_reports`,
        {
            createdOn: data.createdOn.toISOString(),
            streetAddress: data.address,
            streetAddressLineTwo: data.addressLine2,
            city: data.city,
            postalCode: data.postalCode,
            province: data.province.value,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}
