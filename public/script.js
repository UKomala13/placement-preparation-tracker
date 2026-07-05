//to redirect to login page if session is time out
const token = localStorage.getItem("token");
if (token === null) {
    window.location = "login.html"
}


const form = document.getElementById("topicForm");
const topicscontainer = document.getElementById("topicsContainer")
const submitBtn = document.getElementById("submit");
const message = document.getElementById("message");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const logoutbtn = document.getElementById("logoutBtn");

const category = document.getElementById("category");
const topicName = document.getElementById("topicName");
const status = document.getElementById("status");
const questionsSolved = document.getElementById("questionsSolved");

let topics = [];
let editTopicId = null;

function showMessage(text, type) {

    message.textContent = text;

    if (type === "success") {
        message.style.color = "green";
    }
    else if (type === "error") {
        message.style.color = "red";
    }

    setTimeout(() => {
        message.textContent = "";
    }, 3000);
}

function resetForm() {
    form.reset();
    editTopicId = null;
    submitBtn.textContent = "Add Topic";
}

function populateCategoryFilter() {  //to fill the dropdown

    categoryFilter.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "All";
    allOption.textContent = "All Categories";
    categoryFilter.append(allOption);

    const categories = topics.map(topic => topic.category);
    const uniqueCategories = [...new Set(categories)];   //array->set->array

    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.append(option);
    })

}

function applyFilters() {
    let filteredTopics = topics;
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    if (searchText !== "") {
        filteredTopics = filteredTopics.filter(topic =>
            topic.topic_name.toLowerCase().includes(searchText)
        );
    }
    if (selectedCategory !== "All") {
        filteredTopics = filteredTopics.filter(topic =>
            topic.category === selectedCategory
        )
    }
    topicscontainer.innerHTML = "";
    if (filteredTopics.length === 0) {
        topicscontainer.innerHTML = "<h2> No topics found </h2>";
        return;
    }
    renderTopics(filteredTopics);
}

function handleUnauthorized(response) {
    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location = "login.html";
        return true;
    }

    return false;
}

function renderTopics(topicsArray) {
    topicsArray.forEach(topic => {
        let div = document.createElement("div");
        div.innerHTML = `
            <h3>Category: ${topic.category}</h3>
            <h3>Topic: ${topic.topic_name}</h3>
            <h3>Status: ${topic.status}</h3>
            <h3>Questions Solved: ${topic.questions_solved}</h3>

            <button onClick="editTopic(${topic.id})">Edit</button>
            <button onClick="deleteTopic(${topic.id})">Delete</button>
        `;

        topicscontainer.append(div);
    });
}

async function getTopics() {
    const response = await fetch("http://localhost:3000/topics", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (handleUnauthorized(response)) {
        return;
    }

    topics = await response.json();

    populateCategoryFilter();

    if (topics.length === 0) {
        topicscontainer.innerHTML = `
        <h2>No topics found.</h2>
        <p>Click "Add Topic" to create your first topic.</p>
    `;
        return;
    }

    topicscontainer.innerHTML = ""; //to clear the container before fetching new topics
    console.log(topics);
    applyFilters();

}


function editTopic(id) {

    editTopicId = id;
    const topic = topics.find(t => t.id == Number(id));

    category.value = topic.category;
    topicName.value = topic.topic_name;
    status.value = topic.status;
    questionsSolved.value = topic.questions_solved;
    submitBtn.textContent = "Update Topic";

    console.log("Editing topics:", topic);
}

async function deleteTopic(id) {

    const topic = topics.find(t => t.id == Number(id));
    const isConfirmed = confirm(`Are you sure you want to delete this topic ${topic.topic_name}?`);

    if (!isConfirmed) {
        return;
    }

    const response = await fetch(`http://localhost:3000/topics/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }

    });

    if (handleUnauthorized(response)) {
        return;
    }
    await getTopics();
    showMessage("Topic deleted successfully");
}

async function addTopic(topicData) {
    const response = await fetch("http://localhost:3000/topics", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(topicData)
    });
    if (handleUnauthorized(response)) {
        return;
    }
    return response;
}

async function updateTopic(topicData) {
    const response = await fetch(`http://localhost:3000/topics/${editTopicId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(topicData)
    });

    if (handleUnauthorized(response)) {
        return;
    }

    return response;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const topicData = {
        category: category.value,
        topicName: topicName.value,
        status: status.value,
        questionsSolved: questionsSolved.value
    };

    let response;
    let successMessage;
    
    if (editTopicId === null) {
        response = await addTopic(topicData);
        successMessage = "Topic added successfully!";
    } else {
        response = await updateTopic(topicData);
        successMessage = "Topic updated successfully!";
    }

    if (response.ok) {
        await getTopics();
        resetForm();
        showMessage(successMessage, "success");
    } else {
        showMessage("Operation failed!", "error");
    }

});

searchInput.addEventListener("input", () => {
    applyFilters();
});

categoryFilter.addEventListener("change", () => {
    applyFilters();
});

logoutbtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location = "login.html"
})

getTopics();