document.addEventListener('DOMContentLoaded', function() {

    // Attatch a listener to the project creation form
    let create_project_form = document.querySelector("#create-project-form");
    document.querySelector("#create-project-button").addEventListener('click', function() {
        document.querySelector("#create-project-overlay").style.display = "block";
    });
    document.querySelector("#project-cancel").addEventListener('click', function() {
        document.querySelector("#create-project-overlay").style.display = "none";
    });
    document.querySelector("#create-project-form").addEventListener('submit', create_project);
    refresh_project_list();
    
  });

function create_project(event) {

    event.preventDefault();

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
        document.querySelector("#create-project-overlay").style.display = "none";
        // Might change this to a redirect
        refresh_project_list();
    })

}

function create_project_link_element(project_name, project_id) {

    let project_link = document.createElement('a');

    project_link.setAttribute("class", "dropdown-item project-link");
    project_link.setAttribute("href", "project/" + project_id);
    project_link.innerHTML = project_name;

    // This will need to be modified to link to the project page

    return project_link;

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

function refresh_project_list() {

    const csrftoken = getCookie('csrftoken');

    let project_list_container = document.querySelector("#projects-list");

    let current_projects = document.querySelectorAll(".project-link");
    for(var project_link of current_projects) {
        project_link.remove();
    }

    fetch('get_projects')
    .then(response => response.json())
    .then(projects => {

        console.log(projects);
        for(let i=0; i < projects.projects.length; i++) {
            project_list_container.appendChild(create_project_link_element(projects.projects[i].name, projects.projects[i].id));
        }

    })

}