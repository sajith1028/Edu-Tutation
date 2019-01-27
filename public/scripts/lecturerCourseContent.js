var form = $('#form').parsley();
function validate(){
    var form = $(this);
    form.parsley().validate();
    if (form.parsley().isValid()){
        alert()
    }    
    return false
}
