export type Status = {
    statusId: number;
    patientId: number;
    createdOn: Date;
    status: StatusBody;
};

export type StatusBody = {
    [key: string]: StatusLineItem;
};

type StatusLineItem = string | number | boolean;
