document.addEventListener('DOMContentLoaded', function() {

    // Attatch a listener to the project creation form
    let create_project_form = document.querySelector("#create-project-form");
    document.querySelector("#create-project-button").addEventListener('click', function() {
        document.querySelector("#create-project-overlay").style.display = "block";
    });
    document.querySelector("#project-cancel").addEventListener('click', function() {
        document.querySelector("#create-project-overlay").style.display = "none";
    });
    
  });

function create_project() {

    const csrftoken = getCookie('csrftoken');

    let name_input = document.querySelector('#project-name-input');
    let description_input = document.querySelector('#project-description-input');


    fetch('/create_project', {
        headers: {'X-CSRFToken': csrftoken},
        method: 'POST',
        body: JSON.stringify({
            //content: post_content
            project_name: name_input.value,
            project_description: description_input.value
        })
    })
    .then(response => {
        console.log(response);
    })

}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}