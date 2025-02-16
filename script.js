import TaskManager from './TaskManager.js'; // Importing TaskManager class

// Declaring Task Manager object
const taskManager = new TaskManager();

// DOM Elements
const formEl = document.getElementById("taskform");
let taskName = document.getElementById("taskName");
let taskTags = document.getElementsByName("tag-group");
let tagInput = document.getElementById("tag-input");
let tagInputBox = document.getElementById("tag-input-box");
let taskDesc = document.getElementById("description");
let taskDueDate = document.getElementById("due-date");
let taskStatus = document.getElementById("status");
let taskAssignees = document.getElementsByName('person');
let otherButton = document.getElementById("person5");
let otherInput = document.getElementById('other-input');
// Task 4
// return a formated current date string:"YYYY-MM-DD".
const processCurrentDate = () => {
    const today = new Date();
    let dd = today.getDate().toString();
    let mm = (today.getMonth() + 1).toString();
    const yyyy = today.getFullYear();

    if (mm.length < 2) {
        mm = '0' + mm;
    }

    if (dd.length < 2) {
        dd = '0' + dd;
    }

    return [yyyy, mm, dd].join('-');
}
// return a formated time.
const processCurrentTime = () => {
    const today = new Date();
    let hh = today.getHours();
    const mm = today.getMinutes();
    const ss = today.getSeconds();
    let ampm = null;

    if (hh > 12) {
        hh -= 12;
        ampm = 'PM';
    } else {
        ampm = 'AM';
    }

    if (mm < 10) { //correcting the miniute display to two digits
        let newMinute = `${hh}:0${mm}:${ss}`;
        const currentDate = `${newMinute} ${ampm}`;
        return currentDate;
    }
    else {
        const currentDate = `${hh}:${mm}:${ss} ${ampm}`;
        return currentDate;
    }
}

const dueDateFormat = (objDuedate) => {
    const dueDateArr = objDuedate.split('-');
    return `${dueDateArr[2]}/${dueDateArr[1]}/${dueDateArr[0]}`;
}

const getAssignee = () => {
    const assignee = Array.from(taskAssignees);
    const persons = [];
    assignee.map(person => {
        if (person.checked) {
            if (person.id === 'person5') {
                persons.push(otherInput.value);
            } else {
                persons.push(person.value);
            }
        };
    });
    return persons;
}

// Render the feedback from validate to the html for "TaskName", "Descritpion", "DueDate".
// Parameter:result Object. This contains result.status:(true or false), result.feedback: feedback string.
const renderFeedback = (result, idName) => {
    const feedbackValidText = document.getElementById(`valid-${idName}`);
    const feedbackInvalidText = document.getElementById(`invalid-${idName}`);
    if (result.status === true) {
        feedbackValidText.style.display = "block";
        feedbackValidText.innerHTML = result.feedback;
        feedbackInvalidText.style.display = "none";
    } else {
        feedbackValidText.style.display = "none";
        feedbackInvalidText.style.display = "block";
        feedbackInvalidText.innerHTML = result.feedback;
    }
};
// ValidateString function to validate the "TaskName" "Description" and "other assignee" 
// Parameters with 1. form input.  2.expected dataType, 3 minimum length of input string 
// 4 maximum length of input string .
// Function return with reulst object that cotains Boolean values and feed back string.
const validateString = (input, dataType, minLength, maxLength) => {
    let result = { status: false, feedback: '' };
    if (typeof (input) !== dataType) {
        result.status = false
        result.feedback = 'Please insert text for your task.'
        return result;
    }
    if (input.length <= minLength) {
        result.status = false;
        result.feedback = `Please insert text over ${minLength} characters.`;
        return result;
    }
    if (input.length > maxLength) {
        result.status = false;
        result.feedback = `Please insert text less than ${maxLength} characters.`;
        return result;
    }
    result.status = true;
    result.feedback = "The format is good!";
    return result;
};

