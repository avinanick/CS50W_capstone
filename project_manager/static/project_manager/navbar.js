document.addEventListener('DOMContentLoaded', function() {

    // Attatch a listener to the project creation form
    let create_project_form = document.querySelector("#create-project-form");

    
  });

function create_project() {

    const csrftoken = getCookie('csrftoken');

    fetch('/create_project', {
        headers: {'X-CSRFToken': csrftoken},
        method: 'POST',
        body: JSON.stringify({
            //content: post_content
        })
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