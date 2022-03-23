import { inject, injectable, named } from "inversify";
import { UserRepository } from "../repositories/user_repository";
import { LocationReport } from "../entities/location_report";
import { LocationReportRepository } from "../repositories/location_report_repository";

@injectable()
export class LocationReportService {
    constructor(
        @inject("Repository")
        @named("LocationReportRepository")
        private readonly locationReportRepository: LocationReportRepository,
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
    ) {}

    async postLocationReport(locationReport: LocationReport): Promise<void> {
        locationReport.address.addressId = await this.userRepository.addAddress(locationReport.address);
        await this.locationReportRepository.insertLocationReport(locationReport);
    }
}
