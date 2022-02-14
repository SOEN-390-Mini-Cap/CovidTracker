import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, interfaces, Get } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { DoctorService } from "../services/doctor_service";

@Controller("/doctors")
@injectable()
export class DoctorController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("DoctorService")
        private readonly doctorService: DoctorService,
    ) {}

    @Get("/patient_counts", "extractJwtMiddleware", "isValidAdminMiddleware")
    private async getPatientCounts(req: Request, res: Response): Promise<void> {
        try {
            const patientCounts = await this.doctorService.getPatientCounts();

            res.json(200, patientCounts);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }
}
