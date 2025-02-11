// Setup the Controls
var $breed_select = $('select.breed_select');
$breed_select.change(function () {
    var id = $(this).children(":selected").attr("id");
    getDogByBreed(id)
});
// Load all the Breeds
function getBreeds() {
    ajax_get('https://api.thedogapi.com/v1/breeds', function (data) {
        populateBreedsSelect(data)
    });
}
// Put the breeds in the Select control
function populateBreedsSelect(breeds) {
    $breed_select.empty().append(function () {
        var output = '';
        $.each(breeds, function (key, value) {
            output += '<option id="' + value.id + '">' + value.name + '</option>';
        });
        return output;
    });
}



// triggered when the breed select control changes
function getDogByBreed(breed_id) {
    // search for images that contain the breed (breed_id=) and attach the breed object (include_breed=1)
    ajax_get('https://api.thedogapi.com/v1/images/search?include_breed=1&breed_id=' + breed_id, function (data) {

        if (data.length == 0) {
            // if there are no images returned
            clearBreed();
            $("#breed_data_table").append("<tr><td>Sorry, no Image for that breed yet</td></tr>");
        } else {
            //else display the breed image and data
            displayBreed(data[0])
        }
    });
}

function getDogByHeight(breed) {

}



// clear the image and table
function clearBreed() {
    $('#breed_image').attr('src', "");
    $("#breed_data_table tr").remove();
}
// display the breed image and data
function displayBreed(image) {
    $('#breed_image').attr('src', image.url);
    $("#breed_data_table tr").remove();

    var breed_data = image.breeds[0]
    $.each(breed_data, function (key, value) {
        // as 'weight' and 'height' are objects that contain 'metric' and 'imperial' properties, just use the metric string
        if (key == 'weight' || key == 'height') value = value.metric
        // add a row to the table
        $("#breed_data_table").append("<tr><td>" + key + "</td><td>" + value + "</td></tr>");
    });
}

// make an Ajax request
function ajax_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch (err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
// call the getBreeds function which will load all the Dog breeds into the select control
getBreeds();