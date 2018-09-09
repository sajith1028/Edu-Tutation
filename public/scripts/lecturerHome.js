var subjectId;

function getClass(selectedClass){
    subjectId=selectedClass.id;
}

function addAssignment(){
    var href = "/lecturer/addAssignmentResults/"+subjectId;
    window.location=href;
}

function addCourseContent(){
    var href = "/lecturer/addCourseContent/"+subjectId;
    window.location=href;
}

function viewResults(){
    var href = "/lecturer/viewResults/"+subjectId;
    window.location=href;
}

function Forums(){
    var href = "/lecturer/forums/"+subjectId;
    window.location=href;
}