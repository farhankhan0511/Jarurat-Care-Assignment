export const DB_NAME:string="jaruratngo"



export enum statuscodes {
    NOTFOUND=404,
    SUCCESFULL=200,
    INTERNALERROR=500,
    BADREQUEST=400,
    CREATED=201,
}

export enum AssignmentStatus{
    success="success",
    failed="failed"
}
export interface Timestamps {
    createdAt?: Date;
    updatedAt?: Date;
}
export enum defexpiry{
    access=24*60*60*60,
    refresh=10*24*60*60*60,
}