// Function for the Validatation of the DueDate
// Parameter: currentDate with format "YYYY-MM-DD".  
// Function return with reulst object that cotains Boolean values and feed back string. 
const validateDate = (currDate) => {
    const selectedDate = taskDueDate.value;
    let result = { status: false, feedback: '' };
    if (selectedDate >= currDate) {
        result.status = true;
        result.feedback = "The date is valid.";
        return result;
    } else {
        result.status = false;
        result.feedback = "Cannot set the date earlier than today";
        return result;
    }
};
//The validateAssign function only check at least one person click and offerfeedback.
// doesn't update the change. requires the assistence from function checkAssignChange().
function validateAssign(e) {
    var form_data = new FormData(document.querySelector("form"));
    if (!form_data.has("person")) //checking for the name person[] is present from the checkbox buttons
    {
        document.getElementById("chk_option_error").style.display = "block"; //display invalid feedback if the checkbox isn't checked
        document.getElementById("chk_option_ok").style.display = "none"; //hide the positive feedback 
        return false;
    }
    else //if the form has person
    {
        document.getElementById("chk_option_error").style.display = "none"; //hide the invalid feedback
        document.getElementById("chk_option_ok").style.display = "block"; //display the positive feedback
    }
    // changing feedback if other button was clicked
    const otherBtn = document.getElementById("person5");
    if (otherBtn.checked) {
        document.getElementById("chk_option_error").style.display = "none";
        document.getElementById("chk_option_ok").style.display = "none";
        //validate code to pass the validateForm()
        // 2 is fine because what about initials?
        if (otherInput.value.length < 2 && !e) {
            document.getElementById("chk_option_error").innerText = "please insert text";
            document.getElementById("chk_option_error").style.display = "block";
            document.getElementById("chk_option_ok").style.display = "none";
            return false;
        }
    }
    return true;
};

const validateTaskName = () => {
    const formName = taskName;
    const result = validateString(formName.value, 'string', 8, 100);
    renderFeedback(result, "taskName");
    return result.status;
}


const validateTaskTags = () => {
    const arrResults = [];
    const result = tagInputBox.value;
    const validatedString = validateString(result, 'string', 1, 100);

    renderFeedback(validatedString, "tag");

    if (validatedString.status) {
        return true;
    }
    else {
        return false;
    }
}

const validateTaskDesc = () => {
    const formDesc = taskDesc;
    const result = validateString(formDesc.value, 'string', 15, 200);
    renderFeedback(result, "desc");
    return result.status;
}

const validateTaskDate = () => {
    const result = validateDate(processCurrentDate())
    renderFeedback(result, 'date');
    return result.status;
}
const validateTaskStatus = () => {
    const statuses = taskStatus;
    let result = null
    if (statuses.options[0].selected) {
        result = { feedback: 'Please select atleast one status', status: false };
        renderFeedback(result, "status");
    } else {
        result = { feedback: 'Looks good', status: true };
        renderFeedback(result, "status");
    }
    return result.status;
}

const saveLocalData = (taskObjectArr) => {
    for (let taskObj of taskObjectArr) {
        localStorage.setItem(taskObj.taskID.toString(), JSON.stringify(taskObj));
    }
}
const resetForm = () => {
    const feedbackItems = ['taskName', 'desc', 'date', 'status', 'tag']
    for (let i = 0; i < feedbackItems.length; i++) {
        const item = document.getElementById(`valid-${feedbackItems[i]}`)
        item.style.display = "none";
    }
    //remove bootstrap feedback for assignee (I think assignee)
    const bootstrapFeedback = document.getElementById(`chk_option_ok`)
    bootstrapFeedback.style.display = "none";
    // unlick assignee button
    const assignee = Array.from(taskAssignees);
    assignee.forEach(person => person.checked = false);
    // remove and clear otherInput
    otherInput.style.display = "none";
    otherInput.value = "";
    // make status default again;
    const selectedChoose = taskStatus;
    selectedChoose.selectedIndex = 0;
    // reset the tags 
    const tagsArray = Array.from(taskTags);
    tagsArray.forEach(el => {
        el.parentNode.querySelector('#tag-button-id').click();
    })
}

