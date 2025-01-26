export class ApiResponse{
    statuscode:number;
    data:any;
    message:string;

    constructor(statuscode:number,data:any,message:string){
        this.statuscode=statuscode;
        this.data=data;
        this.message=message;
    }
}