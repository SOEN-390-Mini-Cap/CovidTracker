import axios from "axios";

export async function submitTestResult(data, patientId, token) {
    await axios.post(
        `http://localhost:8080/tests/patients/${patientId}`,
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
    const res = await axios.get(`http://localhost:8080/tests/${testId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function getUser(token, userId) {
    const res = await axios.get(`http://localhost:8080/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function assignRole(data, token) {
    await axios.put(
        `http://localhost:8080/users/${data.userId}/roles`,
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
        `http://localhost:8080/patients/${data.patientId}/doctors`,
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
        `http://localhost:8080/statuses/fields/patients/${patientId}`,
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
    const res = await axios.get("http://localhost:8080/patients", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function putPatientPrioritized(token, patientId, isPrioritized) {
    await axios.put(
        `http://localhost:8080/patients/${patientId}/prioritize`,
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
    const res = await axios.get(`http://localhost:8080/statuses/${statusId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function submitStatusReport(data, patientId, token) {
    await axios.post(
        `http://localhost:8080/statuses/patients/${patientId}`,
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
    const res = await axios.get(`http://localhost:8080/statuses/fields/patients/${patientId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function getStatuses(token) {
    const res = await axios.get("http://localhost:8080/statuses", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function putStatusReviewed(token, statusId, isReviewed) {
    await axios.put(
        `http://localhost:8080/statuses/${statusId}/reviewed`,
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
    const res = await axios.get("http://localhost:8080/doctors/patient_counts", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function signIn(data) {
    const res = await axios.post("http://localhost:8080/auth/sign_in", {
        password: data.password,
        email: data.email,
    });

    return res.data;
}

export async function getProfile(token) {
    const res = await axios.get("http://localhost:8080/users/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

export async function signUp(data) {
    const res = await axios.post("http://localhost:8080/auth/sign_up", {
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