// Increcement ID doesn' work well. the Unique ID works better for further fucntions
// unique random id using mathematics, time and date (milliseconds)
const tId = () => {
    let id = Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    id += (new Date()).getDate()
    id += (new Date()).getTime();
    return id
}


// If the saved task have ID already. keep the old by passing the ID 
// if it is a new task create a new uniqe ID by id ="needNewid";
//create task object 
const taskObject = (id, taskName, taskDescription, assignee, dueDate, status, img, tags) => {
    let idHolder ='';
    if (id === 'needNewid') {
        idHolder = tId();
    } else {
        idHolder = id;
    }
    return {
        taskID: idHolder,
        taskName: taskName,
        taskDescription: taskDescription,
        assignee: assignee,
        dueDate: dueDate,
        status: status,
        img: img,
        tags:tags
    };
}
const validateTaskForm = () => {
    const checkAllTrue = [];
    // push validation to validation array
    checkAllTrue.push(validateTaskName(), validateTaskDesc(), validateAssign(), validateTaskDate(), validateTaskStatus()); // removed validateTag
    // look at each element, and see if they passed
    return checkAllTrue.every((item) => item);
}
const closeForm = () => {
    const addTaskButton = document.getElementById('submit-button');
    addTaskButton.setAttribute('data-dismiss', 'modal');
    addTaskButton.click();
    addTaskButton.removeAttribute('data-dismiss');
}

const getImage = async () => {
    // see all the tags
    const tagsArray = Array.from(taskTags);

    // if no tags then return an image showing that information
    if (tagsArray.length <= 0) {
        return "resources\\images\\add-tag-no-photo.png"
    } else {
        try {
            const url = `https://api.unsplash.com/search/photos/?query=${tagsArray[0].innerText}&client_id=CyDgrDAy7EetBVsCAWcB5zosSiHDpcx1LVIygKrWkDw&per_page=1`
            const response = await fetch(url);
            const responseJson = await response.json();
            if (responseJson.results.length !== 0) {
                return responseJson.results[0].urls.regular;
            } else {
                return "resources\\images\\unavailable-tag-no-photo.png";
            }
        } catch (error) {
            return "resources\\images\\unavailable-tag-no-photo.png";
        }
    }
}

const main = async (e) => {
    // prevent it from refreshing
    e.preventDefault();
    // Get HTML image
    const image = await getImage();
    // array to verify if all validation has passed
    const passedTrue = validateTaskForm();
    // special function to get array of assignees 
    const taskAssignee = getAssignee();
    // special function to get tags array
    const tagArray = Array.from(taskTags);
    const tags = tagArray.map((tag) => tag.innerText);

    // check if passed validation
    if (passedTrue) {
        // Create a task object (with special assignee value of persons)
        const task = taskObject('needNewid', taskName.value, taskDesc.value, taskAssignee, taskDueDate.value, taskStatus.value, image, tags);
        // add task to manager
        taskManager.addTask(task);
        // Create HTML for task
        const taskHTML = createTaskHTML(task);
        // render task
        taskManager.render(taskHTML);
        // reset the values on the form after submit
        taskName.value = taskDesc.value = taskDueDate.value = taskStatus.value = "";
        // saving the data to local storage
        saveLocalData(taskManager.getAllTasks());
        // disabling the feedback
        resetForm();
        //remove done button if already done
        removeDoneButton();
        // add event listener to delete task after for submit
        deleteTask();
        // Special function to make form disappear with bootstrap
        closeForm();
    }
};
// Task 5 - Date object  // self executing function
const createDate = () => {
    // const currentDate = new Date();
    const headerDateEl = document.getElementById("header-date");
    headerDateEl.innerHTML = processCurrentDate().split('-').join('/') + "<br> " + processCurrentTime();
    setTimeout(createDate, 1000)
}
createDate();


