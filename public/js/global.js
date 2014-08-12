// DOM Ready
$(document).ready(function() {

    //Populate the user table on initial page load
    populateRestaurantTable();
    populateMemberTable();
    populateReservationTable();

    //Hide Restaurant Input Mask
    $('.inputMask').hide();
    
    hideDetailsBox();

    // Restaurant Listeners
    $('#btnAddRestaurant').on('click', addRestaurant);

    $('#btnAddRestaurantButton').on('click', showRestaurantInputMask);

    $( "#restaurantList" ).on( 'click', '.linkShowRestaurantDetail', showRestaurantDetail);

    $( "#restaurantList" ).on( 'click', '.linkDeleteRestaurant', deleteRestaurant);

    $( '#btnEditRestaurantButton' ).on( 'click', editRestaurant);

    $('#btnUpdateRestaurant').on('click', updateRestaurant);

    // Member Listeners
    $( "#memberList" ).on( 'click', '.linkShowMemberDetail', showMemberDetail);

    $('#btnAddMemberButton').on('click', showMemberInputMask);

    $('#btnAddMember').on('click', addMember);

     $( '#btnDeleteMemberButton' ).on( 'click', deleteMember);

     $( '#btnEditMemberButton' ).on( 'click', editMember);

     $('#btnUpdateMember').on('click', updateMember);

});

// Fill table with data
function populateRestaurantTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/restaurantlist', function( data ) {

        userListData = data;

        // For each item in our JSON, add a table
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this._id + '</td>';
            tableContent += '<td>' + this.name + '</td>';
            //tableContent += '<td><button type="button" class="btn btn-primary btn-sm" id="btnAddRestaurantButton">Small button</button></td>';
            tableContent += '<td><button class="btn btn-mini linkShowRestaurantDetail" rel="' + this._id + '"type="button">Details</button></td>';
       
            tableContent += '<td><button class="btn btn-mini btn-danger linkDeleteRestaurant" rel="' + this._id + '"type="button">Löschen</button></td>';
            tableContent += '</tr>'
        });

        // Inject the whole content string into our existing HTML table
        if(tableContent!=''){
            $('#restaurantList table tbody').html(tableContent);
        }else{
            $('#restaurantList table tbody').html('Keine Restaurants erfasst.');
        }
    
    });
}

// Add Restaurant
function addRestaurant(event) {
	event.preventDefault();

    hideLeftBoxes();

	// Super basic validation - increase errorCount variable if any fields are blank
    /*var errorCount = 0;
    $('#addUser input').each(function(index, val) {
    	if($(this).val() === '') {errorCount++;}
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {*/

    	//If it is, compile all user info into one object
    	var newRestaurant = {
            'name': $('#addRestaurant input#inputName').val(),
            'streetname': $('#addRestaurant  input#inputStreet').val(),
            'streetnr': $('#addRestaurant input#inputStreetnr').val(),
            'zip': $('#addRestaurant input#inputZip').val(),
            'city': $('#addRestaurant input#inputCity').val(),
            'country': 'Switzerland',
            'url': $('#addRestaurant input#inputURL').val(),
            'openh': $('#addRestaurant input#inputOpenH').val(),
            'openm': $('#addRestaurant input#inputOpenM').val(),
            'closeh': $('#addRestaurant input#inputCloseH').val(),
            'closem': $('#addRestaurant input#inputCloseM').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
        	type: 'POST',
        	data: newRestaurant,
        	url: '/addrestaurant',
        	dataType: 'JSON'
        }).done(function( response ){
            console.log(response); 
        	// Check for successful (blank) response
        	if (response === true) {

        		//Clear the form inputs

        		$('#addRestaurant input').val('');
                $('#restaurantInputMask').hide();
        		// Update the table
        		populateRestaurantTable();

        	}else{
        		// If something goes wrong, alert the error message that our service returned
        		alert('Error: ' + response.msg);
        	}
        });
}

