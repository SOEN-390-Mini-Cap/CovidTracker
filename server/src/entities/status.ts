export type Status = {
    statusId: number;
    patientId: number;
    isReviewed: boolean;
    createdOn: Date;
    statusBody: StatusBody;
};

export type StatusBody = {
    [key: string]: StatusLineItem;
};

type StatusLineItem = string | number | boolean;
