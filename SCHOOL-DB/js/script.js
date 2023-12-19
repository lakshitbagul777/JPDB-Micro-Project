
let conntoken = '90931960|-31949303127182622|90960513';
let dbname = 'SCHOOL-DB';
let relname = 'STUDENT-TABLE';
let jpdbBaseURL = 'http://api.login2explore.com:5577';
let jpdbIRL = '/api/irl';
let jpdbIML = '/api/iml';

$("#save").prop("disabled",true);
$("#change").prop("disabled",true);
$("#reset").prop("disabled",true);
$("#rollno").focus();

function resetForm(){
    $("#rollno").val("");
    $("#fullname").val("");
    $("#class").val("");
    $("#birthdate").val("");
    $("#address").val("");
    $("#enrolldate").val("");
    $("#change").prop("disabled",true)
    $("#save").prop("disabled",true)
    $("#reset").prop("disabled",true);
    $("#rollno").prop("disabled",false);
    $("#rollno").focus();
}

function saveForm(){
    let jsonStrObj = validateData();

    if(jsonStrObj==='')
        return '';
    
    let putreq = createPUTRequest(conntoken,jsonStrObj,dbname,relname);
    jQuery.ajaxSetup({async:false});
    let response = executeCommandAtGivenBaseUrl(putreq,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    alert("Data Saved into Database Successfully!");
    $("#rollno").focus();
}

function validateData(){
    let  stdroll,stdname,stdclass,stddob,stdaddr,stdenroll;
    stdroll = $("#rollno").val();
    stdclass = $("#class").val();
    stddob = $("#birthdate").val();
    stdaddr = $("#address").val();
    stdname = $("#fullname").val();
    stdenroll = $("#enrolldate").val();
    if(stdroll ===''){
        alert('Roll No Missing');
        $('#rollno').focus();
        return '';
    }
    if(stdname ===''){
        alert('Name Missing');
        $('#fullname').focus();
        return '';
    }
    if(stdclass ===''){
        alert('Class Missing');
        $('#class').focus();
        return '';
    }
    if(stddob ===''){
        alert('Birth Date Missing');
        $('#birthdate').focus();
        return '';
    }
    if(stdaddr ===''){
        alert('Address Missing');
        $('#address').focus();
        return '';
    }
    if(stdenroll ===''){
        alert('Enrollment Date Missing');
        $('#enrolldate').focus();
        return '';
    }

    let jsonStrObj = {
            RollNo : stdroll,
            FullName : stdname,
            Class : stdclass,
            BirthDate : stddob,
            Address : stdaddr,
            EnrollmentDate : stdenroll
        
    };

    return JSON.stringify(jsonStrObj);
}

function changeData(){
    $("#change").prop("disabled",true);
    jsonStrObj = validateData();
    let updatereq = createUPDATERecordRequest(conntoken,jsonStrObj,dbname,relname,localStorage.getItem("rec_no"));
    jQuery.ajaxSetup({async:false});
    let response = executeCommandAtGivenBaseUrl(updatereq,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    alert("Database updated successfully!");
    $("#rollno").focus();
}

function getRollAsjson(){
    let rollno = $("#rollno").val();
    let jsonStr = { RollNo : rollno};
    return JSON.stringify(jsonStr);
}

function getRoll(){
    jsonrollno = getRollAsjson();
    let getreq = createGET_BY_KEYRequest(conntoken,dbname,relname,jsonrollno);
    jQuery.ajaxSetup({async:false});
    let response = executeCommandAtGivenBaseUrl(getreq,jpdbBaseURL,jpdbIRL);
    jQuery.ajaxSetup({async:true});

    if(response.status===400){
        $("#save").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#rollno").focus();
    }
    else if(response.status === 200){
        $("#rollno").prop("disabled",true);
        console.log(response);
        fillData(response);
        $("#change").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#save").prop("disabled",true);
        $("#fullname").focus();
    }
}

function fillData(jsonRes){
    saveRollToLS(jsonRes);
    let record = JSON.parse(jsonRes.data).record;
    $("#fullname").val(record.FullName);
    $("#class").val(record.Class);
    $("#birthdate").val(record.BirthDate);
    $("#address").val(record.Address);
    $("#enrolldate").val(record.EnrollmentDate);
}

function saveRollToLS(jsonRes)
{
    let data = JSON.parse(jsonRes.data);
    localStorage.setItem("rec_no",data.rec_no);

}