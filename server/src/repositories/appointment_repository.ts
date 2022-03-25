import { inject, injectable } from "inversify";
import { Pool, QueryResult } from "pg";
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

    async findAppointments(userId: number): Promise<Appointment[]> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT
                a.appointment_id,
                a.doctor_id,
                a.patient_id,
                a.start_date,
                a.end_date,
                a.address_id,
                ad.address_id,
                ad.street_address,
                ad.street_address_line_two,
                ad.city,
                ad.province,
                ad.postal_code,
                ad.country
            FROM appointments AS a
            JOIN addresses ad on ad.address_id = a.address_id
            WHERE a.patient_id = $1 OR a.doctor_id = $1`;

        const res = await client.query(queryString, [userId]).finally(() => client.release());
        return this.buildAppointments(res);
    }

    private buildAppointments({ rows }: QueryResult): Appointment[] {
        return rows.map(this.buildAppointment);
    }

    private buildAppointment(row: any): Appointment {
        if (!row) {
            return null;
        }

        return {
            appointmentId: row.appointment_id,
            patientId: row.patient_id,
            doctorId: row.doctor_id,
            startDate: new Date(row.start_date),
            endDate: new Date(row.end_date),
            address: {
                addressId: row.address_id,
                streetAddress: row.street_address,
                streetAddressLineTwo: row.street_address_line_two,
                city: row.city,
                province: row.province,
                postalCode: row.postal_code,
                country: row.country,
            },
        };
    }
}