// TASK 10:A: When the task is deltedd, remove the task from the UI 
const deleteTask = (e) => {
    if (e) {
        // prevent from scrolling up
        e.preventDefault();
        // get card body
        const cardBody = e.target.parentNode
        const id = cardBody.id;
        // removes it from the ui
        const wholeCard = e.target.parentNode.parentNode;
        //* return the taskID before delete the UI
        wholeCard.remove();
        // remove it from task manager
        taskManager.deleteTask(id);
        // delete from local storage
        localStorage.removeItem(id);

    } else {
        // deleteTaskUI();
        let rmDeleteTask = Array.from(document.getElementsByClassName('task-delete'));
        rmDeleteTask.forEach(el => el.addEventListener("click", deleteTask));
    }
}

const validateOtherBtn = () => {
    // validate the new assignee 
    const result = validateString(otherInput.value, 'string', 1, 25);
    if (otherInput.value.length < 2) {
        document.getElementById("chk_option_error").style.display = "block";
        document.getElementById("chk_option_error").innerText = "Insert text more than 2 characters"; //display invalid feedback
        document.getElementById("chk_option_ok").style.display = "none";
    } else {
        document.getElementById("chk_option_error").style.display = "none";
        document.getElementById("chk_option_ok").style.display = "block"; //display valid feedback
    }
}

const otherAssigneeClick = () => {
    const okMessage = document.getElementById('chk_option_ok');
    if (otherInput.style.display === "block") {
        otherInput.style.display = "none";
    } else {
        otherInput.style.display = "block";
    }
}

// Event listeners here
formEl.addEventListener("submit", main);
taskName.addEventListener("input", validateTaskName);
tagInput.addEventListener("click", validateTaskTags);
taskDesc.addEventListener("input", validateTaskDesc);
taskDueDate.addEventListener("change", validateTaskDate);
taskStatus.addEventListener("change", validateTaskStatus);
Array.from(taskAssignees).forEach((element) => {
    element.addEventListener('change', validateAssign);
});
otherButton.addEventListener("change", otherAssigneeClick);
otherInput.addEventListener("input", validateOtherBtn);

// Create the HTML element.
const createTaskHTML = (taskObj) => {

    let src = null;
    if (taskObj.img !== undefined) {
        src = taskObj.img;
    } else {
        src = "https://images.unsplash.com/photo-1517849845537-4d257902454a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzODM3NzF8MHwxfHNlYXJjaHwxfHxkb2d8ZW58MHx8fHwxNjY5NzE1Nzcw&ixlib=rb-4.0.3&q=80&w=1080"
    }
    // different badges depending on the status of task
    let badge = null;
    switch (taskObj.status) {
        case 'TODO':
            badge = "info"
            break;
        case 'IN PROGRESS':
            badge = "primary"
            break;
        case 'REVIEW':
            badge = "warning"
            break;
        case 'DONE':
            badge = "success"
            break;
    }
    const cardTemplateHTML = `
        <img src="${src}" class="card-img-top" alt="${taskObj.taskName + 'Image'}" />
        <span class="badge text-bg-danger tags">${taskObj.tags.join(', ')}</span>
        <div class="card-body" id="${taskObj.taskID}">
        <h5 class="card-title"> ${taskObj.taskName} </h5>
        <p class="card-text">${taskObj.taskDescription}
        </p>
        <div class="alert alert-info card-date" role="alert">
            Due: ${dueDateFormat(taskObj.dueDate)}
        </div>
        <div class="status-assign">
            <span class="badge rounded-pill text-bg-${badge} card-status">${taskObj.status}</span>
            <span class="badge text-bg-light">${taskObj.assignee.join(' | ')}</span>
        </div>
        <a href="#" class="btn btn-primary task-delete">Delete task</a>
        <a href="#" class="btn btn-outline-success update-done" >Mark As Done</a>
        </div>
        </div>
        </div>`
    return cardTemplateHTML;
};