function showRestaurantInputMask(event){
    event.preventDefault();
    hideLeftBoxes();
    $('#addRestaurant input').val('');
    $('#btnUpdateRestaurant').hide();
    $('#btnAddRestaurant').show();
    $('#restaurantInputMask').show();
}

function showRestaurantDetail(event){
    event.preventDefault();
    hideLeftBoxes();
    var restaurantID = $( this ).attr('rel');
   

    $.get( "/restaurant/" + restaurantID , function( data ) {

        $('.restaurantInfo').text('');
        $('#restaurantInfoName').text(data.name);
        $('#restaurantInfoStreet').text(data.address.street.name + ' ' + data.address.street.nr);
        $('#restaurantInfoCity').text(data.address.zip + ' ' + data.address.city);
        $('#restaurantInfoCountry').text(data.address.country);
        $('#restaurantInfoURL').text(data.url);
        $('#restaurantInfoOpeninghours').text(data.openinghours.openh + ':' + data.openinghours.openm + ' - ' + data.openinghours.closeh + ':' + data.openinghours.closem);


        $('#restaurantInfoCreated').text(formatDate(data.created));
        $("#btnEditRestaurantButton").attr('rel', data._id);   
        $('#restaurantDetailBox').show();
    });
}

function updateRestaurant( event ){
    event.preventDefault();

    var restaurant = {
        'id' : $( this ).attr('rel'),
        'name': $('#addRestaurant input#inputName').val(),
        'streetname': $('#addRestaurant  input#inputStreet').val(),
        'streetnr': $('#addRestaurant input#inputStreetnr').val(),
        'zip': $('#addRestaurant input#inputZip').val(),
        'city': $('#addRestaurant input#inputCity').val(),
        'country': 'Switzerland',
        'url': $('#addRestaurant input#inputURL').val(),
        'openh': $('#addRestaurant input#inputOpenH').val(),
        'openm': $('#addRestaurant input#inputOpenM').val(),
        'closeh': $('#addRestaurant input#inputCloseH').val(),
        'closem': $('#addRestaurant input#inputCloseM').val()
    }

    $.ajax({
        type: 'POST',
        data: restaurant,
        url: '/updaterestaurant/' + restaurant.id,
        dataType: 'JSON'
    }).done(function( response ){
        // Check for successful (blank) response
        if (response === true) {
            hideLeftBoxes();
            populateRestaurantTable();
        }else{
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
}

function deleteRestaurant(event){
    event.preventDefault();
    hideLeftBoxes();
    var restaurantID = $( this ).attr('rel');

    $.ajax({
        type: 'DELETE',
        data: restaurantID,
        url: '/restaurant/' + restaurantID,
        dataType: 'JSON'
    }).done(function( response ){
        // Check for successful (blank) response
        if (response === true) {
            $('#restaurantDetailBox').hide();
            populateRestaurantTable();

        }else{
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
}

function editRestaurant( event ){
    event.preventDefault();

    var restaurantID = $( this ).attr('rel');

    $.get( "/restaurant/" + restaurantID , function( data ) {
        $('#restaurantDetailBox').hide();
        $('#inputName').val(data.name);
        $('#inputStreet').val(data.address.street.name);
        $('#inputStreetnr').val(data.address.street.nr);
        $('#inputZip').val(data.address.zip);
        $('#inputCity').val(data.address.city);
        $('#inputURL').val(data.url);
        $('#inputOpenH').val(data.openinghours.openh);
        $('#inputOpenM').val(data.openinghours.openm);
        $('#inputCloseH').val(data.openinghours.closeh);
        $('#inputCloseM').val(data.openinghours.closem);
        $('#addRestaurant').attr("action","/updaterestaurant");
        $('#btnUpdateRestaurant').attr('rel',restaurantID);
        $('#btnUpdateRestaurant').show();
        $('#btnAddRestaurant').hide();
        $('#restaurantInputMask').show();
    });
}

/* MEMBERS 
-----------------------
*/
// Fill memberlist table with data
function populateMemberTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/memberlist', function( data ) {

        userListData = data;
        // For each item in our JSON, add a table
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.memberid + '</td>';
            tableContent += '<td>' + this.firstname + '</td>';
            tableContent += '<td>' + this.lastname + '</td>';
            tableContent += '<td><button class="btn btn-mini linkShowMemberDetail" rel="' + this._id + '"type="button">Details</button></td>';
            tableContent += '</tr>'
        });

        // Inject the whole content string into our existing HTML table
        if(tableContent!=''){
            $('#memberList table tbody').html(tableContent);
        }else{
            $('#memberList table tbody').html('Keine Restaurants erfasst.');
        }
    
    });
}

// Add Restaurant
function addMember(event) {
    event.preventDefault();

    hideLeftBoxes();

    // Super basic validation - increase errorCount variable if any fields are blank
    /*var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') {errorCount++;}
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {*/

        //If it is, compile all user info into one object
        var birthday = new Date($('#addMember input#inputBirthdayYear').val(), parseInt($('#addMember input#inputBirthdayMonth').val())-1, $('#addMember input#inputBirthdayDay').val());
        var member = {
            firstname : $('#addMember input#inputFirstname').val(),
            middlename : $('#addMember input#inputMiddleName').val(),
            lastname : $('#addMember input#inputLastname').val(),
              birthday: birthday,
              address: {
                street: {
                    name: $('#addMember input#inputStreetName').val(),
                    nr: $('#addMember input#inputStreetNr').val()
                },
                zip : $('#addMember input#inputPLZ').val(),
                city : $('#addMember input#inputCity').val(),
                country: $('#addMember input#inputCountry').val(),
              },
              email: $('#addMember input#inputEmail').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: member,
            url: '/member',
            dataType: 'JSON'
        }).done(function( response ){
            console.log(response); 
            // Check for successful (blank) response
            if (response === true) {

                //Clear the form inputs

                $('#addMember input').val('');
                $('.inputMask').hide();
                // Update the table
                populateMemberTable();

            }else{
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
}

function showMemberDetail(event){
    event.preventDefault();
    hideLeftBoxes();
    var memberID = $( this ).attr('rel');
   

    $.get( "/api/members/" + memberID , function( data ) {
        console.log(data);

        $('.memberInfo').text('');
        $('#memberInfoHeading').text(data.firstname + ' ' + data.lastname);
        $('#memberInfoFirstname').text(data.firstname);
        $('#memberInfoSecondname').text(data.middlename);
        $('#memberInfoLastname').text(data.lastname);
        $('#memberInfoStreet').text(data.address.street.name + ' ' + data.address.street.nr);
        $('#memberInfoCity').text(data.address.zip + ' ' + data.address.city);
        $('#memberInfoCountry').text(data.address.country);
        $('#memberInfoBirthday').text(data.birthday);
        $('#memberInfoEmail').text(data.email);
        


       
        $("#btnEditMemberButton").attr('rel', data._id); 
        $("#btnDeleteMemberButton").attr('rel', data._id);    
        $('#memberDetailBox').show();
    });
}

function editMember( event ){
    event.preventDefault();

    var memberID = $( this ).attr('rel');

    $.get( "/api/members/" + memberID , function( data ) {

        var birthday = new Date(data.birthday);

        $('#memberDetailBox').hide();
        $('#inputFirstname').val(data.firstname);
        $('#inputMiddleName').val(data.middlename);
        $('#inputLastname').val(data.lastname);
        $('#inputBirthdayDay').val(birthday.getDate());
        $('#inputBirthdayMonth').val(birthday.getMonth()+1);
        $('#inputBirthdayYear').val(birthday.getFullYear());
        $('#inputStreetName').val(data.address.street.name);
        $('#inputStreetNr').val(data.address.street.nr);
        $('#inputPLZ').val(data.address.zip);
        $('#inputCity').val(data.address.city);
        $('#addMember').attr("action","/api/updatemember");
        $('#btnUpdateMember').attr('rel',memberID);
        $('#btnUpdateMember').show();
        $('#btnAddMember').hide();
        $('#memberInputMask').show();
    });
}

function updateMember( event ){
    event.preventDefault();

    var birthday = new Date($('#addMember input#inputBirthdayYear').val(), parseInt($('#addMember input#inputBirthdayMonth').val())-1, $('#addMember input#inputBirthdayDay').val());
    var member = {
        id : $( this ).attr('rel'),
        firstname : $('#addMember input#inputFirstname').val(),
        middlename : $('#addMember input#inputMiddleName').val(),
        lastname : $('#addMember input#inputLastname').val(),
        birthday: birthday,
        address: {
        street: {
            name: $('#addMember input#inputStreetName').val(),
            nr: $('#addMember input#inputStreetNr').val()
        },
        zip : $('#addMember input#inputPLZ').val(),
        city : $('#addMember input#inputCity').val(),
        country: $('#addMember input#inputCountry').val(),
      },
      email: $('#addMember input#inputEmail').val()
    }

    $.ajax({
        type: 'POST',
        data: member,
        url: '/api/updatemember/' + member.id,
        dataType: 'JSON'
    }).done(function( response ){
        // Check for successful (blank) response
        if (response === true) {
            hideLeftBoxes();
            populateMemberTable();
        }else{
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
}


function deleteMember(event){
    event.preventDefault();
    console.log($( this ).attr('rel'));
    var memberID = $( this ).attr('rel');

    $.ajax({
        type: 'DELETE',
        data: memberID,
        url: '/member/' + memberID,
        dataType: 'JSON'
    }).done(function( response ){
        // Check for successful (blank) response
        if (response === true) {
            $('#memberDetailBox').hide();
            populateMemberTable();

        }else{
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
}



function showMemberInputMask(event){
    event.preventDefault();
    hideLeftBoxes();
    $('#addMember input').val('');
    $('#btnUpdateMember').hide();
    $('#btnAddMember').show();
    $('#memberInputMask').show();
}


/* RESERVATIONS 
-----------------------
*/
function showReservationInputMask(event){
    event.preventDefault();
    hideLeftBoxes();
    $('#addReservation input').val('');
    $('#btnUpdateMember').hide();
    $('#btnAddMember').show();
    $('#memberInputMask').show();
}

// Fill memberlist table with data
function populateReservationTable() {
    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/api/reservations', function( data ) {

        reservationListData = data;

        /*
        // For each item in our JSON, add a table
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this._id + '</td>';
            tableContent += '<td>' + this.member.firstname + this.member.lastname'</td>';
            tableContent += '<td>' + this.restaurant.name + '</td>';
            tableContent += '<td>' + this.time + '</td>';
            tableContent += '<td><button class="btn btn-mini linkShowMemberDetail" rel="' + this._id + '"type="button">Details</button></td>';
            tableContent += '</tr>'
        });
        */
        // Inject the whole content string into our existing HTML table
        if(tableContent!=''){
            $('#reservationList table tbody').html(tableContent);
        }else{
            $('#reservationList table tbody').html('Keine Reservationen erfasst.');
        }
    
    });
}





function hideDetailsBox(){
    $('.restaurantInfo').text('');
    $('.detailBox').hide();
};

function hideLeftBoxes(){
    hideDetailsBox();
    $('.inputMask').hide();
};

function formatDate(date) {
    var rawDate = new Date(date);
    var formatedDate = rawDate.getDate() + '.' + rawDate.getMonth() + '.' + rawDate.getFullYear() + ' ' + rawDate.getHours() + ':' + rawDate.getMinutes() + ':' + rawDate.getSeconds();

    return formatedDate;

}