import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { Appointment } from "../entities/appointment";

@injectable()
export class AppointmentRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async insertAppointment(appointment: Appointment): Promise<void> {
        const client = await this.pool.connect();

        const queryString = `
            INSERT INTO appointments (
                doctor_id,
                patient_id,
                start_date,
                end_date,
                address_id
            ) VALUES ($1, $2, $3, $4, $5)`;

        client
            .query(queryString, [
                appointment.doctorId,
                appointment.patientId,
                appointment.startDate.toISOString(),
                appointment.endDate.toISOString(),
                appointment.address.addressId,
            ])
            .finally(() => client.release());
    }
}