// TASK 8:C: When the task is updated, the button on the "Mark as done" should not be seen in the UI and the status of the task should be shown as "Done".
const updateStatusUI = (e) => {
    if (e) {
        const cardBody = e.target.parentNode;
        const status = cardBody.querySelector('.card-status');
        status.parentNode.innerHTML = `<span class="badge rounded-pill text-bg-success card-status">DONE</span>`
        const taskObject = JSON.parse(localStorage.getItem(cardBody.id));
        taskObject.status = "DONE";
        localStorage.setItem(cardBody.id, JSON.stringify(taskObject));
        e.target.remove();
    } else {
        // change status to done
        const btns = document.querySelectorAll(".card .card-body .btn") //get button
        btns.forEach(b => b.addEventListener('click', updateStatusUI));
    }
}
const updateTaskStatus = (e) => {
    e.preventDefault(); // prevents it from scrolling up after clicking
    const taskArray = taskManager.getAllTasks();
    const getDoneButton = e.target;
    const parentNode = getDoneButton.parentNode;
    const cardBody = parentNode;
    taskManager.updateStatus(cardBody.id, "DONE");
    updateStatusUI(e);
}


const removeDoneButton = () => {
    //add event listener for each on keypress
    let doneButton = Array.from(document.getElementsByClassName('update-done'));
    doneButton.forEach(el => el.addEventListener("click", updateTaskStatus));
    const cards = Array.from(document.getElementsByClassName("update-done"));
    cards.forEach((el) => {
        const parentEl = el.parentNode
        const cardStatus = parentEl.querySelector('.card-status').innerText;
        if (cardStatus === "DONE") {
            const doneBtn = parentEl.querySelector('.update-done');
            doneBtn.remove();
        }
    })
}

// render the Tasks from the Task Manager List;
const renderTask = (key, object) => {
    const task = taskObject(key, object.taskName, object.taskDescription, object.assignee, object.dueDate, object.status, object.img, object.tags);
    // add task to manager
    taskManager.addTask(task);
    // Create HTML for task
    const taskHTML = createTaskHTML(task);
    // render task
    taskManager.render(taskHTML);
}
// Read json file from saved objects
const readFromJson = async (filePath) => {
    const response = await fetch(filePath)
    const json = await response.json();
    return json;
}
// Import some json tasks value to localstorage.
const saveJsonToLocal = async () => {
    const temp = await readFromJson('./preLoadTasks.json');
    saveLocalData(temp);
};

// This function only run once.
function once() {
    let first = true;
    return function () {
        if (first) {
            first = false;
            localStorage.setItem("isJsonLoaded", JSON.stringify(false));
            return null;
        } else {
            return null;
        }
    };
};

// Leave the console logs to check IsJsonLoaded 
// check {isloaded : false} in the localstorage, save json objects to local storage when the value is false.
const checkAndSaveJson = () => {
    once(function () { console.log("Checking: Is Json loaded?"); });
    if (localStorage.getItem("isJsonLoaded") === "false") {
        console.log("--------------------")
        saveJsonToLocal();
        localStorage.setItem("isJsonLoaded", JSON.stringify(true));
        console.log("Json is loading to the local storage.")
    } else {
        console.log("Json is loaded before!")
    }
}

const afterwardsEventListener = async () => {
    let doneButton = Array.from(document.getElementsByClassName('update-done'));
    doneButton.forEach(el => el.addEventListener("click", updateTaskStatus));
    // remove done button if status is done
    removeDoneButton();
    let rmDeleteTask = Array.from(document.getElementsByClassName('task-delete'));
    rmDeleteTask.forEach(el => el.addEventListener("click", deleteTask));
};

// Only load saved json objects into local storage one time.
// Render pre-saved taskobjects in localstorage
const renderSavedTasks = () => {
    checkAndSaveJson(); //check the isjosn loaded in the initial run, save json to localstorage.
    const temp = localStorage.getItem("isJsonLoaded");
    localStorage.removeItem("isJsonLoaded");
    //remove the isLoaded value from local storage before render the task in local storage
    const ls = localStorage;
    //render all task from local Storage and find same task in json file/
    for (let i = 0; i < ls.length; i++) {
        const key = ls.key(i)
        //render all saved task from local storage
        const object = JSON.parse(ls.getItem(key));
        renderTask(key, object);
    }
    //*put back the isLoaded status backto local storage for next check.
    localStorage.setItem("isJsonLoaded", temp);
    afterwardsEventListener();
}
renderSavedTasks();

